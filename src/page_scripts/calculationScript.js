//afgeronde prijs
function roundedPrice(num, p=6) {
    return Math.ceil(num * Math.pow(10, p)) / Math.pow(10, p);
}

//prijs met gegarandeerd 6 cijfers achter de comma
function fixedPrice(num, p=6){
    return (roundedPrice(num, p)).toFixed(p);
}

//min en max dagen voor de periode
function minmax(num, altMax, dagen=true){

    let number = dagen ? num : num * 44 / 52;  //<-- want indiv =  * 44/52  MAAR MOEST NOG BEKEKEN WORDEN

    const min = Math.floor(number*0.9);
    let max =  Math.ceil(number*1.05);
    max = dagen ? Math.ceil(Math.min(max, altMax)) : max;

    const strMin = ('____'+min).slice(-4).split("_").join("  ");
    const strMax = (max+'____').slice(0,4).split("_").join("  ");

    return `Min ${strMin}    -    Max ${strMax}`;
}

//aantal voor de gehele periode ipv per week
function periode_aantal(aantal, periodeDagen){
    return (aantal/7)*periodeDagen;
}

//berekenen van het verschil van dagen
function dagenVerschil(startDatum, eindDatum){
    if(eindDatum > startDatum){
        const timediff = eindDatum - startDatum;
        const diffDays = Math.ceil(((timediff / 1000) / 60) / 60) / 24;
        return diffDays+1;
    }
    return 0;
}

//het aantal dagen van de periode of 365 indien niet valid
function getPeriodDays(){
    const start = document.getElementById("startDt").value;
    const eind = document.getElementById("endDt").value;

    if(start != "" && eind != "") return dagenVerschil(new Date(start), new Date(eind));
    return 365;
}

//minmax van ondersteuningen berekenen
function getMinMaxOndersteuning(num, dagen=true){
    if(num > 0){
        const days = getPeriodDays();
        if(days > 0) return minmax(periode_aantal(num, days), days, dagen);
    }
    return "";
}

//totaalprijs van de periode berekenen
function getTotaalPeriod(num, type){
    if(num > 0){
        const days = getPeriodDays();
        const fixed = type == "P" ? 6 : 2;
        if(days > 0) return fixedPrice((num / 365) * days, fixed);
    }
    return "";
}

//txt versie van de categorie krijgen
function getCategory(){
    const Bvalue = document.getElementById("bValue");
    const Pvalue = document.getElementById("pValue");
    return `B${Bvalue.value}/P${Pvalue.value}`;
}

//prijs halen voor categorieen, psycho en indiv ondersteuningen
//id is de soort van ondersteuning
//num is het ingegeven aantal
function getPrice(num, id){
    if(num >= 0){
        //dag en woon
        if(id == "dag" || id == "woon"){
            const bp = getCategory();
            for(let i = 0; i<_categories.length; i++){
                if(_categories[i].cat_ids.indexOf(bp) > -1){
                    const basis = _categories[i].cat_info[`${id}_basis`];
                    const inc = _categories[i].cat_info[`${id}_inc`];

                    if(num <= 1) return num * basis;
                    else if(num > 5) return basis + (inc * 4) + (inc * (num - 5) * _globals.weekend_modifier);
                    else return basis + (inc * (num - 1));
                }
            }
        }
        //psycho
        else if(id == "psycho"){
            let result = 0;
            const uren = Math.ceil(num);
            if(uren >= 1) result += _globals.psychosociaal.eerste;
            if(uren >= 2) result += _globals.psychosociaal.tweede;
            if(uren > 2) result += Math.min((uren-2), 10)*_globals.indiv.tien;
            if(uren > 12) result += (uren-12)*_globals.indiv.overige;
            return result;
        }
    }
    return 0;
}

//maakt een textveld schoon zodat er enkel cijfers of formules in zullen staan
function cleanTxt(txt){
    if(txt != ""){
        return txt.toString().replace(/[^-()\d/*+.]/g, '');
    }
    return "";
}

//update het resultaat van een ondersteuning
function updateResults(){
    document.querySelectorAll("#ondersteuningen>:not(.header) input, #andere input, #andere select").forEach(i => i.onchange());
}

//berekent de totaalkosten
function calculateTotal(){
    const totalen = document.querySelectorAll("#ondersteuningen>:not(.header) .totaal, #andere .totaal");
    const resR = document.querySelector("#switchTotal input:checked").value;
    const budgetRow = document.querySelector("#resBudgetRow");
    const budget = document.querySelector(`#budget${resR}`);
    const totRow = document.querySelector("#resCostRow");
    const res = document.querySelector("#res");
    const resType = resR == "P" ? 6 : 2;
    let result = 0;

    totalen.forEach(t => result += eval(`${t.innerHTML}+0`));

    res.innerHTML = result > 0 ? fixedPrice(result, resType) :  "";

    if(budget.value != "" && res.innerHTML != ""){
        budgetRow.querySelector(".res").innerHTML = fixedPrice(budget.value, resType);

        const verschil = budget.value - res.innerHTML;
        totRow.querySelector(".res").innerHTML = `${verschil > 0 ? "+" : "-"}${fixedPrice(Math.abs(verschil), resType)}`;

        budgetRow.removeAttribute("hidden");
        totRow.removeAttribute("hidden");
    }else{
        budgetRow.setAttribute("hidden", "");
        totRow.setAttribute("hidden", "");
    }    
    totalsChange();
}

function totalsChange(){
    const totalen = document.querySelectorAll("#ondersteuningen>:not(.header) .totaal, #andere .totaal, .res");
    const resR = document.querySelector("#switchTotal input:checked").value;
    totalen.forEach(t => {
        t.classList.remove("symbP");
        t.classList.remove("symbE");
        if(t.innerHTML != "") {
            if(resR == "P") t.classList.add("symbP");
            else t.classList.add("symbE");
        }
    });
}