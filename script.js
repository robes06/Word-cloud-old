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
document.getElementById("light-palette").addEventListener("click", function() {
    selectedPalette = lightPalette;
    backgroundColor = "#FFFFFF";
    updateWordCloudStyles();
});

// Changes to dark palette on user selection 
document.getElementById("dark-palette").addEventListener("click", function() {
    selectedPalette = darkPalette;
    backgroundColor = "#333333";
    updateWordCloudStyles();
});

// Changes rotation of words in word cloud
let rotateElement = document.querySelector(".rotation-options");
rotateElement.addEventListener("change", (event) => {
    const selectedRotation = event.target.value;

if (selectedRotation == "vertical"){
    rotation = -90
}else if (selectedRotation == "horizontal"){
    rotation = 0
}else{
    rotation = 75
}

    
    console.log(rotation)
})

// Changes fonts on user selection
let selectElement = document.querySelector(".font")

selectElement.addEventListener("change",(event) =>{
    selectedFont = event.target.value
    localStorage.setItem("selectedFont",selectedFont)
    console.log("Select font is",selectedFont)
    
})



// Function to generate word cloud
function generateWordCloud(text) {
    const wordsArray = text.split(/\s+/); // Removes white space 

    // Creates an object with each word and the frequency
    const wordCounts = {}; 
    wordsArray.forEach(word => {
        word = word.toLowerCase();
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    // Word assigned as value to key 'text' and size of the word (by frequency of the word) assigned as value to key 'size'
    const myWords = Object.keys(wordCounts).map(word => ({
        text: word,
        size: wordCounts[word] * 20
    }));

    // Creates margins for svg 
    const margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    d3.select("#my_dataviz").html("");
    d3.select("#my_dataviz").style("display", "block");

    //Inits the svg with width, height grouping and transformation
    const svg = d3.select("#my_dataviz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Inits the layout for each word 
    const layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords)
        .padding(10)
        .fontSize(function(d) { return d.size; })
        .on("end", draw);

    layout.start();

    // Generated word cloud from user input
    function draw(words) {
        svg.append("g") // Groups svg
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")") 
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-family", selectedFont)
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d, i) {
                return selectedPalette[i % selectedPalette.length];
            })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + rotation + ")";
            })
            .text(function(d) { return d.text; });
    }
}

// Runs generation function when users clicks 'generate' button
document.getElementById("generate").addEventListener("click", () => {
    // Checks if the word cloud has text input
    const text = document.getElementById("word-input").value;
    if (text.trim() === "") {
        alert("Please enter some text before generating the word cloud!");
        return;
    }

    localStorage.setItem("text", text);
    generateWordCloud(text);
});
