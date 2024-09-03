class TagPickerView {
    constructor(targetName = "body", model = { name: "Demo" }) {
        this.model = model;
        this.target = document.querySelector(targetName);
        this.render();
    }
    div(content="", className="", attrs=""){
        return `<div${
            className?this.attr("class",className):""
        }${
            attrs?" "+attrs:""
        }>${
            content
        }</div>`
    }
    tag(tagData) {
        const display = tagData.hidden ? "none" : "inline-block";
        return `<div 
            style="display:${display}" 
            class="tag hash-tag" 
            data-id="${tagData.id}" 
            data-keyword="${tagData.keyword}">${tagData.keyword
            }</div>`;
    }
    tagList(tags, className = "tags") {
        return `<div class="tag-list tag-results ${className}">${tags.map(this.tag).join(" ")}</div>`
    }
    availableTags() {
        return this.tagList(this.model.getAvailable(), "available-tags");
    }
    render() {
        const name = this.model.defaultCategory.name;
        const selectedTags = this.tagList(this.model.getSelected());

        this.target.innerHTML = `
        <div class="tag-picker-view">
            <h1>${name}</h1><br>

            <h3>Available:</h3>
            <input type="text" value="${this.model.searchText}" class="searchText" placeholder="Filter Available"><button class="addButton">Add</button>
            <h4>Matching Search Results</h4>
            ${this.availableTags()}

            <h3>Selected:</h3>
            ${selectedTags}
        </div>
        `;
        //TODO ADD LISTENERS
        this.searchText = this.target.querySelector(".searchText");
        this.addButton = this.target.querySelector(".addButton");
        this.searchText.addEventListener("keyup", e => e.keyCode == 13 ? this.add(e.target.value) : this.setSearchText(e.target.value));
        this.addButton.addEventListener("click", e => this.add(e.target.previousElementSibling.value));
        this.target.querySelectorAll(".tag").forEach(te => te.addEventListener("click", e => this.onTagClick({
            id: Number(e.target.dataset.id),
            keyword: e.target.dataset.keyword
        })));
        this.searchText.focus();
    }
    renderAvailableTags() {
        this.target.querySelector(".available-tags").outerHTML = this.availableTags();
        this.target.querySelectorAll(".available-tags .tag").forEach(te => te.addEventListener("click", e => this.onTagClick({
            id: Number(e.target.dataset.id),
            keyword: e.target.dataset.keyword
        })));
    }

    setSearchText(text) {
        this.model.setSearchText(text);
        this.renderAvailableTags();
    }
    add(text) {
        this.model.add(text);
        this.model.clear();
        this.render();
    }
    onTagClick(tag) {
        this.model.onTagClick(tag);
        this.render();
    }
}
