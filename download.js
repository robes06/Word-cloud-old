import { jsPDF } from "jspdf"; // Imports jsPDF library

// When user clicks download button, word cloud is downloaded as PDF
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

  // Use html2canvas to capture the element as a canvas to download word cloud as  PDF
  html2canvas(wordCloudElement)
    .then(function (canvas) {
      const imgURL = canvas.toDataURL("image/png"); // Create an image URL from the canvas

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [297, 210],
      }); // Creates new instance of jsPDF

      doc.addImage(imgURL, "PNG", 0, 0, 0, 0); // Uses imgurl as image data and creates x,y for pdf
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
      link.download = "word-cloud.png"; // Set the filename

      link.click();
    })
    .catch(function (error) {
      console.error("Error generating PNG:", error);
    });
});
