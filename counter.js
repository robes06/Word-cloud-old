
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
