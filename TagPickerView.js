class TagPickerView {
    constructor(targetName = "body", model = { name: "Demo" }) {
        this.model = model;
        this.target = document.querySelector(targetName);
    }
    render() {
        this.target.innerHTML = `${model.name}`
    }
    onClick(e) {
        this.model.onClick(e);
        this.render();
    }
}
