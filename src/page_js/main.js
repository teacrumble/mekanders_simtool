﻿const reader = new JsonReader();
const calc = new RowCalculator(reader.global.punt_euro_rate, null, reader.psycho);
const cost = new CostBehaviour(calc, reader);
const loader = new TableLoader(reader);
const master = new MasterBehaviour(reader.global.persoonsvolgend_rate, cost, reader, loader);

function mainStart(){
    const tabMngr = new TabManager();
    const processor = new Processor(tabMngr);
    master.processor = processor;
    master.tabMgr = tabMngr;
    //SET DATE MINMAX
    setDateMinMax();

    //LOAD PACKETS
    const packets = reader.packets;
    loadPackets(packets);

    //SET BEHAVIOURS
    master.setMasterBehaviours();
    setOndersteuning_limits();
};

//METHODS

function loadPackets(packets) {
    const select = document.querySelector(".pakket select");
    const addOption = desc => {
        const option = document.createElement("option");
        option.innerText = desc;
        select.appendChild(option);
    };

    addOption("");
    for (let key of packets.keys()) {
        addOption(key);
    }
}

function setDateMinMax() {
    const inputs = document.querySelectorAll("input[type=date]");

    inputs.forEach(input => {
        const current = new Date();
        input.min = `${current.getFullYear()}-01-01`;
        input.max = `${current.getFullYear() + 4}-12-31`;
    });
}

function fixed_p(budget, dec) {
    return budget.toFixed(dec);
}

function dagenVerschil(startDatum, eindDatum) {
    if (eindDatum > startDatum) {
        const timediff = eindDatum - startDatum;
        const diffDays = Math.ceil(((timediff / 1000) / 60) / 60) / 24;
        return diffDays + 1;
    }
    return 0;
}

function getPeriodDays() {
    const start = document.getElementById("startDt").value;
    const eind = document.getElementById("endDt").value;

    if (start != "" && eind != "") return dagenVerschil(new Date(start), new Date(eind));
    return 365;
}

function update() {-
    document.querySelectorAll("#ondersteuningen>:not(.header) .wekelijks input, #andere input, #andere select").forEach(i => i.dispatchEvent(new Event("change")));
}

function cleanTxt(txt) {
    if (txt != "") return txt.toString().replace(/[^-()\d/*+.]/g, '');
    return "";
}

function checkOndersteuning_limit(input, max) {
    input.value = cleanTxt(input.value);
    const lblError = input.nextElementSibling;
    if (input.value != "" && eval(input.value) > max) lblError.textContent = `!! De max grootte is: ${max}`;
    else lblError.textContent = "";
}

function checkOndersteuning_limit_dag() {
    const dag = document.querySelector("#dag input");
    const woon = document.querySelector("#woon input");
    const periode = getPeriodDays();
    const logeren = ((eval(woon.value) / 7) * periode) <= 60;

    const max = woon.value == "" || logeren ? 5 : 7;
    checkOndersteuning_limit(dag, max);
}

function checkOndersteuningLimitBesteedbaar() {
    const persoonlijk = eval(document.querySelector("#budgetP").value+0);
    const input = document.querySelector("#besteedbaar");
    const max = persoonlijk <= 34.81 ? 1800 : 3600;

    input.value = cleanTxt(input.value);
    const lblError = input.parentNode.nextElementSibling;
    if (input.value != "" && eval(input.value) > max) lblError.textContent = `!! De max hoeveelheid is: € ${max}`;
    else lblError.textContent = "";
}

function setOndersteuning_limits() {
    const dag = document.querySelector("#dagRow input");
    const woon = document.querySelector("#woonRow input");
    const psycho = document.querySelector("#psychoRow input");
    const besteedbaar = document.querySelector("#besteedbaar");

    dag.addEventListener("change", () => checkOndersteuning_limit_dag());
    woon.addEventListener("change", () => {
        checkOndersteuning_limit(woon, 7);
        checkOndersteuning_limit_dag();
    });
    psycho.addEventListener("change", () => checkOndersteuning_limit(psycho, 99));
    besteedbaar.addEventListener("change", () => checkOndersteuningLimitBesteedbaar());
}