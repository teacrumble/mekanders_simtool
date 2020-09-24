'use strict';
const fs = require('fs');
const path = require('path');

//add field
function add_field(beschrijving, field){
    const row = document.createElement("div");
    row.classList.add("row");
    row.innerHTML = 
    `<div class="col-7 beschrijving">${beschrijving}</div>
        <div class="col-5">
            ${field}
        </div>`;

    let form = document.getElementById("form");
    form.appendChild(row);
}

//add specific types
function add_text(beschrijving, id, label){
    const field = `<input id="${id}" type="text" placeholder="${label}">`
    add_field(beschrijving, field);
}

function add_select(beschrijving, id){
    const field = `<select id="${id}"></select>`;
    add_field(beschrijving, field);
}

function add_checkbox(beschrijving, id){
    const row = document.createElement("div");
    row.classList.add("row");
    row.innerHTML = 
    `<input id="${id}" type="checkbox" hidden>
    <label for="${id}" class="beschrijving">${beschrijving}</label>`;

    let form = document.getElementById("form");
    form.appendChild(row);
}


//generate fields
function generate_fields(){
    add_text("dag-ondersteuning", "dag", "dagen");
    add_text("woon-ondersteuning", "woon", "nachten");
    add_text("psychosociale ondersteuning", "psy", "uren");
    add_text("globale individuele ondersteuning", "global", "uren");
    add_select("begeleid werken pakket", "pakketten");
    add_checkbox("activiteiten + ontmoetingsruimte", "act");
}


//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------


function add_option(name, description){
    const option = document.createElement("option");
    option.value = name;
    option.innerHTML = description;
    const select = document.getElementById("pakketten");
    select.appendChild(option);
}

function vul_pakketten_opties(){
    let rawdata = fs.readFileSync(path.join(__dirname,'/assets/json_data/pakketten.json'));
    let pakketten = JSON.parse(rawdata);
    add_option(null, "");
    pakketten.forEach(element => {
        add_option(element.naam, element.beschrijving);
    });
}


//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------


function setupSim(){
    generate_fields();
    vul_pakketten_opties();
    let inputs = document.querySelectorAll("input:not(#naam), select");
    inputs.forEach(i => i.addEventListener("change", e => makeReceipt() ));
    unlockFields();
}