//zet de behaviour van de andere factoren
function getResType(){
    const resR = document.querySelector("#switchTotal input:checked").value;
    return resR == "P" ? 6 : 2;
}

function setPakketResult(){
    const pakketten = document.querySelector("#pakketten");
    const pakketSelect = pakketten.querySelector("select");
    const pakketBeschrijving = pakketten.querySelector(".details");
    const pakketTotaal = pakketten.querySelector(".totaal");
    const resR = document.querySelector("#switchTotal input:checked");

    pakketSelect.onchange = () => {
        const resType = getResType();
        let option = pakketSelect.options[pakketSelect.selectedIndex].text;
        let pakket = _packets.filter(p => p.naam == option)[0];
        if(pakket == undefined) pakket = {detail: "", punten: ""};
        pakketBeschrijving.innerHTML = pakket.detail;

        if(pakket.punten != ""){
            let price = pakket.punten;
            if(resR.value == "E") price *= _globals.punt_euro_rate;
            pakketTotaal.innerHTML = fixedPrice(price, resType);
        }
        else pakketTotaal.innerHTML = ""; 
        calculateTotal();
    }
}

function setActiviteitenResult(){
    const activiteiten = document.querySelector("#activiteiten");
    const acts = activiteiten.querySelector("input");
    const actTotaal = activiteiten.querySelector(".totaal");
    const resR = document.querySelector("#switchTotal input:checked");

    acts.onchange = () => {
        const resType = getResType();
        if(acts.checked){
            let price = _globals.activiteiten_ontmoeting;
            if(resR.value == "E") price *= _globals.punt_euro_rate;
            actTotaal.innerHTML = fixedPrice(price, resType); 
        }
        else actTotaal.innerHTML = ""; 
        calculateTotal();
    }
}

function setBesteedbaarResult(){
    const besteedbaar = document.querySelector("#besteedbaarDeel");
    const besteedInput = besteedbaar.querySelector("input");
    const besteedPunten = besteedbaar.querySelector(".totaal");
    const resR = document.querySelector("#switchTotal input:checked");

    besteedInput.onchange = () => {
        const resType = getResType();
        let prijs = eval(`${besteedInput.value}+0`);
        if(prijs > 0){
            if(resR.value == "P") prijs /= _globals.besteedbaar_rate;
            besteedPunten.innerHTML = fixedPrice(prijs, resType)
        }
        else besteedPunten.innerHTML = ""; 
        calculateTotal();
    }
}

//zet de behaviour voor alle inputvelden van ondersteuningen
function setSuppRowBehaviour(){
    const ondersteuningen = document.querySelectorAll("#ondersteuningen>div:not(.header)");

    ondersteuningen.forEach(o => {
        o.querySelector("input").onchange = () => {
            const input = o.querySelector("input");
            const inpVal = eval(input.value);
            const id = input.parentElement.id;
            const eenheid = input.getAttribute("eenheid");
            const resR = document.querySelector("#switchTotal input:checked").value;
            const woon = document.querySelector("#woon input");
            const dag = document.querySelector("#dag input");
            const dagZonderWoon = (id == "dag" && woon.value == "");

            //dag ondersteuning exception
            const maxId = dagZonderWoon  ? "dagZonderWoon" : id;

            const max = _globals.max[maxId];

            if(inpVal <= max){

                let dagException = dagZonderWoon ? inpVal*220/260  : inpVal;

                let price = getPrice(inpVal, id);
                if(resR == "E") price *= _globals.punt_euro_rate;
                

                o.querySelector(".minmax").innerHTML = `${getMinMaxOndersteuning(dagException, id!="psycho")} ${eenheid} totaal`;
                o.querySelector(".totaal").innerHTML = getTotaalPeriod(price, resR);
            } else {
                o.querySelector(".minmax").innerHTML = "";
                o.querySelector(".totaal").innerHTML = "";
            }
            
            if(id == "woon") dag.onchange();
            calculateTotal();
        };
    });
}

module.exports = {
    setResultBehaviours : function(){
        setPakketResult();
        setActiviteitenResult();
        setBesteedbaarResult();
        setSuppRowBehaviour();
    }
}