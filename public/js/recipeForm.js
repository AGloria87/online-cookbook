// Script for adding and removing ingredients and directions from forms
let ingrsCount = 3;
let dirsCount = 3;

// Add Ingredient or Direction buttons
const ingrAddBtn = document.querySelector("#ingredients-form .ingr-add");
const dirAddBtn = document.querySelector("#directions-form .dir-add");

// Divs containing Ingredient or Direction input fields
const ingrsInputs = document.querySelector("#ingredients-inputs")
const dirsInputs = document.querySelector("#directions-inputs")

// Add HTML for ingredient or direction field
function addInputField(type, count, inputs) {
  let fieldHTML = `
    <div class="${type}-field">
      <input type="text" name="ingr${count}" placeholder="Ingredient"/>
      <button type="button" class="remove-field">&times</button>
    </div>
  `;
  inputs.innerHTML += fieldHTML;
  fieldRemoveBtnsEL();
  count++;
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
  addInputField("ingr", ingrsCount, ingrsInputs);
});

dirAddBtn.addEventListener("click", event => {
  addInputField("dir", dirsCount, dirsInputs);
});

window.addEventListener('load', () => {
  fieldRemoveBtnsEL();
});