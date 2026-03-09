// application state
let loot = [];

// DOM elements
let partySizeInput = document.getElementById("partySize");
let lootNameInput = document.getElementById("lootName");
let lootValueInput = document.getElementById("lootValue");
let lootQuantityInput = document.getElementById("lootQuantity");

let addLootBtn = document.getElementById("addLootBtn");
let splitBtn = document.getElementById("splitBtn");

let totalLootSpan = document.getElementById("totalLoot");
let lootPerMemberSpan = document.getElementById("lootPerMember");

let lootRows = document.getElementById("lootRows");
let noLootMessage = document.getElementById("noLootMessage");
let errorMessage = document.getElementById("errorMessage");

// event listeners
addLootBtn.addEventListener("click", addLoot);
splitBtn.addEventListener("click", updateUI);
partySizeInput.addEventListener("input", updateUI);


// add loot function
function addLoot(){

let name = lootNameInput.value.trim();
let value = parseFloat(lootValueInput.value);
let quantity = parseInt(lootQuantityInput.value);

errorMessage.innerText = "";

// validation
if(name === ""){
errorMessage.innerText = "Item name required";
return;
}

if(isNaN(value) || value < 0){
errorMessage.innerText = "Invalid value";
return;
}

if(isNaN(quantity) || quantity < 1){
errorMessage.innerText = "Invalid quantity";
return;
}

// create object
let item = {
name: name,
value: value,
quantity: quantity
};

// add to array
loot.push(item);

// clear fields
lootNameInput.value = "";
lootValueInput.value = "";
lootQuantityInput.value = "";

// update UI
updateUI();

}


// remove loot
function removeLoot(index){

loot.splice(index,1);

updateUI();

}


// update interface
function updateUI(){

let total = 0;

// calculate total
for(let i=0;i<loot.length;i++){

total += loot[i].value * loot[i].quantity;

}

totalLootSpan.innerText = total.toFixed(2);


// render loot list
lootRows.innerHTML = "";

for(let i=0;i<loot.length;i++){

let row = document.createElement("div");
row.className = "loot-row";

let nameCell = document.createElement("div");
nameCell.className = "loot-cell";
nameCell.innerText = loot[i].name;

let valueCell = document.createElement("div");
valueCell.className = "loot-cell";
valueCell.innerText = loot[i].value.toFixed(2);

let quantityCell = document.createElement("div");
quantityCell.className = "loot-cell";
quantityCell.innerText = loot[i].quantity;

let actionCell = document.createElement("div");
actionCell.className = "loot-cell";

let removeBtn = document.createElement("button");
removeBtn.innerText = "Remove";

removeBtn.addEventListener("click", function(){
removeLoot(i);
});

actionCell.appendChild(removeBtn);

row.appendChild(nameCell);
row.appendChild(valueCell);
row.appendChild(quantityCell);
row.appendChild(actionCell);

lootRows.appendChild(row);

}


// party size
let partySize = parseInt(partySizeInput.value);

if(isNaN(partySize) || partySize < 1){

lootPerMemberSpan.innerText = "0.00";
splitBtn.disabled = true;

}else{

if(loot.length > 0){

let split = total / partySize;
lootPerMemberSpan.innerText = split.toFixed(2);

}else{

lootPerMemberSpan.innerText = "0.00";

}

}


// empty state
if(loot.length === 0){

noLootMessage.classList.remove("hidden");

}else{

noLootMessage.classList.add("hidden");

}


// enable / disable split button
if(loot.length === 0 || isNaN(partySize) || partySize < 1){

splitBtn.disabled = true;

}else{

splitBtn.disabled = false;

}

}
