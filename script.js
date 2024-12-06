// Define a default palette
let selectedPalette = []; // Default palette is empty, will be set when the user selects a color palette
let backgroundColor = "#FFFFFF"; // Default background color for light mode

// Define color palettes
const lightPalette = ["#1A0878", "#5A1F9F", "#FF4D27", "#000000", "#AA4BF5"];
const darkPalette = ["#C8DCE9", "#AA4BF5", "#FF885B", "#FF4D27", "#E3E3E3"];

document.getElementById("light-palette").addEventListener("click", function() {
    selectedPalette = lightPalette;
    backgroundColor = "#FFFFFF";
    console.log("Light palette selected");
    updateWordCloudStyles();
});

document.getElementById("dark-palette").addEventListener("click", function() {
    selectedPalette = darkPalette;
    backgroundColor = "#333333";
    console.log("Dark palette selected");
    updateWordCloudStyles();
});

// Function to update word cloud styles
function updateWordCloudStyles() {
    d3.select("#my_dataviz").style("background-color", backgroundColor);
    d3.select("#my_dataviz").style("display", "block");
}

 
function generateWordCloud(text) {
    const wordsArray = text.split(/\s+/);
    const wordCounts = {};
    wordsArray.forEach(word => {
        word = word.toLowerCase();
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const myWords = Object.keys(wordCounts).map(word => ({
        text: word,
        size: wordCounts[word] * 20
    }));

    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    d3.select("#my_dataviz").html(""); // Clear existing content

    var svg = d3.select("#my_dataviz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords)
        .padding(10)
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    function draw(words) {
        svg.append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("fill", (d, i) => selectedPalette[i % selectedPalette.length])
            .attr("text-anchor", "middle")
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.text);
    }
}

 
document.getElementById("generate").addEventListener("click", () => {
    const text = document.getElementById("word-input").value;
    if (text.trim() === "") {
        alert("Please enter some text before generating the word cloud!");
        return;
    }

    localStorage.setItem("text", text);
    console.log("Captured text:", text);

    generateWordCloud(text);
});

 
 
document.getElementById("download").addEventListener("click", function() {
    const wordCloudElement = document.getElementById("my_dataviz");

    if (!wordCloudElement || wordCloudElement.style.display === "none" || wordCloudElement.querySelectorAll("text").length === 0) {
        console.error("Word cloud element not found or not rendered!");
        alert("Cannot download because there is no text inputted!");
        return;
    }

    html2canvas(wordCloudElement).then(function(canvas) {
        const imgURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgURL;
        link.download = "word-cloud.png";
        link.click();
    }).catch(error => console.error("Error generating PNG:", error));
});

    // Log the word cloud element for debugging
    console.log("Word Cloud Element:", wordCloudElement);
 
    // Use html2canvas to capture the element as a canvas
    html2canvas(wordCloudElement).then(function(canvas) {
        // Create an image URL from the canvas
        const imgURL = canvas.toDataURL("image/png");
 
        // Create an anchor link and trigger the download
        const link = document.createElement("a");
        link.href = imgURL;
        link.download = "word-cloud.png"; // Set the filename
        link.click(); // Trigger the download
    }).catch(function(error) {
        console.error("Error generating PNG:", error);
    });

 
