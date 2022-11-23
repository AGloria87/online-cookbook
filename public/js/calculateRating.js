const starEmptySrc = "/../images/ui/ratings/starEmpty.svg";
const starHalfSrc = "/../images/ui/ratings/starHalf.svg";
const starFullSrc = "/../images/ui/ratings/starFull.svg";

const ratingContainer = document.querySelector(".rating");
const starsContainer = document.querySelector(".stars-container");

const ratingsData = ratingContainer.getAttribute("values").split(",");

const ratings = ratingsData.map(rating => {
  return Number(rating);
});

function average(valuesArr) {
  let sumAll = valuesArr.reduce((total, current) =>{
    return total + current;
  }, 0);
  return sumAll/valuesArr.length;
}

const score = average(ratings).toFixed(1);
const scoreInt = Math.floor(score);
const scoreDec = (score - scoreInt).toFixed(1);

let half = false; //If the half star has been added

for (let i = 0; i < 5; i++) {
  const newImg = document.createElement('img');

  if (i < scoreInt) {
    newImg.setAttribute("src", starFullSrc);
  }
  else {
    if (!half && scoreDec >= 0.5) {
      newImg.setAttribute("src", starHalfSrc);
      half = true;
    }
    else {
      newImg.setAttribute("src", starEmptySrc);
    }
  }

  starsContainer.appendChild(newImg);
}