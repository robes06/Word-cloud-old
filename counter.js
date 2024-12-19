
const excludePanel = document.getElementById("exclude-words-panel");
const excludePanelButton = document.getElementById("exclude-panel");
const closeExcludePanelButton = document.getElementById("close-exclude-panel");


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

  
  const removeButton = document.createElement("button");
  removeButton.className = "remove-tag";
  removeButton.textContent = "✖";
  tag.appendChild(removeButton);

 
  removeButton.addEventListener("click", () => {
    tagsContainer.removeChild(tag);
  });


  tagsContainer.appendChild(tag);
}


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
  if (!downloadPanel.contains(event.target) && !event.target.matches("#download, .png, .pdf")) {
    downloadPanel.classList.remove("open");
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const uploadPanel = document.getElementById("upload-panel");
  const uploadButton = document.getElementById("upload_button");
  const closeUploadPanelButton = document.getElementById("close-upload-panel");

  uploadButton.addEventListener("click", () => {
      uploadPanel.classList.add("open");
  });

  closeUploadPanelButton.addEventListener("click", () => {
      uploadPanel.classList.remove("open");
  });

  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  dropZone.addEventListener('click', () => {
      fileInput.click();
  });

  dropZone.addEventListener('dragover', (event) => {
      event.preventDefault();
      dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (event) => {
      event.preventDefault();
      dropZone.classList.remove('dragover');
      const files = event.dataTransfer.files;
      handleFiles(files);
  });

  fileInput.addEventListener('change', (event) => {
      const files = event.target.files;
      handleFiles(files);
  });

  function handleFiles(files) {
      console.log('Files uploaded:', files);
      // Add your file handling logic here
  }
});