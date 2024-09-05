class HTMLView {
    constructor(targetName = "body", model = { name: "Demo" }) {
        this.model = model;
        this.target = document.querySelector(targetName);
    }
    htmlAttribute(key, value) {
        return `${key}="${value}"`;
    }
    htmlAttributeList(obj) {
        return Object.keys(obj).map(k => this.htmlAttribute(k, obj[k])).join(" ");
    }
    htmlTag(name = "div", content = "", className = "", attrs = {}, closed = true) {
        const classText = `${className ? " " + this.htmlAttribute("class", className) : ""}`;
        const attrsText = classText + this.htmlAttributeList(attrs);
        return `<${name}${attrsText}>${content}` + (closed ? `</${name}>` : "");
    }
    htmlTagSelfClosing(name = "div", className = "", attrs = {}) {
        return this.htmlTag(name, "", className, attrs, false);
    }
    div(content = "", className = "", attrs = {}) {
        return this.htmlTag("div", content, className, attrs);
    }
    input(value = "", className = "", placeholder = "", attrs = {}) {
        attrs.value = value;
        attrs.placeholder = placeholder;
        return this.htmlTagSelfClosing("input", className, attrs);
    }
    button(content, callBackFunctionName, className = "", attrs = {}) {
        attrs.onclick = `e=>${callBackFunctionName}(e)`;
        return this.htmlTag("button", content, className, attrs);
    }
    h(content, level = 1, className = "", attrs = {}) {
        return this.htmlTag(`h${level}`, content, className, attrs);
    }
}
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
        return this.input(text, "searchText", "Filter Available", { "type": "text" }) +
            this.button("Add", e => this.add(e.target.previousElementSibling.value), "addButton")
            ;
    }
    render() {
        const content = this.h(`Your ${this.name} Interests`, 1, "heading") +
            this.h(`What are your ${this.name} interests?`, 2) +
            this.h(`Available:`, 3) +
            this.inputRow(this.model.searchText) +
            this.h(`Matching Search Results`, 4) +
            this.availableTags() +
            this.h(`Selected:`, 4) +
            this.tagList(this.model.getSelected());
        this.target.innerHTML = this.div(content, "tag-picker-view");
        this.addEventListeners();
    }
    addEventListeners() {
        this.searchText = this.target.querySelector(".searchText");
        this.addButton = this.target.querySelector(".addButton");
        this.searchText.addEventListener("keyup", e => this.handleKeyUp(e));
        // this.addButton.addEventListener("click",
        //     e => this.add(e.target.previousElementSibling.value)
        // );
        this.target.querySelectorAll(".tag").forEach(
            te => te.addEventListener("click",
                (e) => this.onTagClick({
                    id: Number(e.target.dataset.id),
                    keyword: e.target.dataset.keyword
                })
            )
        );
        this.searchText.focus();
    }
    handleKeyUp(e) {
        if (e.keyCode == 13) {
            const matches = this.target.querySelectorAll('.available-tags .tag:not([style="display:none"])');
            //if there are none
            if (matches.length === 0) {
                //then add a new one
                this.add(e.target.value);
            } else {
                //otherwise click the first
                matches[0].dispatchEvent(new Event("click"));
            }
        } else {
            this.setSearchText(e.target.value);
        }
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
