// Define a default palette and font
  // Default palette is empty, will be set when the user selects a color palette
let backgroundColor = "#FFFFFF"; // Default background color for light mode
let selectedFont = localStorage.getItem("selectedFont") 
let rotation = 0
// Define color palettes
const lightPalette = ["#1A0878", "#5A1F9F", "#FF4D27", "#000000", "#AA4BF5"];
const darkPalette = ["#C8DCE9", "#AA4BF5", "#FF885B", "#FF4D27", "#E3E3E3"];
let selectedPalette = [lightPalette]

function updateWordCloudStyles() {
    // Set background color based on the selected palette
    d3.select("#my_dataviz").style("background-color", backgroundColor);
    // Ensure the word cloud container is visible
    d3.select("#my_dataviz").style("display", "block");
}
updateWordCloudStyles()

// Event listeners for palette selection
document.getElementById("light-palette").addEventListener("click", function() {
    selectedPalette = lightPalette; // Set the selected palette to light
    backgroundColor = "#FFFFFF"; // Set background color to white for light mode
    console.log("Light palette selected");
  
    updateWordCloudStyles();
     // Update the word cloud styles after selecting the palette
});

document.getElementById("dark-palette").addEventListener("click", function() {
    selectedPalette = darkPalette; // Set the selected palette to dark
    backgroundColor = "#333333"; // Set background color to dark gray for dark mode
    console.log("Dark palette selected");
    updateWordCloudStyles(); // Update the word cloud styles after selecting the palette
});

let rotateElement = document.querySelector(".rotation-options")
rotateElement.addEventListener("change",(event) =>{
    selectedRotation = event.target.value
    
    console.log("Select rotation is",selectedRotation)
    console.log(event.target.checked)

if (selectedRotation == "vertical"){
    rotation = -90
}else if (selectedRotation == "horizontal"){
    rotation = 0
}else{
    rotation = 75
}

    
    console.log(rotation)
})

// Function to update word cloud styles (background color and visibility)


let selectElement = document.querySelector(".font")

selectElement.addEventListener("change",(event) =>{
    selectedFont = event.target.value
    localStorage.setItem("selectedFont",selectedFont)
    console.log("Select font is",selectedFont)
    
})



// Function to generate word cloud
function generateWordCloud(text) {
    // Split the text into an array of words
    const wordsArray = text.split(/[^a-z]/);
    console.log(wordsArray);
   
    // Count the frequency of each word
    const wordCounts = {};
    wordsArray.forEach(word => {
        word = word.toLowerCase(); // Normalize to lowercase for counting
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
 
    // Convert the word counts object into an array of objects for the word cloud
    const myWords = Object.keys(wordCounts).map(word => ({
        text: word,
        size: wordCounts[word] * 20 // Scale the size of the word based on frequency
    }));
 
    // Set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 1280 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
 
    // Clear any existing word cloud before appending new one
    d3.select("#my_dataviz").html(""); // Clear existing content
   
    // Show the word cloud container after content is generated
    d3.select("#my_dataviz").style("display", "block");
 
    // Append the svg object to the body of the page
    var svg = d3.select("#my_dataviz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
    // Constructs a new cloud layout instance. It runs an algorithm to find the position of words
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords) // Use the word count data with the size
        .padding(10)
        .fontSize(function(d) { return d.size; })
        .on("end", draw);
 
    // Start the layout process
    layout.start();
 
    // This function takes the output of 'layout' above and draws the words
    function draw(words) {
        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-family",selectedFont)
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d, i) {
                // Use the selected palette for word colors
                return selectedPalette[i % selectedPalette.length];
            })
            .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + rotation + ")";
                })
            .text(function(d) { return d.text; });
    }
}

// Add event listener for "Generate" button
document.getElementById("generate").addEventListener("click", () => {
    const text = document.getElementById("word-input").value;
    if (text.trim() === "") {
        alert("Please enter some text before generating the word cloud!");
        return;
    }
    
    localStorage.setItem("text", text); // Optionally save to localStorage if you want to persist text
    generateWordCloud(text,selectedFont); // Call the function to generate the word cloud immediately
});
