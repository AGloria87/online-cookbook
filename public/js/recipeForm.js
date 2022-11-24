// Add Ingredient or Direction buttons
const ingrAddBtn = document.querySelector("#ingredients-form .ingr-add");
const dirAddBtn = document.querySelector("#directions-form .dir-add");

// Divs containing Ingredient or Direction input fields
const ingrsInputs = document.querySelector("#ingredients-inputs");
const dirsInputs = document.querySelector("#directions-inputs");

let ingrsCount = ingrsInputs.children.length;
let dirsCount = dirsInputs.children.length;

// Add HTML for ingredient or direction field
function addInputField(type, placeholder, count, inputs) {
  let fieldDiv = document.createElement("div")
  fieldDiv.classList.add(`${type}-field`)

  let fieldHTML = `
    <input type="text" name="${type}${count}" placeholder="${placeholder}"/>
    <button type="button" class="remove-field">&times</button>
  `;

  fieldDiv.innerHTML += fieldHTML;
  inputs.appendChild(fieldDiv);
  fieldRemoveBtnsEL();
}

// Remove input field
function removeField(event) {
  const target = event.currentTarget;
  const inputField = target.parentElement;
  inputField.remove();
}

// Add event listener to all remove buttons for each input field
function fieldRemoveBtnsEL() {
  const fieldRemoveBtns = document.querySelectorAll(".remove-field");
  for (let i = 0; i < fieldRemoveBtns.length; i++) {
    fieldRemoveBtns[i].addEventListener('click', removeField);
  }
}

ingrAddBtn.addEventListener("click", event => {
  addInputField("ingr", "Ingredient", ingrsCount, ingrsInputs);
  ingrsCount++;
});

dirAddBtn.addEventListener("click", event => {
  addInputField("dir", "Direction", dirsCount, dirsInputs);
  dirsCount++;
});

window.addEventListener('load', () => {
  fieldRemoveBtnsEL();
});