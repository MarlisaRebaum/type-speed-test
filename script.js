// Random Quotes API URL
const quoteApiUrl = "https://api.quotable.io/random?minLength=300&maxLength=500";

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Display random quotes
const renderNewQuote = async () => {
  // Fetch contents from API
  const response = await fetch(quoteApiUrl);

  // Store response
  let data = await response.json();

  // Access quote
  quote = data.content;

  // Array of characters in the quote
  let arr = quote.split("").map(value => {
    // Wrap the cahracters in a span tag
    return "<span class='quote-chars'>" + value + "</span>";
  });

  // Join array for displaying
  quoteSection.innerHTML += arr.join("");
};

// Logic for comparing input words with quote
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");

  // Create an array from received span tags
  quoteChars = Array.from(quoteChars);

  //  Array of user input characters
  let userInputChars = userInput.value.split("");

  // Loop through each character in the quote
  quoteChars.forEach((char, index) => {
    // Check if char(quote character) = userInputChars[index](input characters)
    if(char.innerText ==  userInputChars[index]) {
      char.classList.add("success");
    }
    // If user hasn't entered anything or backspaces
    else if (userInputChars[index] == null) {
      // Remove class if the char had any
      if(char.classList.contains("success")) {
        char.classList.remove("success");
      } else {
        char.classList.remove("fail");
      }
    }
    // If user enters wrong character
    else {
      // Check if we already have added fail class
      if(!char.classList.contains("fail")){
        // Increment and dusplay mistakes
        mistakes += 1;
        char.classList.add("fail");
      }
      document.getElementById("mistakes").innerText = mistakes;
    }
    //  Returns true if all the characters are entered correctly
    let check = quoteChars.every(element => {
      return element.classList.contains("success");
    });
    // End test if all characters are correct
    if (check) {
      displayResult();
    }
  });
});

// Update timer on screen
function updateTimer() {
  if(time == 0){
    // End test if timer reaches 0
    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

// Set timer
const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

// End Test
const displayResult = () => {
  // Display result div
  document.querySelector(".result").style.display = "block";
  document.querySelector(".restart").style.display = "block";
  document.getElementById("quote").style.display = "none";
  document.getElementById("quote-input").style.display = "none";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  let timeTaken = 1;
  if(time != 0){
    timeTaken = (60 - time) / 100;
  }
  document.getElementById("wpm").innerText = 
    (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
    document.getElementById("accuracy").innerText = 
      Math.round(((userInput.value.length - mistakes) / 
      userInput.value.length) * 100) + "%";
};

// Start Test
const startTest = () => {
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  timeReduce();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
}

// Restart Test
const startOver = () => {
  document.getElementById("stop-test").style.display = "none";
  window.location.reload();
}

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote()
}