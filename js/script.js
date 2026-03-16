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


// event listeners
addLootBtn.addEventListener("click", addLoot);
splitBtn.addEventListener("click", splitLoot);
resetBtn.addEventListener("click", resetAll);

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

let state = {
loot: loot,
partySize: partySize
};

localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

}


// restore state
function restoreState(){

let saved = localStorage.getItem(STORAGE_KEY);

if(!saved){
return;
}

try{

let parsed = JSON.parse(saved);

if(typeof parsed !== "object"){
return;
}

if(Array.isArray(parsed.loot)){

for(let i=0;i<parsed.loot.length;i++){

let item = parsed.loot[i];

if(
item.name &&
item.name.trim() !== "" &&
typeof item.value === "number" &&
item.value >= 0 &&
typeof item.quantity === "number" &&
item.quantity >= 1
){

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

let item = {
name: name,
value: value,
quantity: quantity
};

loot.push(item);

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

let total = 0;

for(let i=0;i<loot.length;i++){

total += loot[i].value * loot[i].quantity;

}

let split = total / partySize;

lootPerMemberSpan.innerText = split.toFixed(2);

}


// update interface
function updateUI(){

let total = 0;

for(let i=0;i<loot.length;i++){

total += loot[i].value * loot[i].quantity;

}

totalLootSpan.innerText = total.toFixed(2);

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

if(loot.length === 0){
noLootMessage.classList.remove("hidden");
}else{
noLootMessage.classList.add("hidden");
}

if(loot.length === 0 || partySize < 1){
splitBtn.disabled = true;
}else{
splitBtn.disabled = false;
}

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


// initialize
document.addEventListener("DOMContentLoaded", function(){

restoreState();

updateUI();

});
