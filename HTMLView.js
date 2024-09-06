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
    button(content, className = "", attrs = {}) {
        return this.htmlTag("button", content, className, attrs);
    }
    h(content, level = 1, className = "", attrs = {}) {
        return this.htmlTag(`h${level}`, content, className, attrs);
    }
    element(html) {
        const el = document.createElement('div');
        el.innerHTML = html.trim();
        return el.firstChild;
    }
    elements(html) {
        const el = document.createElement('div');
        el.innerHTML = html.trim();
        return el.childNodes;
    }
}