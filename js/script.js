// Persistent loot array
let loot = [];

// DOM elements
let partySizeInput = document.getElementById("partySize");
let lootNameInput = document.getElementById("lootName");
let lootValueInput = document.getElementById("lootValue");

let addLootBtn = document.getElementById("addLootBtn");
let splitLootBtn = document.getElementById("splitLootBtn");

let lootList = document.getElementById("lootList");
let runningTotal = document.getElementById("runningTotal");
let finalTotal = document.getElementById("finalTotal");
let perMember = document.getElementById("perMember");

let lootError = document.getElementById("lootError");
let splitError = document.getElementById("splitError");

// Add Loot Function
function addLoot() {

    lootError.textContent = "";

    let name = lootNameInput.value.trim();
    let value = parseFloat(lootValueInput.value);

    if (name === "") {
        lootError.textContent = "Loot name cannot be empty.";
        return;
    }

    if (isNaN(value) || value < 0) {
        lootError.textContent = "Loot value must be a positive number.";
        return;
    }

    let lootItem = {
        name: name,
        value: value
    };

    loot.push(lootItem);

    lootNameInput.value = "";
    lootValueInput.value = "";

    renderLoot();
}

// Render Loot List
function renderLoot() {

    lootList.innerHTML = "";

    let total = 0;

    for (let i = 0; i < loot.length; i++) {
        let li = document.createElement("li");
        li.textContent = loot[i].name + " - $" + loot[i].value.toFixed(2);
        lootList.appendChild(li);

        total += loot[i].value;
    }

    runningTotal.textContent = total.toFixed(2);
}

// Split Loot Function
function splitLoot() {

    splitError.textContent = "";

    let partySize = parseInt(partySizeInput.value);

    if (isNaN(partySize) || partySize < 1) {
        splitError.textContent = "Party size must be at least 1.";
        return;
    }

    if (loot.length === 0) {
        splitError.textContent = "No loot to split.";
        return;
    }

    let total = 0;

    for (let i = 0; i < loot.length; i++) {
        total += loot[i].value;
    }

    let splitAmount = total / partySize;

    finalTotal.textContent = total.toFixed(2);
    perMember.textContent = splitAmount.toFixed(2);
}

// Event Listeners
addLootBtn.addEventListener("click", addLoot);
splitLootBtn.addEventListener("click", splitLoot);
