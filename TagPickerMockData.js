class TagPickerMockData {
    max_id = 444;
    constructor(data) {
        this.data = data; 
    };
    add(tag) {
        //TODO COULD DO A DUPLICATE CHECK AND RAISE AND ERROR AND OR RETURN FALSE OR UNDEFINED.
        this.max_id++;
        tag.id = this.max_id;
        this.data.push(tag);
        return tag;
    }
    getData() {
        return this.data;
    }
    dispatchEvent(e) {
        console.log("dispatchEvent", e.type, e.options.data);
        if (e.type === "create") {
            this.add(e.options.data);
            // e.options.data.selected = true;
            // this.data.push(e.options.data);
        } else if (e.type === "select") {
            this.data.find(t => t.id === e.options.data.id).selected = true;
        } else if (e.type === "deselect") {
            this.data.find(t => t.id === e.options.data.id).selected = false;
        }
    }
}
