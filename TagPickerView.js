class TagPickerView {
    constructor(targetName = "body", model = { name: "Demo" }) {
        this.model = model;
        this.target = document.querySelector(targetName);
        this.render();
    }

    tag(tagData){
        debugger;
        return `<li>${tagData.keyword}</li>`;
    }

    render() {
        const name = this.model.defaultCategory.name;
        const list = this.model.getAll();
        const tags = list.map(this.tag).join("");

        this.target.innerHTML = `
        <b>${name}</b><br>
        <ul>${tags}</ul>
        `;
    }

    onClick(e) {
        this.model.onClick(e);
        this.render();
    }
}
