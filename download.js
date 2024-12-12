//When user clicks the download button, the word cloud is downloaded


document.getElementById("download").addEventListener("click", function() {
    // Select the div containing the word cloud (the parent div of the SVG)
    const wordCloudElement = document.getElementById("my_dataviz");
 
    // Check if the word cloud element exists and contains words (i.e., is not empty)
    if (!wordCloudElement || wordCloudElement.style.display === "none" || wordCloudElement.querySelectorAll("text").length === 0) {
        console.error("Word cloud element not found or not rendered! Ensure that the word cloud has been generated.");
        alert("Cannot download because there is no text inputted!");
        return;
    }
 
    // Log the word cloud element for debugging
    console.log("Word Cloud Element:", wordCloudElement);
 
    // Use html2canvas to capture the element as a canvas
    html2canvas(wordCloudElement).then(function(canvas) {
        // Create an image URL from the canvas
        const imgURL = canvas.toDataURL("image/png");
 
        // Create an anchor link and trigger the download
        const link = document.createElement("a");
        link.href = imgURL;
        
        const {jsPDF} = window.jspdf;
        console.log(window.jspdf);
        const doc = new jsPDF()
        doc.addImage(imgURL, 'PNG', 15, 40, 0, 0) 
        doc.save("word-cloud.pdf")
        //link.download = "word-cloud.pdf"; // Set the filename
        link.click(); // Trigger the download
    }).catch(function(error) {
        console.error("Error generating PNG:", error);
    });
});
 

