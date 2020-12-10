class Tab {
    constructor(dag="", woon="", psycho="", pakket="", act=false, besteedbaar="") {
        this.dag = dag;
        this.woon = woon;
        this.psycho = psycho;
        this.pakket = pakket;
        this.act = act;
        this.besteedbaar = besteedbaar;
    }
}

class TabManager{
    constructor() {
        this.inputFields = [document.querySelector("#dag input"), document.querySelector("#woon input"),
            document.querySelector("#psycho input"), document.querySelector(".pakket select"),
            document.querySelector(".actBox input"), document.querySelector(".besteedbaar input")];
        this.tabs = [new Tab(), new Tab(), new Tab(), new Tab()];
        this.tabIndex = 0;
    }

    currentTab() { return this.tabs[this.tabIndex]; }

    saveTab() {
        this.tabs[this.tabIndex] = new Tab(this.inputFields[0].value, this.inputFields[1].value, this.inputFields[2].value,
            this.inputFields[3].value, this.inputFields[4].checked, this.inputFields[5].value);

        //remove bg-color of prices
        const prices = document.getElementById("prices");
        prices.classList.remove(prices.classList[0]);

        //remove bg-color of options
        const options = document.querySelectorAll("option");
        options.forEach(o => o.classList.remove(o.classList[0]));
    }

    loadTab() {
        const tab = this.currentTab();
        const fields = this.inputFields;
        [fields[0].value, fields[1].value, fields[2].value, fields[3].value, fields[4].checked, fields[5].value] =
            [tab.dag, tab.woon, tab.psycho, tab.pakket, tab.act, tab.besteedbaar];

        update();

        const selected = document.querySelector(".selected");
        //set bg-color of prices to bg-color of tab
        const prices = document.getElementById("prices");
        prices.classList.add(selected.classList[1]);
        //set bg-color of options to bg-color of tab
        const options = document.querySelectorAll("option");   
        options.forEach(o => o.classList.add(selected.classList[1]));
    }

    refreshForDownload() {
        let oldT = this.tabIndex;
        if (oldT <= 3) {
            this.saveTab();
            this.loadTab();
        }
    }

    setTabHandlers() {
        const tabs = document.querySelectorAll(".tab[index]");
        const hideDiv = name => document.querySelector(`#${name}`).setAttribute("hidden", "");
        const showDiv = name => document.querySelector(`#${name}`).removeAttribute("hidden");

        tabs.forEach(t => t.onclick = () => {
            //set selected tab
            tabs.forEach(tab => tab.classList.remove("selected"));
            t.classList.add("selected");

            //process old tab
            let oldT = this.tabIndex;
            if (oldT <= 3) this.saveTab();
            else if (oldT == 4) hideDiv("overviews");

            //choose action based on tab
            this.tabIndex = t.getAttribute("index");
            if (this.tabIndex <= 3) {
                showDiv("prices");
                this.loadTab();
            }
            else if (this.tabIndex == 4) {
                hideDiv("prices");
                showDiv("overviews");
                document.querySelector("#overviews").scrollTop = 0
            }
        });

        this.loadTab();
    }
    
}