class TagPickerView {
    constructor(targetName = "body", model = { name: "Demo" }) {
        this.model = model;
        this.target = document.querySelector(targetName);
        this.render();
    }

    tag(tagData) {
        const display = tagData.hidden ? "none" : "inline-block";
        return `<li 
            style="display:${display}" 
            class="tag" 
            data-id="${tagData.id}" 
            data-keyword="${tagData.keyword}">[${tagData.keyword
            }]</li>`;
    }

    render() {
        const name = this.model.defaultCategory.name;
        const available = this.model.getAvailable();
        const selected = this.model.getSelected();
        const avilableTags = available.map(this.tag).join(" ");
        const selectedTags = selected.map(this.tag).join(" ");

        this.target.innerHTML = `

        <h1>${name}</h1><br>

        <h4>Available:</h4>
        <input value="${this.model.searchText}" class="searchText" placeholder="Filter Available"><button class="addButton">Add</button><br>
        <ul>${avilableTags}</ul>

        <h4>Selected:</h4>
        <ul>${selectedTags}</ul>
        `;
        //TODO ADD LISTENERS
        this.searchText = this.target.querySelector(".searchText");
        this.addButton = this.target.querySelector(".addButton");
        this.searchText.addEventListener("keyup", e => this.setSearchText(e.target.value));
        this.addButton.addEventListener("click", e => this.add(e.target.previousElementSibling.value));
        this.target.querySelectorAll(".tag").forEach(te => te.addEventListener("click", e => this.onTagClick({
            id: Number(e.target.dataset.id),
            keyword: e.target.dataset.keyword
        })));
    }
    setSearchText(text) {
        this.model.setSearchText(text);
        this.render();
    }
    add(text) {
        this.model.add(text);
        this.render();
    }
    onTagClick(tag) {
        this.model.onTagClick(tag);
        this.render();
    }
}
