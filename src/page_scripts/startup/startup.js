'use strict';
import { loadCosts } from "./page_scripts/startup/costs";
import { read_all } from "./page_scripts/startup/ioJson";
import { setBehaviours } from "./page_scripts/behaviour/behaviour";
import { setOndersteuning_limits } from "./page_scripts/validations";
import { setTables } from "./page_scripts/startup/sTables";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

class Tab{
    constructor(dag="", woon="", psycho="", pakket="", act=false, besteedbaar=""){
        this.dag = dag;
        this.woon = woon;
        this.psycho = psycho;
        this.pakket = pakket;
        this.act = act;
        this.besteedbaar = besteedbaar;
    }
}

var _categories = [];
var _globals;
var _packets = [];

var _bp;
var _dag = {header: [], rows: []};
var _woon = {header: [], rows: []};;

var _tabs = [new Tab(), new Tab(), new Tab(), new Tab()];
var _tabIndex = 0;

var _printPreview;
var _printPreview2;
var _resetT;

//zorgt dat data enkel van het huidige jaar tot 4 jaar later kan bekijken
function setDateMinMax(query){
    const inputs = document.querySelectorAll(query);

    inputs.forEach(input => {
        const current = new Date();
        input.min = `${current.getFullYear()}-01-01`;
        input.max = `${current.getFullYear()+4}-12-31`;
    });
}

//laad de pagina en voert alle nodige functies uit voor de site
function loadPage(){
    //form
    read_all();
    loadCosts();
    setDateMinMax("input[type=date]");

    setOndersteuning_limits();

    setTables();

    setBehaviours();
}