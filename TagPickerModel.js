class VitaEvent {
    constructor(eventType = "action", eventOptions = {
        target: {},
        which: undefined,
        id: undefined,
        data: {}
    }) {
        this.type = eventType;
        this.options = eventOptions;
    }
}

class TagPickerModel {
    constructor(
        getData = () => { data },
        dispatchEvent = (m) => { m },
        defaultCategory = { name: "Other", id: undefined },
        searchText = ""
    ) {
        this.getData = getData;
        this.dispatchEvent = dispatchEvent;
        this.defaultCategory = defaultCategory;
        this.searchText = searchText;

        this.list = this.getData().map(t => {
            t.hidden = false;
            return t;
        }); //NEEDS NO COOKING PERHAPS?
    }
    getAll() {
        return this.list//.filter(t=>t.category.id===this.defaultCategory.id);
    }
    getDefault() {
        return this.list.filter(t => t.category.id === this.defaultCategory.id);
    }
    getSelected() {
        return this.getDefault().filter(t => t.selected)
    }
    getAvailable() {
        return this.getDefault().filter(t => !t.selected)
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
    onTagClick(tag) {
        const existing = this.list.find(t => t.id === tag.id);
        existing.selected = !existing.selected; //toggle
        //HIDDEN WILL ALREADY BE CORRECTLY SET
        const eventName = existing.selected ? "select" : "deselect";
        const tagEvent = new VitaEvent(
            eventName,
            {
                id: undefined,
                which: "tag",
                target: undefined,
                data: tag
            }
        );
        this.dispatchEvent(tagEvent);
    }
    find(keyword) {
        return this.getDefault().find(t => {
            if (t.keyword === keyword) {
                return t;
            }
        });
    }
    add(tagText, category = undefined) {
        //double ensure tag doe not exist
        const existing = this.find(tagText);
        if (existing) {
            return false;
        }
        const categoryFinal = category ? category : this.defaultCategory;
        const tag = { keyword: tagText, category: categoryFinal };
        const e = {
            id: undefined,
            which: "tag",
            target: undefined,
            data: tag,
        };
        const createEvent = new VitaEvent("create", e);
        this.dispatchEvent(createEvent);

        this.list = this.getData(); // redunant for the same reason above?
        const added = this.list[this.list.length - 1]; //get last array element pushed
        this.onTagClick(added);
        return added;
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
    const data = [
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
    ];

    tpm = new TagPickerModel(
        () => data,
        (e) => {
            if (e.type === "create") {
                data.push(e.options.data);
            } else if (e.type === "select") {
                data.find(t => t.id === e.options.data.id).selected = true;
            } else if (e.type === "deselect") {
                data.find(t => t.id === e.options.data.id).selected = false;
            }
        },
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