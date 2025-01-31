// On page load, clears data from local storage
document.addEventListener("DOMContentLoaded", function () {
  localStorage.clear();
});

let wordFrequency = document.getElementById("max-repetitions");
let wordFrequencycount = wordFrequency.value;

// Initialises colours and fonts
let backgroundColor = "#FFFFFF";
let selectedFont = localStorage.getItem("selectedFont");
let rotation = 0;

const lightPalette = ["#1A0878", "#5A1F9F", "#FF4D27", "#000000", "#AA4BF5"];
const darkPalette = ["#C8DCE9", "#AA4BF5", "#FF885B", "#FF4D27", "#E3E3E3"];
let selectedPalette = lightPalette; // Default is light palette

// Updates the word cloud background colour
function updateWordCloudStyles() {
  // Set background color based on the selected palette
  d3.select("#my_dataviz").style("background-color", backgroundColor);
}
// Changes to light palette on user selection
document.getElementById("light-palette").addEventListener("click", function () {
  selectedPalette = lightPalette;
  backgroundColor = "#FFFFFF";
  updateWordCloudStyles();
});

// Changes to dark palette on user selection
document.getElementById("dark-palette").addEventListener("click", function () {
  selectedPalette = darkPalette;
  backgroundColor = "#333333";
  updateWordCloudStyles();
});

let textarea = document.getElementById("word-input");
let textradio = document.getElementById("import-text");
textarea.addEventListener("click", () => {
  textradio.checked = true;
});

// Changes rotation of words in word cloud
let rotateElement = document.querySelector(".rotation-options");
rotateElement.addEventListener("change", (event) => {
  const selectedRotation = event.target.value;

  if (selectedRotation == "vertical") {
    rotation = -90;
  } else if (selectedRotation == "horizontal") {
    rotation = 0;
  } else {
    rotation = 75;
  }

  console.log(rotation);
});

// Changes fonts on user selection
let selectElement = document.querySelector(".font");

selectElement.addEventListener("change", (event) => {
  selectedFont = event.target.value;
  localStorage.setItem("selectedFont", selectedFont);
  console.log("Select font is", selectedFont);
});

// Checks if the max words number input changes
document.getElementById("max-words").onchange = function () {
  myFunction();
};
let maxWords = document.getElementById("max-words").value;

function myFunction() {
  maxWords = document.getElementById("max-words").value;
}

// Function to generate word cloud
function generateWordCloud(text) {
  let wordsArray = text.split(/[^\w]+/); // Removes non-words

  let excludedWords = JSON.parse(localStorage.getItem("tags")) || [];
  console.log(excludedWords);
  let filteredWords = wordsArray.filter(
    (word) => !excludedWords.includes(word.toLowerCase())
  ); //Filters the words based on if excludedWords contains any words

  // Get max repetitions from the input field by user
  let maxRepetitions = parseInt(
    document.getElementById("max-repetitions").value,
    10
  );
  console.log(maxRepetitions);

  // Creates an object with each word and the frequency

  const wordCounts = {};
  filteredWords.forEach((word) => {
    word = word.toLowerCase();
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  // I honestly used copilot so i dont know how this works
  // Im guessing that an object is created and the (key pair) value is checked to see if it is above
  // the max repititions value and if it is then it is passed
  const filteredWordCounts = {};
  Object.keys(wordCounts).forEach((word) => {
    if (wordCounts[word] >= maxRepetitions) {
      filteredWordCounts[word] = wordCounts[word];
    }
  });

  localStorage.setItem("filteredWords", JSON.stringify(filteredWords)); //Stores filtered words in localstorage

  // Word assigned as value to key 'text' and size of the word (by frequency of the word) assigned as value to key 'size'
  let myWords = Object.keys(filteredWordCounts).map((word) => ({
    text: word,
    size: wordCounts[word] * 10,
  }));

  console.log("aaa", myWords);

  myWords.forEach((wordObj) => {
    console.log(`Word: ${wordObj.text}, Count: ${wordCounts[wordObj.text]}`);
  });

  // Creates margins for svg
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };

  // Reference the container's width and height
  const container = document.getElementById("my_dataviz");
  const width = container.offsetWidth - margin.left - margin.right;
  const height = container.offsetHeight - margin.top - margin.bottom;

  d3.select("#my_dataviz").html("");
  d3.select("#my_dataviz").style("display", "block");

  //Inits the svg with width, height grouping and transformation
  const svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Inits the layout for each word
  const layout = d3.layout
    .cloud()
    .size([width, height])
    .words(myWords)
    .padding(35)
    .fontSize(function (d) {
      return Math.max(15, (d.size * 5) / 3);
    })
    .on("end", draw);

  layout.start();

  // Generated word cloud from user input
  function draw(words) {
    console.log(words);
    svg
      .append("g") // Groups svg
      .attr(
        "transform",
        "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
      )
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-family", selectedFont)
      .style("font-size", function (d) {
        return d.size + "px";
      })
      .style("fill", function (d, i) {
        return selectedPalette[i % selectedPalette.length];
      })
      .attr("text-anchor", "middle")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + rotation + ")";
      })
      .text(function (d) {
        return d.text;
      });
  }
}

// Runs generation function when users clicks 'generate' button
document.getElementById("generate").addEventListener("click", (generate) => {
  // Checks if the word cloud has text input
  let text = document.getElementById("word-input").value;

  let textRadio = document.getElementById("import-text").checked;
  let uploadRadio = document.getElementById("upload-file").checked;
  let inputRadio = document.getElementById("input-url").checked;

  // if (!textRadio && text.trim() === "") {
  //   alert("Please enter some text before generating the word cloud!");
  //   return;
  // }

  console.log(text.value);
  if (text.trim() != "") {
    console.log(textRadio);
  } else {
    textRadio.checked = false;
  }
  console.log(textRadio.checked);
  if (!textRadio && !uploadRadio && !inputRadio) {
    alert("You must select an input!");
    return;
  }
  console.log(uploadRadio);

  if (uploadRadio) {
    text = localStorage.getItem("uploadedText");
    console.log("Text should be:", text);
    document.getElementById("word-input").value = text;
  }

  localStorage.setItem("text", text);
  console.log(text);
  generateWordCloud(text);

  // If the inputted words are more than the max words limit, a popup appears and prevents word cloud generation
  let filteredWords = JSON.parse(localStorage.getItem("filteredWords"));
  if (filteredWords.length > maxWords) {
    alert("You have inputted more words than your max word limit!");
    return;
  }
  console.log("Filtered words:", filteredWords.length);

  wordFrequency.addEventListener("input", function () {
    wordFrequencycount = wordFrequency.value;
    console.log(wordFrequencycount);
  });
  localStorage.setItem("wordFrequency", wordFrequencycount);
  console.log("Word frequency:", wordFrequencycount);

  if (filteredWords.length < wordFrequencycount) {
    alert(
      "Some words are missing because they didn't meet the required frequency."
    );
    wordFrequency.classList.add("error");
  } else {
    wordFrequency.classList.remove("error");
  }
});
