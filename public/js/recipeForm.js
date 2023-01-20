// Image file upload preview
const previewImg = document.querySelector(".upload-preview");
const fileField = document.querySelector("#recipe-image");

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
    <img src="/images/ui/remove.svg" class="remove-field">
  `;

  fieldDiv.innerHTML += fieldHTML;
  inputs.appendChild(fieldDiv);
  fieldRemoveBtnsEL();
}

// Remove input field
function removeField(event) {
  const target = event.currentTarget;
  const inputField = target.parentElement;
  const inputsDiv = inputField.parentElement;
  const allInputs = inputsDiv.querySelectorAll("input");

  // Allow at least 1 field to remain
  if (allInputs.length > 1) {
    inputField.remove();
  }
}

// Add event listener to all remove buttons for each input field
function fieldRemoveBtnsEL() {
  const fieldRemoveBtns = document.querySelectorAll(".remove-field");
  for (let i = 0; i < fieldRemoveBtns.length; i++) {
    fieldRemoveBtns[i].addEventListener('click', removeField);
  }
}

ingrAddBtn.addEventListener("click", e => {
  addInputField("ingr", "Ingredient", ingrsCount, ingrsInputs);
  ingrsCount++;
});

dirAddBtn.addEventListener("click", e => {
  addInputField("dir", "Direction", dirsCount, dirsInputs);
  dirsCount++;
});

// Show a preview of the uploaded image
fileField.addEventListener("change", e => {
  const [file] = fileField.files;
  if (file) {
    previewImg.src = URL.createObjectURL(file);
  }
});

window.addEventListener('load', () => {
  fieldRemoveBtnsEL();
});