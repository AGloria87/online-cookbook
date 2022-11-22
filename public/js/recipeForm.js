// Adding and removing ingredients and directions from forms
let ingrsCount = 3;
let dirsCount = 3;

const ingrAddBtn = document.querySelector("#ingredients-form .ingr-add");
const dirAddBtn = document.querySelector("#directions-form .dir-add");

const ingrsInputs = document.querySelector("#ingredients-inputs")
const dirsInputs = document.querySelector("#directions-inputs")

const dirRemoveBtns = document.querySelectorAll(".dir-remove");

ingrAddBtn.addEventListener("click", event => {
  let ingrHTML = `
    <div class="ingr-field">
      <input type="text" name="ingr${ingrsCount}" placeholder="Ingredient"/>
      <button type="button" class="ingr-remove">&times</button>
    </div>
    `;
  ingrsInputs.innerHTML += ingrHTML;
  ingrRemoveBtnsEL();
  ingrsCount++;
});

dirAddBtn.addEventListener("click", event => {
  let dirHTML = `
    <div class="dir-field">
      <input type="text" name="ingr${dirsCount}" placeholder="Direction"/>
      <button type="button" class="dir-remove">&times</button>
    <div class="dir-field">
    `;
  dirsInputs.innerHTML += dirHTML;
  dirRemoveBtnsEL();
  dirsCount++;
});


// Add event listener to all buttons to remove each ingredient field
function ingrRemoveBtnsEL() {
  const ingrRemoveBtns = document.querySelectorAll(".ingr-remove");
  for (let i = 0; i < ingrRemoveBtns.length; i++) {
    ingrRemoveBtns[i].addEventListener('click', removeIngredient);
  }
}

function removeIngredient(event) {
  const target = event.currentTarget;
  const ingredientRow = target.parentElement;
  ingredientRow.remove();
}

// Add event listener to all buttons to remove each direction field
function dirRemoveBtnsEL() {
  const dirRemoveBtns = document.querySelectorAll(".dir-remove");
  for (let i = 0; i < dirRemoveBtns.length; i++) {
    dirRemoveBtns[i].addEventListener('click', removeDirection);
  }
}

function removeDirection(event) {
  const target = event.currentTarget;
  const directionRow = target.parentElement;
  directionRow.remove();
}

window.addEventListener('load', () => {
  ingrRemoveBtnsEL();
  dirRemoveBtnsEL();
});

