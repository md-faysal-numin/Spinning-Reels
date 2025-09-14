let depositBtn = document.querySelector("#addBtn");
let inputBet = document.querySelector("#betInput");
let spinBtn = document.querySelector("#betBtn");
let lineBet = document.querySelector("#lineBtn");
let winDisplay = document.querySelector("#winDisplay span");
let balanceH1 = document.querySelector("#totalBalance span");
let grid = document.querySelector("#reels");
let exitBtn = document.querySelector("#exitBtn");

const ROWS = 3;
const COLS = 3;

let symbolCount = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

let symbolValue = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

function createBalanceManager() {
  let balance = 0; // private variable

  return {

    deposit(amount) {
      if (amount > 0) balance += amount;
      updateBalanceDisplay();
      console.log(balance);
      return balance;
    },
    getBalance() {
      return balance;
    },
    bet(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        updateBalanceDisplay();
        return true;
      }
      return false;
    },


  };
}

let randomStringGenerator = () => {
  let randomString = [];
  Object.entries(symbolCount).forEach(([k, v]) => {
    for (let i = 0; i < v; ++i) {
      randomString.push(k);
    }
  });
  return randomString;
};

let printOutput = (randomString) => {
  let mainString = [];
  for (let i = 0; i < COLS; ++i) {
    let tempString = [];
    for (let j = 0; j < ROWS; ++j) {
      let idx = Math.floor(Math.random() * randomString.length);
      tempString.push(randomString[idx]);
    }
    mainString.push(tempString);
  }
  return mainString;
};

const transposeString = (mainString) => {
  let str = [];
  for (let i = 0; i < mainString.length; ++i) {
    str.push([]);
    for (let j = 0; j < mainString[i].length; ++j) {
      str[i].push(mainString[j][i]);
    }
  }

  return str;
};

depositBtn.addEventListener("click", () => {
  while (true) {
    let depositAmount = prompt("Please enter a deposit amount:");
    let numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      alert("Please enter a valid amount");
    } else {
      account.deposit(numberDepositAmount);
      updateBalanceDisplay();

      break;
    }
  }
});

const getWinnings = (str, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; ++row) {
    const symbols = str[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * symbolValue[symbols[0]];
    }
  }
  return winnings;
};

spinBtn.addEventListener("click", () => {
  console.log("spin button called.");
  let bet = parseFloat(inputBet.value);
  let lines = parseFloat(lineBet.value);

  if (isNaN(bet) || isNaN(lines) || bet <= 0 || lines <= 0 || lines > 3) {
    alert("Invalid bet or lines");
    return;
  }

  let totalBet = bet * lines;
  if (!account.bet(totalBet)) {
    alert("Not enough balance! Current: " + account.getBalance());
    return;
  }

  // Spin the slot machine
  let randomString = randomStringGenerator();
  let mainString = printOutput(randomString);
  let outputString = transposeString(mainString);

  const wins = getWinnings(outputString, bet, lines);
//   spinBtn.disabled = true;
  spinBtn.style.visibility = "hidden";
  setTimeout(() => {
    winDisplay.textContent = `${wins}`;
    for (let i = 0; i < outputString.length; ++i) {
        for (let j = 0; j < outputString[i].length; ++j) {
            grid.children[i].children[j].innerHTML = `${outputString[i][j]}`;
        }
    }
    account.deposit(wins);
    // spinBtn.disabled = false;
    spinBtn.style.visibility = "visible";
  }, 2000);
});

exitBtn.addEventListener("click", () => {
  window.close();
});

let account = createBalanceManager();

function updateBalanceDisplay() {
  balanceH1.innerHTML = `${account.getBalance()}`;
}
updateBalanceDisplay();
