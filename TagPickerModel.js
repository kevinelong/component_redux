class TagPickerModel {
    constructor(api, defaultCategory = { name: "Other", id: undefined }, searchText = "") {
        this.api = api;
        this.list = api.data; //NEEDS NO COOKING PERHAPS?
        this.defaultCategory = defaultCategory;
        this.searchText = searchText;
    }
    getAll() {
        return this.list//.filter(t=>t.category.id===this.defaultCategory.id);
    }
    getDefault() {
        return this.list.filter(t=>t.category.id===this.defaultCategory.id);
    }
    getSelected() {
        return this.getDefault().filter(t => t.selected)
    }
    getAvailable() {
        return this.getDefault().filter(t => !t.selected)
    }
    onTagClick(tag) {
        const existing = this.list.find(t => t.id === tag.id);
        existing.selected = !existing.selected; //toggle
        //HIDDEN WILL ALREADY BE CORRECTLY SET
    }
    setSearchText(text) {
        this.searchText = text.trim().toLowerCase();
        //TODO LOOP THROUGH ALL AND SET NON-MATCHING TO HIDDED AND MATCHING TO TRUE
        //NEVER HIDE SELECTED
        for (const tag of this.list) {
            if (tag.selected || this.searchText === "") {
                tag.hidden = false;
            } else if (tag.keyword.toLowerCase().startsWith(this.searchText)) {
                tag.hidden = false;
            } else {
                tag.hidden = true;
            }
        }
    }
    clear() {
        this.setSearchText("");
    }
    add(tagText, category = undefined) {
        //TODO double ensure tag doe not exist
        const tag = this.api.add({
            id: undefined,
            keyword: tagText,
            category: category ? category : this.defaultCategory
        });
        // this.list.push(tag); //list is a pointer/reference to the original api list so this would push it a second time.
        // this.list = this.api.data; // redunant for the same reason above
        return tag;
    }
}

//TESTS
if (typeof window === "undefined") {
    const fruit = {
        id: 11,
        name: "fruit"
    };
    const cheese = {
        id: 22,
        name: "cheese"
    };
    tpm = new TagPickerModel(
        [
            {
                id: 111,
                keyword: "apple",
                category: fruit,
                selected: false,
                hidden: false
            },
            {
                id: 222,
                keyword: "cherry",
                category: fruit,
                selected: false,
                hidden: false
            },
            {
                id: 333,
                keyword: "swiss",
                category: cheese,
                selected: false,
                hidden: false
            },
            {
                id: 444,
                keyword: "cheddar",
                category: cheese,
                selected: false,
                hidden: false
            }
        ],
        fruit
    );

    console.log("ALL:\n", JSON.stringify(tpm.getAll(), 0, 4));

    const swiss = tpm.list[2];
    tpm.onTagClick(swiss);

    console.log("SWISS CLICKED:\n", JSON.stringify(tpm.getAll(), 0, 4));

    tpm.setSearchText("a");

    console.log("ONLY A:\n", JSON.stringify(tpm.getAll(), 0, 4));

    tpm.clear();

    console.log("CLEARED:\n", JSON.stringify(tpm.getAll(), 0, 4));

    tpm.add("banana"); //use default
    tpm.add("cheddar", cheese); //overide default

    console.log("WITH BANANA:\n", JSON.stringify(tpm.getAll(), 0, 4));

}