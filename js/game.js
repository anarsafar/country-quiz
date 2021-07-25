const variantBtn = document.querySelectorAll(".variant-btn");
const capitalName = document.querySelector(".capital-name");
const quizContainer = document.querySelector(".quiz-container");
const tryAgainContainer = document.querySelector(".try-again-container");
const tryAgain = document.querySelector(".try-again-btn");
const result = document.querySelector(".result");
const countryFlag = document.querySelector(".country-flag");
const question = document.querySelector(".question");
const questionFlag = document.querySelector(".question-flag");
let score = 0;
let isCorrectClicked = false;
let isWrongClicked = false;

//get Data from API
const getCountryData = async () => {
  const response = await fetch(`https://restcountries.eu/rest/v2/all`);
  const data = await response.json();
  return data;
};

const startGame = async () => {
  const data = await getCountryData();
  const newData = getRandomCountry(data);
  newData.forEach((data) =>
    data.capital === "" || data.capital === null ? startGame() : null
  );
  displayNewData(newData);
};

const getRandomCountry = (data) => {
  let displayedCountry = [];
  for (let i = 0; i < 4; i++) {
    const random = Math.floor(Math.random() * 250) + 1;
    displayedCountry.push(data[random - 1]);
  }
  if (checkDuplicate(displayedCountry)) {
    return getRandomCountry(data);
  } else {
    return displayedCountry;
  }
};

const checkDuplicate = (data) => {
  let map = {};
  let result = false;
  for (let i = 0; i < data.length; i++) {
    if (map[data[i].capital]) {
      result = true;
      break;
    }
    map[data[i].capital] = true;
  }
  return result;
};

const displayNewData = (data) => {
  let correct = getCorrectAnswer(data);
  const indexOfCorrect = data.indexOf(correct);
  const random = Math.floor(Math.random() * 2) + 1;
  if (random === 2) {
    question.classList.remove("hide");
    questionFlag.classList.remove("show");
    countryFlag.classList.remove("show");
    capitalName.innerHTML = correct.capital;
  } else {
    questionFlag.classList.add("show");
    countryFlag.classList.add("show");
    question.classList.add("hide");
    countryFlag.children[0].src = `${correct.flag}`;
  }
  variantBtn.forEach((btn, index) => {
    btn.children[1].innerHTML = data[index].name;
    if (index === indexOfCorrect) {
      btn.children[1].setAttribute("correct", `${correct.name}`);
      btn.children[2].children[0].src = `./img/check_circle_white_18dp.svg`;
    } else {
      btn.children[2].children[0].src = `./img/cancel_white_18dp.svg`;
    }
  });
};

const getCorrectAnswer = (data) => {
  const random = Math.floor(Math.random() * 4) + 1;
  const correct = data[random - 1];
  return correct;
};

variantBtn.forEach((btn) => {
  btn.addEventListener("click", function click() {
    const isCorrect = btn.children[1].getAttribute("correct");
    if (isCorrect === null && !isCorrectClicked && !isWrongClicked) {
      isWrongClicked = true;
      btn.classList.add("wrong");
      btn.children[2].children[0].classList.add("show");
      variantBtn.forEach((btn) => {
        if (btn.children[1].getAttribute("correct") !== null) {
          btn.classList.add("correct");
          btn.children[2].children[0].classList.add("show");
        }
      });
      result.innerHTML = score;
      setTimeout(() => {
        btn.classList.remove("wrong");
        btn.children[2].children[0].classList.remove("show");
        variantBtn.forEach((btn) => {
          if (btn.children[1].getAttribute("correct") !== null) {
            btn.classList.remove("correct");
            btn.children[2].children[0].classList.remove("show");
          }
        });
        quizContainer.classList.add("hide");
        tryAgainContainer.classList.add("show");
      }, 2000);
    } else if (!isCorrectClicked && !isWrongClicked) {
      isCorrectClicked = true;
      btn.classList.add("correct");
      btn.children[2].children[0].classList.add("show");
      setTimeout(() => {
        btn.classList.remove("correct");
        btn.children[2].children[0].classList.remove("show");
        score++;
        reset();
        startGame();
      }, 1500);
    }
  });
});

tryAgain.addEventListener("click", () => {
  score = 0;
  reset();
  startGame();
  quizContainer.classList.remove("hide");
  tryAgainContainer.classList.remove("show");
});

const reset = () => {
  isCorrectClicked = false;
  isWrongClicked = false;
  variantBtn.forEach((btn) => btn.children[1].removeAttribute("correct"));
};

window.onload = startGame();
