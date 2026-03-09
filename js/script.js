// --- State ---
let loot = [];
let partySizeInput = document.getElementById("partySize");

let lootRows = document.getElementById("lootRows");
let totalLootSpan = document.getElementById("totalLoot");
let splitTotalSpan = document.getElementById("splitTotal");
let lootPerMemberSpan = document.getElementById("lootPerMember");
let splitResults = document.getElementById("splitResults");
let splitBtn = document.getElementById("splitBtn");

let lootNameInput = document.getElementById("lootName");
let lootValueInput = document.getElementById("lootValue");
let lootQtyInput = document.getElementById("lootQty");

let lootError = document.getElementById("lootError");
let partyError = document.getElementById("partyError");
let noLootMessage = document.getElementById("noLootMessage");

// --- Functions ---
function addLoot() {
    lootError.classList.add("hidden");

    let name = lootNameInput.value.trim();
    let value = parseFloat(lootValueInput.value);
    let qty = parseInt(lootQtyInput.value);

    if (!name) {
        lootError.innerText = "Loot name cannot be empty.";
        lootError.classList.remove("hidden");
        return;
    }

    if (isNaN(value) || value < 0) {
        lootError.innerText = "Loot value must be 0 or greater.";
        lootError.classList.remove("hidden");
        return;
    }

    if (isNaN(qty) || qty < 1) {
        lootError.innerText = "Quantity must be 1 or greater.";
        lootError.classList.remove("hidden");
        return;
    }

    loot.push({name: name, value: value, quantity: qty});

    // Сбрасываем поля после добавления
    lootNameInput.value = "";
    lootValueInput.value = "";
    lootQtyInput.value = "1"; // исправлено

    updateUI();
}

function removeLoot(index) {
    loot.splice(index, 1);
    updateUI();
}

function updateUI() {
    // --- Party Size ---
    let partySize = parseInt(partySizeInput.value);
    if (isNaN(partySize) || partySize < 1) {
        partyError.innerText = "Party size must be 1 or greater.";
        partyError.classList.remove("hidden");
    } else {
        partyError.classList.add("hidden");
    }

    // --- Render Loot ---
    lootRows.innerHTML = "";

    if (loot.length === 0) {
        noLootMessage.classList.remove("hidden");
    } else {
        noLootMessage.classList.add("hidden");
    }

    for (let i = 0; i < loot.length; i++) {
        let row = document.createElement("div");
        row.className = "loot-row";
        row.style.display = "grid";
        row.style.gridTemplateColumns = "3fr 1fr 1fr 1fr";
        row.style.gap = "0.5rem";
        row.style.alignItems = "center";

        let nameCell = document.createElement("div");
        nameCell.innerText = loot[i].name;

        let valueCell = document.createElement("div");
        valueCell.innerText = loot[i].value.toFixed(2);

        let qtyCell = document.createElement("div");
        qtyCell.innerText = loot[i].quantity;

        let actionCell = document.createElement("div");
        let removeBtn = document.createElement("button");
        removeBtn.innerText = "Remove";
        removeBtn.addEventListener("click", function() {
            removeLoot(i);
        });
        actionCell.appendChild(removeBtn);

        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(qtyCell);
        row.appendChild(actionCell);

        lootRows.appendChild(row);
    }

    // --- Calculate Totals ---
    let total = 0;
    for (let i = 0; i < loot.length; i++) {
        total += loot[i].value * loot[i].quantity;
    }
    totalLootSpan.innerText = total.toFixed(2);

    // --- Split Loot ---
    if (loot.length === 0 || isNaN(partySize) || partySize < 1) {
        splitResults.classList.add("hidden");
        splitBtn.disabled = true;
    } else {
        splitResults.classList.remove("hidden");
        splitBtn.disabled = false;
        splitTotalSpan.innerText = total.toFixed(2);
        lootPerMemberSpan.innerText = (total / partySize).toFixed(2);
    }
}

// --- Event Listeners ---
document.getElementById("addLootBtn").addEventListener("click", addLoot);
document.getElementById("splitBtn").addEventListener("click", updateUI);
partySizeInput.addEventListener("input", updateUI);

// Initial render
updateUI();
