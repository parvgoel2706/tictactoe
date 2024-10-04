let firstWindow = document.querySelector(".firstWindow");
let gameWindow = document.querySelector(".gameWindow");
let boxes = document.querySelectorAll(".box");
let symbolChoice = document.querySelector(".symbolChoice");
let symbolList = document.querySelectorAll("label");
let symbolChosen = document.querySelectorAll(".symbolChosen");
let maingame = document.querySelector(".maingame");
let moveEle = document.createElement("h1");

let playbtn = document.createElement("button");
let exitbtn = document.querySelector(".exit");
let goHome = document.querySelector(".gohome");
let restart = document.querySelector(".restart");
let popper = document.querySelector("#popper");
 
let winning = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 5, 9],
  [3, 5, 7],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
];
let option = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let user_choose = [];
let robo_choose = [];

function choosingSymbol() {
  return new Promise((resolve, reset) => {
    symbolChoice.addEventListener("click", function checkSymbol() {
      if (symbolList[0].previousElementSibling.checked == true) {
        symbolList[0].classList.add("symbolSelected");
        resolve("zero");
      } else {
        symbolList[0].classList.remove("symbolSelected");
      }
      if (symbolList[1].previousElementSibling.checked == true) {
        symbolList[1].classList.add("symbolSelected");
        resolve("cross");
      } else {
        symbolList[1].classList.remove("symbolSelected");
      }
    });
  });
}
function gameButton() {
  return new Promise((resolve, reject) => {
    playbtn.innerHTML = "<b>PLAY</b>";
    firstWindow.appendChild(playbtn);
    playbtn.classList.add("play");
    playbtn.addEventListener("click", () => {
      gameWindow.scrollIntoView({ behavior: "smooth" });
      resolve();
    });
  });
}

function displayChosenSymbol(symbol) {
  return new Promise((resolve, reject) => {
    if (symbol == "zero") {
      symbolChosen[0].setAttribute("src", "./images/circle.png");
      symbolChosen[1].setAttribute("src", "./images/multiply.png");
    } else {
      symbolChosen[0].setAttribute("src", "./images/multiply.png");
      symbolChosen[1].setAttribute("src", "./images/circle.png");
    }
    resolve();
  });
}

function chooseFirstTurn() {
  return new Promise((resolve, reject) => {
    let num = Math.floor(Math.random() * 2);
    if (num == 0) {
      resolve("user");
    } else {
      resolve("robo");
    }
  });
}

function displayTurn(turn) {
  return new Promise((resolve, reject) => {
    if (turn == "user") printWithoutDelay("YOU GOT FIRST MOVE");
    else if (turn == "robo") printWithoutDelay("ROBO GOT FIRST MOVE");
    else if (turn == "userMove") printWithDelay("YOUR TURN");
    else if (turn == "roboMove") printWithDelay("ROBO TURN");
    else if (turn == "draw") printWithoutDelay("MATCH DRAW");
    else if (turn == "won") printWithoutDelay("YOU WON");
    else if (turn == "lose") printWithoutDelay("YOU LOOSE");
    function printWithDelay(msg) {
      setTimeout(() => {
        moveEle.innerHTML = msg;
        moveEle.classList.add("turn");
        maingame.appendChild(moveEle);
        resolve();
      }, 1000);
    }
    function printWithoutDelay(msg) {
      moveEle.innerHTML = msg;
      moveEle.classList.add("turn");
      maingame.appendChild(moveEle);
      resolve();
    }
  });
}

function makingCross() {
  let crossing = document.createElement("div");
  let line1 = document.createElement("div");
  let line2 = document.createElement("div");

  crossing.appendChild(line1);
  crossing.appendChild(line2);

  crossing.classList.add("symbol");
  crossing.classList.add("crossing");
  line1.classList.add("line1");
  line2.classList.add("line2");
  return crossing;
}

function makingZero() {
  let zeroing = document.createElement("div");
  zeroing.classList.add("symbol");
  zeroing.classList.add("zeroing");
  return zeroing;
}

function checkWin(select_choice) {
  for (let i = 0; i < 8; i++) {
    let count = 0;
    for (let j = 0; j < 3; j++) {
      if (select_choice.includes(winning[i][j])) {
        count++;
      }
    }
    if (count == 3) {
      return "won";
    }
  }
}

function userInput(userSymbol, roboSymbol) {
  return new Promise((resolve, reject) => {
    if (option.length == 0) {
      // displayTurn("draw");
      reject("draw");
    } else {
      displayTurn("userMove");
      let selectedBox;
      option.forEach((ele) => {
        let a = document.getElementById(ele.toString());
        a.addEventListener("click", listner);
      });
      function listner() {
        selectedBox = parseInt(this.getAttribute("id"));
        if (userSymbol == "cross") {
          this.appendChild(makingCross());
        } else {
          this.appendChild(makingZero());
        }
        option.forEach((ele) => {
          let a = document.getElementById(ele.toString());
          a.removeEventListener("click", listner);
        });
        user_choose.push(selectedBox);
        option.splice(option.indexOf(selectedBox), 1);
        if (checkWin(user_choose) == "won") {
          // displayTurn("won");
          reject("won");
        }
        resolve("roboMove");
        // compInput(roboSymbol, userSymbol);
      }
    }
  });
}

function compInput(roboSymbol, userSymbol) {
  return new Promise((resolve, reject) => {
    if (option.length == 0) {
      // displayTurn("draw");
      reject("draw");
    } else {
      displayTurn("roboMove");
      let roboPos;
      let end = 0;

      for (let i = 0; i < 8; i++) {
        let user_match = [];
        let robo_match = [];
        let user_z = 0;
        let robo_z = 0;
        for (let j = 0; j < 3; j++) {
          if (user_choose.includes(winning[i][j])) {
            user_match.push(winning[i][j]);
          } else {
            user_z = winning[i][j];
          }
          if (robo_choose.includes(winning[i][j])) {
            robo_match.push(winning[i][j]);
          } else {
            robo_z = winning[i][j];
          }
        }
        if (robo_match.length == 2 && option.includes(robo_z)) {
          roboPos = document.getElementById(robo_z.toString());
          randomNum = robo_z;
          end = 1;
          break;
        } else if (user_match.length == 2 && option.includes(user_z)) {
          roboPos = document.getElementById(user_z.toString());
          randomNum = user_z;
          end = 1;
        }
      }
      // random
      if (end != 1) {
        let size = option.length;
        randomNum = option[Math.floor(Math.random() * size)];
        roboPos = document.getElementById(randomNum.toString());
      }
      setTimeout(b, 2000);
      function b() {
        if (roboSymbol == "cross") {
          roboPos.appendChild(makingCross());
        } else {
          roboPos.appendChild(makingZero());
        }
        robo_choose.push(randomNum);
        option.splice(option.indexOf(randomNum), 1);
        if (checkWin(robo_choose) == "won") {
          reject("lose");
        }
        resolve("userMove");
      }
    }
  });
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time * 1000);
  });
}

let roboSymbol;
let userSymbol;
async function gameStart() {
  userSymbol = await choosingSymbol();

  if (userSymbol == "zero") roboSymbol = "cross";
  else roboSymbol = "zero";

  await gameButton();
  await displayChosenSymbol(userSymbol);
  await resetGame();
}

gameStart();

async function resetGame() {
  let firstMove = await chooseFirstTurn();
  await displayTurn(firstMove);
  await sleep(1);
  try {
    let result;
    if (firstMove == "user") {
      result = await userInput(userSymbol, roboSymbol);
      result = await compInput(roboSymbol, userSymbol);
      result = await userInput(userSymbol, roboSymbol);
      result = await compInput(roboSymbol, userSymbol);
      result = await userInput(userSymbol, roboSymbol);
      result = await compInput(roboSymbol, userSymbol);
      result = await userInput(userSymbol, roboSymbol);
      result = await compInput(roboSymbol, userSymbol);
      result = await userInput(userSymbol, roboSymbol);
      result = await compInput(roboSymbol, userSymbol);
    } else {
      result = await compInput(roboSymbol, userSymbol);
      result = await userInput(userSymbol, roboSymbol);
      result = await compInput(roboSymbol, userSymbol);
      result = await userInput(userSymbol, roboSymbol);
      result = await compInput(roboSymbol, userSymbol);
      result = await userInput(userSymbol, roboSymbol);
      result = await compInput(roboSymbol, userSymbol);
      result = await userInput(userSymbol, roboSymbol);
      result = await compInput(roboSymbol, userSymbol);
      result = await userInput(userSymbol, roboSymbol);
    }
  } catch (err) {
    await displayTurn(err);
    await sleep(1.2);
    await showPopup(err);
  }
  return new Promise((resolve) => {
    resolve();
  });
}

function showPopup(output) {
  return new Promise((resolve, reject) => {
    popper.classList.add("popupBox");

    let result = document.querySelector(".result");
    if (output == "won") output = "YOU WON";
    else if (output == "lose") output = "YOU LOOSE";
    else output = "MATCH DRAW";
    result.innerHTML = output;
    result.classList.add("turn");
    
    resolve();
  });
}

function reset(thiss) {
  popper.classList.remove("popupBox");
  let sym = document.querySelectorAll(".symbol");
  let j=0;
  for (let i = 0; i < boxes.length; i++) {
    if (!(option.includes(i + 1))) {
      boxes[i].removeChild(sym[j]);
      j++;
    }//error
  }
  user_choose = [];
  robo_choose = [];
  option = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (thiss.getAttribute("class") == "restart endbtn") {
    resetGame();
  } else gameStart();
}

goHome.addEventListener("click", function a() {
  firstWindow.scrollIntoView({ behavior: "smooth" });
  symbolList[0].previousElementSibling.checked = false;
  symbolList[1].previousElementSibling.checked = false;
  symbolList[0].classList.remove("symbolSelected");
  symbolList[1].classList.remove("symbolSelected");
  firstWindow.removeChild(document.querySelector(".play"));
  playbtn.classList.remove("play");
  reset(this);
});

exitbtn.addEventListener("click",()=>{
  this.close(``, `_parent`, ``);
})
restart.addEventListener("click", function b() {
  reset(this);
});
