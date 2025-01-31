import { jsPDF } from "jspdf";

// When the user hits the download button, the word cloud saves as a PDF
document.getElementById("pdf").addEventListener("click", function () {
  const wordCloudElement = document.getElementById("my_dataviz"); // Gets word cloud element

  // Checks if the word cloud exists
  if (
    !wordCloudElement ||
    wordCloudElement.style.display === "none" ||
    wordCloudElement.querySelectorAll("text").length === 0
  ) {
    console.error(
      "Word cloud element not found or not rendered! Ensure that the word cloud has been generated."
    );
    alert("Cannot download because there is no text inputted!");
    return;
  }

  // Use html2canvas to capture the element as a canvas to download word cloud as PDF
  html2canvas(wordCloudElement)
    .then(function (canvas) {
      const imgURL = canvas.toDataURL("image/png"); // Create an image URL from the canvas

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [297, 210],
      }); // Creates new instance of jsPDF

      // Get the width and height of the canvas
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Define the PDF dimensions (A4 landscape)
      const pdfWidth = 297; 
      const pdfHeight = 210; 

      // Calculate scale factor to fit image inside the PDF
      const scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const scaledImgWidth = imgWidth * scaleFactor;
      const scaledImgHeight = imgHeight * scaleFactor;

      const offsetX = (pdfWidth - scaledImgWidth) / 2;
      const offsetY = (pdfHeight - scaledImgHeight) / 2;
      doc.addImage(
        imgURL,
        "PNG",
        offsetX,
        offsetY,
        scaledImgWidth,
        scaledImgHeight
      ); // Uses imgurl as image data and creates x,y for pdf
      doc.save("word-cloud.pdf"); // Saves as PDF

      link.click();
    })
    .catch(function (error) {
      console.error("Error generating PNG:", error);
    });
});

document.getElementById("png").addEventListener("click", function () {
  const wordCloudElement = document.getElementById("my_dataviz"); // Gets word cloud element

  // Checks if the word cloud exists
  if (
    !wordCloudElement ||
    wordCloudElement.style.display === "none" ||
    wordCloudElement.querySelectorAll("text").length === 0
  ) {
    console.error(
      "Word cloud element not found or not rendered! Ensure that the word cloud has been generated."
    );
    alert("Cannot download because there is no text inputted!");
    return;
  }

  html2canvas(wordCloudElement)
    .then(function (canvas) {
      const imgURL = canvas.toDataURL("image/png"); // Create an image URL from the canvas

      const link = document.createElement("a"); // Anchor element is created

      link.href = imgURL; //Creates a url which points to the PNG
      link.download = "word-cloud.png"; 

      link.click();
    })
    .catch(function (error) {
      console.error("Error generating PNG:", error);
    });
});
