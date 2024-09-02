class TagPickerMockData {
    fruit = {
        id: 11,
        name: "fruit"
    };
    cheese = {
        id: 22,
        name: "cheese"
    };
    constructor() {
        this.data =  [
            {
                id: 111,
                keyword: "apple",
                category: this.fruit,
                selected: true,
                hidden: false
            },
            {
                id: 222,
                keyword: "cherry",
                category: this.fruit,
                selected: false,
                hidden: false
            },
            {
                id: 333,
                keyword: "swiss",
                category: this.cheese,
                selected: true,
                hidden: false
            },
            {
                id: 444,
                keyword: "cheddar",
                category: this.cheese,
                selected: false,
                hidden: false
            }
        ]
    };
}
