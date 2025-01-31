import * as mammoth from "mammoth";
const excludePanel = document.getElementById("exclude-words-panel");
const excludePanelButton = document.getElementById("exclude-panel");
const closeExcludePanelButton = document.getElementById("close-exclude-panel");
let tags = [];
const commonTagsContainer = document.querySelector(".common-tags-container");

excludePanelButton.addEventListener("click", () => {
  excludePanel.classList.add("open");
});

closeExcludePanelButton.addEventListener("click", () => {
  excludePanel.classList.remove("open");
});

const tagsInput = document.getElementById("tags");
const addTagButton = document.getElementById("addtag");
const tagsContainer = document.getElementById("tags-selection");

function createTag(tagText) {
  const tag = document.createElement("div");
  tag.className = "tag";

  const tagContent = document.createElement("span");
  tagContent.textContent = tagText;
  tag.appendChild(tagContent);

  tags.push(tagText);
  localStorage.setItem("tags", JSON.stringify(tags));

  const removeButton = document.createElement("button");
  removeButton.className = "remove-tag";
  removeButton.textContent = "✖";
  tag.appendChild(removeButton);

  removeButton.addEventListener("click", () => {
    tagsContainer.removeChild(tag);
    const index = tags.indexOf(tagText.trim().toLowerCase());
    if (index > -1) {
      tags.splice(index, 1);
      localStorage.setItem("tags", JSON.stringify(tags));
    }
  });

  tagsContainer.appendChild(tag);
}

addTagButton.addEventListener("click", () => {
  const inputText = tagsInput.value.trim().toLowerCase();
  if (inputText) {
    const newTags = inputText.split(",");
    newTags.forEach((tag) => {
      const trimmedTag = tag.trim();
      if (trimmedTag) {
        createTag(trimmedTag);
      }
    });

    tagsInput.value = "";
  }

  localStorage.setItem("tags", JSON.stringify(tags));
});

document.addEventListener("DOMContentLoaded", () => {
  const storedTags = JSON.parse(localStorage.getItem("tags")) || [];
  storedTags.forEach((tagText) => {
    createTag(tagText);
  });
});

commonTagsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("common-tag")) {
    const commonTagText = event.target.textContent.trim();
    createTag(commonTagText);
  }
});

addTagButton.addEventListener("click", () => {
  const inputText = tagsInput.value.trim();

  if (inputText) {
    const tags = inputText.split(",");
    tags.forEach((tag) => {
      const trimmedTag = tag.trim();
      if (trimmedTag) {
        createTag(trimmedTag);
      }
    });

    tagsInput.value = "";
  }
});

const downloadPanel = document.getElementById("download-panel");
const downloadButton = document.getElementById("download");
const downloadPanelButtons = document.querySelectorAll(".png, .pdf");

downloadButton.addEventListener("click", () => {
  downloadPanel.classList.add("open");
});

document.addEventListener("click", (event) => {
  if (
    !downloadPanel.contains(event.target) &&
    !event.target.matches("#download, .png, .pdf")
  ) {
    downloadPanel.classList.remove("open");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const uploadPanel = document.getElementById("upload-panel");
  const uploadButton = document.getElementById("upload_button");
  const closeUploadPanelButton = document.getElementById("close-upload-panel");

  uploadButton.addEventListener("click", () => {
    uploadPanel.classList.add("open");
  });

  closeUploadPanelButton.addEventListener("click", () => {
    uploadPanel.classList.remove("open");
  });

  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");

  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");
    const files = event.dataTransfer.files;
    handleFiles(files);
  });

  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    handleFiles(files);
  });

  function handleFiles(files) {
    console.log("Files uploaded:", files);
    const file = files[0]; // Assuming only one file is selected

    // Check if a file was selected
    if (file) {
      const uploadRadio = document.getElementById("upload-file");
      uploadRadio.checked = true;
      uploadPanel.classList.remove("open");

      let fileName = file.name;
      if (fileName.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = function (event) {
          let uploadedText = event.target.result;
          localStorage.setItem("uploadedText", uploadedText);
          const textDiv = document.getElementById("word-input");
          textDiv.value = uploadedText;
        };
        reader.onerror = function (error) {
          console.error("Error reading file:", error);
        };

        reader.readAsText(file);
      }
      if (fileName.endsWith(".docx")) {
        // Create a FileReader to read the file
        console.log("File is a .docx file");
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        // When the file is loaded
        reader.onload = function (e) {
          console.log("File loaded:", e);
          // Get the ArrayBuffer from the file content
          const arrayBuffer = e.target.result;
          console.log("RAAAH", arrayBuffer);

          // Use mammoth to extract raw text from the .docx file
          mammoth
            .extractRawText({ arrayBuffer: arrayBuffer })
            .then((result) => {
              // Display the extracted raw text in the output div
              console.log(result.value);
              let uploadedText = result.value;
              localStorage.setItem("uploadedText", uploadedText);
            })
            .catch((err) => {
              // Handle any errors
              console.error("Error extracting text:", err);
            });
        };
      }

      // Read the file as an ArrayBuffer
    } else if (!files) {
      alert("No file detected!");
    }
  }
});
