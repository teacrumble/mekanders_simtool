
import { openNewTab } from "./tabs";
import { setResultBehaviours } from "./inputs";
import { update_version } from "../startup/ioJson";
import { setTableBehaviour } from "./tables";
import { setTables } from "../startup/sTables";

//budget points to euro AND vice versa
function convertBudget(){
    const budgetP = document.getElementById("budgetP");
    const budgetE = document.getElementById("budgetE");

    const blankOnZero = num => num == 0 ? "" : num;

    budgetE.onchange = () => {
        budgetP.value = blankOnZero(fixedPrice(Math.abs(budgetE.value) / _globals.persoonsvolgend_rate));
        calculateTotal();
    };
    budgetP.onchange = () => {
        budgetE.value = blankOnZero(roundedPrice(Math.abs(budgetP.value) * _globals.persoonsvolgend_rate, 2));
        calculateTotal();
    }
}

function changeSymbols(){
    const switchR = document.querySelectorAll("#switchTotal input");
    switchR.forEach(r => r.onchange = () => {
        totalsChange();
        updateResults();
    });

    switchR[0].onchange();
}



//toont het aantal dagen waar de periode uit bestaat
function setPeriodDays(){
    const periodDays = document.querySelector("#totaalDagen");
    const dates = document.querySelectorAll("input[type='date']");

    dates.forEach(d => d.onchange = () => periodDays.innerHTML = `${getPeriodDays()} dagen`);

    dates[0].onchange();
}

//zorgt dat je enkel dingen kan berekenen wanneer de nodige gegevens zijn ingevuld
function lockInputs(){
    const veil = document.querySelector("#veil");
    const bValue = document.querySelector("#bValue");
    const pValue = document.querySelector("#pValue");

    const inputs = [bValue, pValue];

    inputs.forEach(inp => inp.onchange = () => {
        const res = inputs.map(i => i.value != "").reduce((a,b) => a && b);
        if(res){
            veil.setAttribute("hidden", "hidden");
            setTableBehaviour();
        } 

        else veil.removeAttribute("hidden");
    });
}

function changeUsedFile(){
    const radVersions = document.getElementsByName("BP_version");

    radVersions.forEach(r => r.onchange = () => {
        update_version(r.value == true.toString());
        updateResults();

        setTables();

        const checked = Array.from(document.querySelectorAll("#switchContainer .switch input")).filter(e => e.checked == true)[0];
        checked.onchange();
    })
}

module.exports = {
//set all behaviours
setBehaviours : function(){
    convertBudget();
    lockInputs();
    setPeriodDays();
    setResultBehaviours();
    openNewTab();
    changeSymbols();
    changeUsedFile();
    setTableBehaviour();
}
}
