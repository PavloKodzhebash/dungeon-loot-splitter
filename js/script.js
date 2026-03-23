// storage key
const STORAGE_KEY = "lootSplitterState";

// application state
let loot = [];
let partySize = 1;

// DOM elements
let partySizeInput = document.getElementById("partySize");
let lootNameInput = document.getElementById("lootName");
let lootValueInput = document.getElementById("lootValue");
let lootQuantityInput = document.getElementById("lootQuantity");

let addLootBtn = document.getElementById("addLootBtn");
let splitBtn = document.getElementById("splitBtn");
let resetBtn = document.getElementById("resetBtn");

let totalLootSpan = document.getElementById("totalLoot");
let lootPerMemberSpan = document.getElementById("lootPerMember");

let lootRows = document.getElementById("lootRows");
let noLootMessage = document.getElementById("noLootMessage");
let errorMessage = document.getElementById("errorMessage");

let syncBtn = document.getElementById("syncBtn");
let loadBtn = document.getElementById("loadBtn");
let serverMessage = document.getElementById("serverMessage");

// event listeners
addLootBtn.addEventListener("click", addLoot);
splitBtn.addEventListener("click", splitLoot);
resetBtn.addEventListener("click", resetAll);
syncBtn.addEventListener("click", syncToServer);
loadBtn.addEventListener("click", loadFromServer);

partySizeInput.addEventListener("input", function(){
    let value = parseInt(partySizeInput.value);
    if(value >= 1){
        partySize = value;
        saveState();
        updateUI();
    }
});

// save state
function saveState(){
    let state = { loot: loot, partySize: partySize };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// restore state
function restoreState(){
    let saved = localStorage.getItem(STORAGE_KEY);
    if(!saved) return;
    try{
        let parsed = JSON.parse(saved);
        if(typeof parsed !== "object") return;

        if(Array.isArray(parsed.loot)){
            for(let item of parsed.loot){
                if(item.name && item.name.trim() !== "" &&
                   typeof item.value === "number" && item.value >= 0 &&
                   typeof item.quantity === "number" && item.quantity >= 1){
                    loot.push(item);
                }
            }
        }

        if(typeof parsed.partySize === "number" && parsed.partySize >= 1){
            partySize = parsed.partySize;
            partySizeInput.value = partySize;
        }
    }catch(error){
        console.log("Restore failed");
    }
}

// add loot
function addLoot(){
    let name = lootNameInput.value.trim();
    let value = parseFloat(lootValueInput.value);
    let quantity = parseInt(lootQuantityInput.value);
    errorMessage.innerText = "";

    if(name === ""){ errorMessage.innerText = "Item name required"; return; }
    if(isNaN(value) || value < 0){ errorMessage.innerText = "Invalid value"; return; }
    if(isNaN(quantity) || quantity < 1){ errorMessage.innerText = "Invalid quantity"; return; }

    loot.push({name, value, quantity});
    saveState();

    lootNameInput.value = "";
    lootValueInput.value = "";
    lootQuantityInput.value = 1;

    updateUI();
}

// remove loot
function removeLoot(index){
    loot.splice(index,1);
    saveState();
    updateUI();
}

// split loot
function splitLoot(){
    let total = loot.reduce((sum,item) => sum + item.value * item.quantity, 0);
    lootPerMemberSpan.innerText = (total / partySize).toFixed(2);
}

// update UI
function updateUI(){
    let total = loot.reduce((sum,item) => sum + item.value * item.quantity, 0);
    totalLootSpan.innerText = total.toFixed(2);

    lootRows.innerHTML = "";
    loot.forEach((item,i)=>{
        let row = document.createElement("div");
        row.className = "loot-row";

        let nameCell = document.createElement("div");
        nameCell.className = "loot-cell"; nameCell.innerText = item.name;

        let valueCell = document.createElement("div");
        valueCell.className = "loot-cell"; valueCell.innerText = item.value.toFixed(2);

        let quantityCell = document.createElement("div");
        quantityCell.className = "loot-cell"; quantityCell.innerText = item.quantity;

        let actionCell = document.createElement("div");
        actionCell.className = "loot-cell";
        let removeBtn = document.createElement("button"); removeBtn.innerText = "Remove";
        removeBtn.addEventListener("click", ()=>removeLoot(i));
        actionCell.appendChild(removeBtn);

        row.append(nameCell, valueCell, quantityCell, actionCell);
        lootRows.appendChild(row);
    });

    noLootMessage.classList.toggle("hidden", loot.length > 0);
    splitBtn.disabled = loot.length === 0 || partySize < 1;
}

// reset
function resetAll(){
    loot = [];
    partySize = 1;
    partySizeInput.value = 1;
    localStorage.removeItem(STORAGE_KEY);
    lootPerMemberSpan.innerText = "0.00";
    updateUI();
}

// ---- Phase 4: External Sync ----
function syncToServer(){
    serverMessage.innerText = "";
    const payload = { studentId: "pavloH", state: { loot, partySize } };

    fetch(`http://goldtop.hopto.org/save/pavloH`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "saved") serverMessage.innerText = "Sync successful!";
        else serverMessage.innerText = "Sync failed: invalid server response";
    })
    .catch(err => serverMessage.innerText = "Sync error: " + err);
}

function loadFromServer(){
    serverMessage.innerText = "";
    fetch(`http://goldtop.hopto.org/load/pavloH`)
    .then(res => res.json())
    .then(data => {
        if(data.status === "loaded" && data.studentId === "pavloH"){
            const newLoot = [];
            const party = data.state.partySize;

            if(Array.isArray(data.state.loot)){
                for(const item of data.state.loot){
                    if(item.name && typeof item.value==="number" && item.value>=0 &&
                       typeof item.quantity==="number" && item.quantity>=1){
                        newLoot.push(item);
                    } else {
                        serverMessage.innerText="Load failed: invalid loot item"; return;
                    }
                }
            } else { serverMessage.innerText="Load failed: loot missing"; return; }

            if(typeof party!=="number" || party<1){ serverMessage.innerText="Load failed: invalid party size"; return; }

            // Assign validated state
            loot = newLoot;
            partySize = party;
            partySizeInput.value = partySize;

            saveState();
            updateUI();

            serverMessage.innerText = "Load successful!";
        } else if(data.status === "empty"){
            serverMessage.innerText="No server data found";
        } else {
            serverMessage.innerText="Invalid server response";
        }
    })
    .catch(err => serverMessage.innerText = "Load error: "+err);
}

// initialize
document.addEventListener("DOMContentLoaded", function(){
    restoreState();
    updateUI();
});
