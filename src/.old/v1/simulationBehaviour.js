function unlockFields(){
    const inputFields = document.querySelectorAll("#form > .row:not(#headrow) input, select");
    let operation = i => i.setAttribute("disabled", true);
    let cat = get_cat();

    if (cat){
        operation = i => i.removeAttribute("disabled");
    }
    else{
        //maak B en P rood en toon een foutmelding (deze code kan niet gebruikt worden)
    }

    inputFields.forEach(operation);
}

function read_json(url){
    let rawdata = fs.readFileSync(path.join(__dirname, url));
    return JSON.parse(rawdata);
}

function get_cat(){
    const Bvalue = document.getElementById("Bvalue");
    const Pvalue = document.getElementById("Pvalue");
    const bp = `B${Bvalue.value}/P${Pvalue.value}`;
    let categories = read_json(`/assets/json_data/categorieen.json`);
    for(let i = 0; i<categories.length; i++){
        if(categories[i].cat_ids.indexOf(bp) > -1) return categories[i];
    }
    return null;
}

function rounded(num){
    return (Math.round(num * Math.pow(10, 6)) / Math.pow(10, 6)).toFixed(6);
}

function calculate_price(days, base, inc){
    if(days > 1) return base + (inc * (days-1)); 
    else return base * days;
}

function encapsulate(factor, effect, value){
    if(value <= 0) return "";
    
    return `<div class="receiptRow row ${effect}">
        <span class="col-8">${factor}:</span>
        <span class="col-4">${value}</span>
    </div>`;
}

function makeReceipt(){
    const clean = variable => eval(variable.toString().concat("+0").replace(/[^-()\d/*+.]/g, ''));
    const gg = read_json(`/assets/json_data/globale_gegevens.json`);
    const pakketten = read_json(`/assets/json_data/pakketten.json`);
    const cat = get_cat();

    let receipt = "";
    
    const besteedbaarPoints = clean(document.getElementById("besteedbaar").value) / gg.punt_euro_rate;
    const budgetPoints = clean(document.getElementById("budget").value) / gg.punt_euro_rate;
    const globalCount = clean(document.getElementById("global").value);
    const woonCount = clean(document.getElementById("woon").value);
    const dagCount = clean(document.getElementById("dag").value);
    const psyCount = clean(document.getElementById("psy").value);
    const pakket = document.getElementById("pakketten").value;
    const activiteiten = document.getElementById("act").checked;

    let totalDag = 0;
    let totalWoon = 0;
    if(cat){
        let info = cat.cat_info;
        totalDag =    calculate_price(dagCount, info.dag_basis, info.dag_inc);
        totalWoon =   calculate_price(woonCount, info.woon_basis, info.woon_inc);
    }

    const totalPsy =    calculate_price(psyCount, gg.psychosociaal.eerste, gg.psychosociaal.inc);

    const totalGlobal = globalCount > 0 ? globalCount <= 10 ? gg.individueel.tien : gg.individueel.tien + gg.individueel.overige : 0;

    receipt += encapsulate("Budget", "positive", rounded(budgetPoints));
    receipt += encapsulate("vrij besteedbaar deel", "negative", rounded(besteedbaarPoints));
    receipt += encapsulate("dag ondersteuning", "negative", rounded(totalDag));
    receipt += encapsulate("woon ondersteuning", "negative", rounded(totalWoon));
    receipt += encapsulate("psychosociale ondersteuning", "negative", rounded(totalPsy));
    receipt += encapsulate("globale individuele ondersteuning", "negative", rounded(totalGlobal));

    let pakketKosten = 0;
    let actKosten = 0;
    pakketten.forEach(p => {
        if(p.naam == pakket) {
            pakketKosten = rounded(p.punten);
            receipt += encapsulate(pakket, "negative", pakketKosten);
        }
    })
    if(activiteiten){
        actKosten = rounded(gg.activiteiten_ontmoeting);
        receipt += encapsulate("activiteiten + ontmoetingsruimte", "negative", actKosten);
    }
    const factors = document.getElementById("factors");
    const total = document.getElementById("total");
    factors.innerHTML = receipt;

    const receiptTotal = budgetPoints - besteedbaarPoints - totalDag - totalWoon - totalPsy - totalGlobal - pakketKosten - actKosten;

    total.innerHTML = factors.innerHTML != "" ? rounded(receiptTotal) : ""; 
    total.classList.remove("positive", "negative");
    total.classList.add(receiptTotal < 0 ? "negative" : "positive");
}