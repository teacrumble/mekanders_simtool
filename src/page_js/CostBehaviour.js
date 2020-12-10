/**
 * Copyright 2020 Dries Rascar

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

class CostBehaviour {

    constructor(rowcalculator, reader) {
        this.rowcalculator = rowcalculator;
        this.reader = reader;
    }

    totalsChange() {
        const totalen = document.querySelectorAll("#ondersteuningen>:not(.header) .totaal, #andere .totaal, .res");
        const resR = document.querySelector("#switchTotal input:checked").value;
        totalen.forEach(t => {
            t.classList.remove("symbP");
            t.classList.remove("symbE");
            if (t.innerHTML != "") {
                if (resR == "P") t.classList.add("symbP");
                else t.classList.add("symbE");
            }
        });
    }

    //VERANDER: setResult voor elke row herzien en verbeteren
    setResultDag() {
        //select elements
        const woon = document.querySelector("#woon input");
        const dag = document.querySelector("#dagRow");
        const minmax = dag.querySelector(".minmax .col-9");
        const totalD = dag.querySelector(".minmax input");
        const totaal = dag.querySelector(".totaal");
        const input = dag.querySelector("input");        

        input.onchange = e => {
            const periode = getPeriodDays();
            const resR = document.querySelector("#switchTotal input:checked").value;
            const inpVal = eval(input.value);

            const withoutLiving = woon.value == "" || ((eval(woon.value) / 7) * periode) <= 60;
            let max = withoutLiving ? 5 : 7;
            const inPoints = resR == "P";
            const decimals = inPoints ? 6 : 2;

            const isInvalid = v => v!== v || v == 0;
            const boundaries = this.rowcalculator.getMinMaxDay(inpVal, periode, withoutLiving);
            totalD.value =   isInvalid(boundaries.total) ? "" : boundaries.total;

            if (inpVal <= max && inpVal > 0) {
                const price = this.rowcalculator.calculateCostDay(inpVal, periode, inPoints);
                minmax.innerHTML = "Totaal " +boundaries.show();
                totaal.innerHTML = fixed_p(price, decimals);
            } else {
                minmax.innerHTML = "Totaal ";
                totaal.innerHTML = "";
            }

            this.calculateTotal();
        }

        totalD.onchange = e => {
            const inpVal = eval(totalD.value);
            const periode = getPeriodDays();
            const withoutLiving = woon.value == "" || ((eval(woon.value) / 7) * periode) <= 60;

            
            if (inpVal > 0) input.value = this.rowcalculator.reverseDay(inpVal, periode, withoutLiving);
            else input.value = "";

            input.dispatchEvent(new Event("change"));
        };
        
    }

    setResultWoon() {
        const woon = document.querySelector("#woonRow");
        const minmax = woon.querySelector(".minmax .col-9");
        const totalD = woon.querySelector(".minmax input");
        const totaal = woon.querySelector(".totaal");
        const input = woon.querySelector("input");

        input.onchange = e => {
            const periode = getPeriodDays();
            const resR = document.querySelector("#switchTotal input:checked").value;
            const inpVal = eval(input.value);
            const inPoints = resR == "P";
            const decimals = inPoints ? 6 : 2;

            const isInvalid = v => v!== v || v == 0;
            const boundaries = this.rowcalculator.getMinMaxLiving(inpVal, periode);
            totalD.value =  isInvalid(boundaries.total)  ? "" : boundaries.total;

            if (inpVal <= 7 && inpVal > 0) {
                const price = this.rowcalculator.calculateCostLiving(inpVal, periode, inPoints);
                minmax.innerHTML = "Totaal " + boundaries.show();
                totaal.innerHTML = fixed_p(price, decimals);
            } else {
                minmax.innerHTML = "Totaal ";
                totaal.innerHTML = "";
            }

            if (e.isTrusted || e.detail == "total") update();
            this.calculateTotal();
        }



        totalD.onchange = e => {
            const inpVal = eval(totalD.value);
            const periode = getPeriodDays();
            
            if (inpVal > 0) input.value = this.rowcalculator.reverseWoon(inpVal, periode);
            else input.value = "";

            input.dispatchEvent(new CustomEvent("change", {detail: "total"}));
        };
    }

    setResultPsycho() {
        const psycho = document.querySelector("#psychoRow");
        const minmax = psycho.querySelector(".minmax .col-9");
        const totalD = psycho.querySelector(".minmax input");
        const totaal = psycho.querySelector(".totaal");
        const input = psycho.querySelector("input");

        input.onchange = e => {
            const periode = getPeriodDays();
            const resR = document.querySelector("#switchTotal input:checked").value;
            const inpVal = eval(input.value);
            const inPoints = resR == "P";
            const decimals = inPoints ? 6 : 2;

            const isInvalid = v => v!== v || v == 0;
            const boundaries = this.rowcalculator.getMinMaxPsycho(inpVal, periode);
            totalD.value =  isInvalid(boundaries.total)  ? "" : boundaries.total;

            if (inpVal <= 99 && inpVal > 0) {
                const price = this.rowcalculator.calculateCostPsycho(inpVal, periode, inPoints);
                minmax.innerHTML = "Totaal " + boundaries.show();
                totaal.innerHTML = fixed_p(price, decimals);
            } else {
                minmax.innerHTML = "Totaal ";
                totaal.innerHTML = "";
            }

            this.calculateTotal();
        }

        totalD.onchange = e => {
            const inpVal = eval(totalD.value);
            const periode = getPeriodDays();
            
            if (inpVal > 0) input.value = this.rowcalculator.reversePsycho(inpVal, periode);
            else input.value = "";
            input.dispatchEvent(new Event("change"));
        };
    }

    setResultPakket() {
        const pakketten = document.querySelector("#pakketten");
        const pakketSelect = pakketten.querySelector("select");
        const pakketBeschrijving = pakketten.querySelector(".details");
        const pakketTotaal = pakketten.querySelector(".totaal");

        pakketSelect.onchange = () => {
            const resR = document.querySelector("#switchTotal input:checked");
            const inPoints = resR.value == "P";
            const decimals = inPoints ? 6 : 2;
            let option = pakketSelect.options[pakketSelect.selectedIndex].text;

            let pakket = this.reader.packets.get(option);
            if (pakket == undefined) pakket = { detail: "", punten: "" };

            pakketBeschrijving.innerHTML = pakket.detail;

            if (pakket.punten != "") {
                let price = pakket.punten;
                if (!inPoints) price *= this.reader.global.punt_euro_rate;
                pakketTotaal.innerHTML = fixed_p(price, decimals);
            }
            else pakketTotaal.innerHTML = "";

            this.calculateTotal();
        }
    }

    setResultActiviteiten() {
        const activiteiten = document.querySelector("#activiteiten");
        const acts = activiteiten.querySelector("input");
        const actTotaal = activiteiten.querySelector(".totaal");

        acts.onchange = () => {
            const resR = document.querySelector("#switchTotal input:checked");
            const inPoints = resR.value == "P";
            const decimals = inPoints ? 6 : 2;
            if (acts.checked) {
                let price = this.reader.global.activiteiten_ontmoeting;
                if (!inPoints) price *= this.reader.global.punt_euro_rate;
                actTotaal.innerHTML = fixed_p(price, decimals);
            }
            else actTotaal.innerHTML = "";

            this.calculateTotal();
        }
    }

    setResultBesteedbaar() {
        const besteedbaar = document.querySelector("#besteedbaarDeel");
        const persoonlijk = eval(document.querySelector("#budgetP").value + 0);
        const besteedInput = besteedbaar.querySelector("input");
        const besteedPunten = besteedbaar.querySelector(".totaal");

        besteedInput.onchange = () => {
            const max = persoonlijk <= 34.81 ? 1800 : 3600;
            const resR = document.querySelector("#switchTotal input:checked");
            const inPoints = resR.value == "P";
            const decimals = inPoints ? 6 : 2;
            let prijs = eval(`${besteedInput.value}+0`);

            if (prijs > 0 && prijs <= max) {
                if (inPoints) prijs /= this.reader.global.besteedbaar_rate;
                besteedPunten.innerHTML = fixed_p(prijs, decimals)
            }
            else besteedPunten.innerHTML = "";

            this.calculateTotal();
        }
    }

    //CALCULATE TOTAL HERZIEN
    calculateTotal() {
        //resultrows
        const resRow = document.querySelector("#res");
        const budgetRow = document.querySelector("#resBudgetRow");
        const totRow = document.querySelector("#resCostRow");

        //restype & budget
        const resR = document.querySelector("#switchTotal input:checked").value;
        const budget = document.querySelector(`#budget${resR}`);
        const resType = resR == "P" ? 6 : 2;
        const budgetValue = eval(`${budget.value}+0`);
        budgetRow.querySelector(".res").innerHTML = budgetValue > 0 ? fixed_p(budgetValue, resType) : "";

        //result
        const totalen = document.querySelectorAll("#ondersteuningen>div:not(.header) .totaal, #andere .totaal");
        let result = 0; 
        totalen.forEach(t => result += eval(`${t.innerHTML}+0`));
        resRow.innerHTML = result > 0 ? fixed_p(result, resType) : "";

        if (budget.value != "" && resRow.innerHTML != "") {
            const verschil = budgetValue - result;
            totRow.querySelector(".res").innerHTML = `${verschil > 0 ? "+" : "-"}${fixed_p(Math.abs(verschil), resType)}`;

            totRow.removeAttribute("hidden");
        } else {
            totRow.setAttribute("hidden", "");
        }
        this.totalsChange();
    }

    changeSymbols() {
        const switchR = document.querySelectorAll("#switchTotal input");
        switchR.forEach(r => r.onchange = () => {
            update();
            this.calculateTotal();
        }); 

        switchR[0].checked = true;
    }


    setCostBehaviour() {
        this.changeSymbols();
        this.setResultDag();
        this.setResultWoon();
        this.setResultPsycho();
        this.setResultPakket();
        this.setResultActiviteiten();
        this.setResultBesteedbaar();
    }
}