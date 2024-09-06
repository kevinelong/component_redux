class TagPickerView extends HTMLView {
    constructor(targetName = "body", model = { name: "Demo" }) {
        super(targetName, model)
        this.name = this.model.defaultCategory.name;
        this.render();
    }
    tag(tagData) {
        const display = tagData.hidden ? "none" : "inline-block";
        return this.div(
            tagData.keyword,
            "tag hash-tag",
            {
                "style": `display:${display}`,
                "data-id": `${tagData.id}`,
                "data-keyword": `${tagData.keyword}`
            }
        );
    }
    tagElement(tagData) {
        const te = this.element(this.tag(tagData));
        te.addEventListener("click",
            (e) => this.onTagClick(e, {
                id: Number(e.target.dataset.id),
                keyword: e.target.dataset.keyword
            })
        );
        return te;
    }
    tagList(tags, className = "tags") {
        return this.div(
            tags.map(t => this.tag(t)).join(" "),
            `tag-list tag-results ${className}`
        );
    }
    availableTags() {
        return this.tagList(this.model.getAvailable(), "available-tags");
    }
    inputRow(text) {
        return this.input(text, "searchText", "Type to filter available; enter to select or add.", { "type": "text" }) +
            this.button("Add", "addButton");
    }
    render() {
        this.target.innerHTML = this.div("Loading...", "tag-picker-view");
        this.updateFullView();
        this.addEventListeners();
    }
    updateFullView() {
        const root = this.target.querySelector(".tag-picker-view");
        root.innerHTML = this.h(`Your ${this.name} Interests`, 1, "heading") +
            this.h(`What are your ${this.name} interests?`, 2) +
            this.h(`Available:`, 3) +
            this.inputRow(this.model.searchText) +
            this.h(`Matching Search Results`, 4) +
            this.availableTags() +
            this.h(`Selected:`, 4) +
            this.tagList(this.model.getSelected());
    }
    updateAvailableTags() {
        this.target.querySelector(".available-tags").outerHTML = this.availableTags();
        this.target.querySelectorAll(".available-tags .tag").forEach(te => te.addEventListener("click", e => this.onTagClick(e, {
            id: Number(e.target.dataset.id),
            keyword: e.target.dataset.keyword
        })));
    }
    addEventListeners() {
        this.searchText = this.target.querySelector(".searchText");
        this.addButton = this.target.querySelector(".addButton");
        this.searchText.addEventListener("keyup", e => this.handleKeyUp(e));
        this.addButton.addEventListener("click",
            e => this.add(e.target.previousElementSibling.value)
        );
        this.target.querySelectorAll(".tag").forEach(
            te => te.addEventListener("click",
                (e) => this.onTagClick(e, {
                    id: Number(e.target.dataset.id),
                    keyword: e.target.dataset.keyword
                })
            )
        );
        this.searchText.focus();
    }
    handleKeyUp(e) {
        const text = e.target.value;
        if (e.keyCode == 13 && text) {
            const matches = this.target.querySelectorAll('.available-tags .tag:not([style="display:none"])');
            //if there are none
            if (matches.length === 0) {
                //then add a new one
                this.add(text);
                this.setSearchText("");
            } else {
                //otherwise click the first
                matches[0].dispatchEvent(new Event("click"));
            }
        }else{
            this.setSearchText(text);
            this.updateAvailableTags();
        }
    }
    setSearchText(text) {
        this.model.setSearchText(text);
        this.target.querySelector(".searchText").value = text;
        this.updateAvailableTags();
    }
    add(text) {
        const newTagData = this.model.add(text);
        this.model.clear();
        this.setSearchText("");
        if (!newTagData) {
            return;
        }
        const selectedTagsElement = this.target.querySelector(".tags");
        const te = this.tagElement(newTagData);
        selectedTagsElement.appendChild(te);
        this.updateAvailableTags();
    }
    onTagClick(e, tag) {
        this.model.onTagClick(tag);
        const tagElement = e.target.closest(".tag");
        const originalParent = tagElement.closest(".tag-list");
        let newParent = undefined;
        if (originalParent.classList.contains("available-tags")) {
            newParent = this.target.querySelector(".tags");
        } else {
            newParent = this.target.querySelector(".available-tags");
        }
        newParent.appendChild(tagElement);
        // this.render();
    }
}
