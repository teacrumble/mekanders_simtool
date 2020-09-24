//laad de pakketten van de json in de select als options
function loadPackets(){
    const select = document.querySelector(".pakket select");
    const addOption = desc => {
        const option = document.createElement("option");
        option.innerText = desc;
        select.appendChild(option);
    };

    addOption("");
    _packets.forEach(p => addOption(p.naam));
}



//maakt een HTML rij
function createRow(beschrijving, wekelijks, minmax="", totaal="", header=false){
    const template = document.getElementById("costRowTemplate");
    const ondersteuningen = document.getElementById("ondersteuningen");

    ondersteuningen.appendChild(template.content.cloneNode(true));
    let row = ondersteuningen.lastElementChild;
    row.querySelector(".beschrijving").innerHTML = beschrijving;
    row.querySelector(".wekelijks").innerHTML = wekelijks;
    row.querySelector(".minmax").innerHTML = minmax;
    row.querySelector(".totaal").innerHTML = totaal;
    if (header) row.classList.add("header");
    else row.querySelector(".wekelijks").classList.add("row");
}

//maakt HTML input row
function inputRow(beschrijving, wekelijks, id){
    const input =   
    `<div id=${id} class="col-3">
        <input eenheid="${wekelijks}" type="text">
        <label></label>
    </div>
    <div class="col-9">
        ${wekelijks} per week
    </div>`;

    createRow(beschrijving, input);
}

//maakt alle HTML rijen aan
function loadRows(){
    //createRow("Beschrijving", "Wekelijks", "Min - Max", "Totale kost", true);
    inputRow("Dagondersteuning", "dagen", "dag");
    inputRow("Woonondersteuning", "nachten", "woon");
    inputRow("Psychosociale Ondersteuning", "uren", "psycho");
}



module.exports = {
    loadCosts : function (){
        loadRows();
        loadPackets();
    }
}