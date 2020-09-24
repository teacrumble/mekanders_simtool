import jsPDF from "jspdf";
import "../../bootstrap/scripts/html2canvas";
import html2canvas from "../../bootstrap/scripts/html2canvas";
import {ipcRenderer} from "electron";

//laden van een tablad
function loadTab(){
    const tab = _tabs[_tabIndex];
    if(tab){
        document.querySelector("#dag input").value = tab.dag;
        document.querySelector("#woon input").value = tab.woon;
        document.querySelector("#psycho input").value = tab.psycho;
        document.querySelector(".pakket select").value = tab.pakket;
        document.querySelector(".actBox input").checked = tab.act;
        document.querySelector(".besteedbaar input").value = tab.besteedbaar;

        updateResults();
        const prices = document.getElementById("prices");
        const selected = document.querySelector(".selected");
        const options = document.querySelectorAll("option");        
        prices.classList.add(selected.classList[1]);
        options.forEach(o => o.classList.add(selected.classList[1]));
    }
}

//opslaan van de huidige tabladstatus
function savetab(){
    const dag = document.querySelector("#dag input").value;
    const woon = document.querySelector("#woon input").value;
    const psycho = document.querySelector("#psycho input").value;
    const pakket = document.querySelector(".pakket select").value;
    const besteedbaar = document.querySelector(".besteedbaar input").value;
    const act = document.querySelector(".actBox input").checked;

    _tabs[_tabIndex] = new Tab(dag, woon, psycho, pakket, act, besteedbaar);
    
    const prices = document.getElementById("prices");
    prices.classList.remove(prices.classList[0]);

    const options = document.querySelectorAll("option");        
    options.forEach(o => o.classList.remove(o.classList[0]));
}

function openTab() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(t => t.onclick = () => {
        //set functions
        const hideDiv = name => document.querySelector(`#${name}`).setAttribute("hidden", "");
        const showDiv = name => document.querySelector(`#${name}`).removeAttribute("hidden");

        //set selected
        tabs.forEach(tab => tab.classList.remove("selected"));
        t.classList.add("selected");

        //preprocessing old index
        let oldT = _tabIndex;
        if (oldT <= 3) savetab();
        else if (oldT == 4) hideDiv("overviews");

        //new Index
        _tabIndex = t.getAttribute("index");
        if (_tabIndex <= 3) {
            showDiv("prices");
            loadTab();
        }
        else if(_tabIndex == 4){
            hideDiv("prices");
            showDiv("overviews");
        }
        else if (_tabIndex == 5){
            _resetT = oldT;
            showPreview();
        }
    });

    loadTab();
}

// PRINT PREVIEW
//==========================================================================
function formatDate(num){
    return `0${num}`.slice(-2);
}

function getFileNameDefault(){
    const name = document.querySelector(".mainInfo #txtName").value;
    const nameString =  name!=""?name.replace(" ", "_") : "Sim_result";

    const today = new Date();
    const dateString = formatDate(today.getDate()) + formatDate(today.getMonth()+1) 
                     + formatDate(today.getFullYear());

    return `${nameString}_${dateString}`;
}


function printPreviewBehaviour(resV){
    //voeg behaviour toe voor de buttons
    document.querySelector("#cancel").onclick = () => document.body.removeChild(resV);
    document.querySelector("#download").onclick = () => {
        let pdf = new jsPDF({unit:"px"});
        const today = new Date();

        //first
        const previewW = _printPreview.width;
        const previewH = _printPreview.height;
        const imageData = _printPreview.toDataURL("image/jpeg");
        const pdfW = pdf.internal.pageSize.getWidth();        
        let ratio = pdfW / previewW;
        pdf.setFontSize(12);

        pdf.addImage(imageData, 'JPEG', 20, 20, previewW * ratio-40, previewH * ratio);
        const dateString = `${formatDate(today.getDate())}/${formatDate(today.getMonth()+1)}/${formatDate(today.getFullYear())}`;
        pdf.text(`Dit is een voorstel op basis van de VAPH-regelgeving op datum van ${dateString}.`, 20, (previewH * ratio)+40);

        //second
        if(_printPreview2 != undefined){
            pdf.addPage();
            const previewW2 = _printPreview2.width;
            const previewH2 = _printPreview2.height;
            const imageData2 = _printPreview2.toDataURL("image/jpeg");
            let ratio2 = pdfW / previewW2;
            pdf.addImage(imageData2, 'JPEG', 20, 20, previewW2 * ratio2-40, previewH2 * ratio2);
            pdf.text(`Dit is een voorstel op basis van de VAPH-regelgeving op datum van ${dateString}.`, 20, (previewH2 * ratio2)+40);
        }

        
        var data = pdf.output('arraybuffer');
        ipcRenderer.send("download", {
            data: new Uint8Array(data),
            filename: getFileNameDefault()
        });
        document.body.removeChild(resV);
    }
}


function convertToCanvas(cont1, cont2){
    const positioning = document.createElement("div");

    html2canvas(cont1).then(preview => {
        positioning.appendChild(preview);

        if(cont2.innerHTML != "") html2canvas(cont2).then(pre2 => {
            positioning.appendChild(pre2);
            _printPreview2 = pre2;
            document.body.removeChild(cont2);
        });
        
        _printPreview = preview;
        document.body.removeChild(cont1);
        positioning.classList.add("positioningP");
    })
    
    return positioning;
}

function copyTab(cont, index){
    document.querySelector(`.costs .tab[index="${index}"]`).onclick();
    const cost = document.querySelector(".costs").cloneNode(true);
    cost.querySelector("#others").setAttribute("hidden", "");

    cont.appendChild(cost);
    cont.lastElementChild.classList.remove("container");
    cont.lastElementChild.classList.add("printable");
}

function showPreview(){
    //reset values
    _printPreview = undefined;
    _printPreview2 = undefined;

    //create containers
    const resView = document.createElement("div");
    const createPrintable = () => {
        let cont = document.createElement("div");
        cont.style.width = "1050px";
        cont.classList.add("printable");
        return cont;
    }; 

    const container = createPrintable();
    const container2 = createPrintable();

    //neem de main div en plaats deze vanboven
    container.appendChild(document.querySelector(".mainInfo").parentNode.cloneNode(true));
    container.lastElementChild.classList.remove("container");
    container.lastElementChild.classList.add("printable");

    //itereer door elke tab en kopieer enkel degenen waar data in staat
    let usedCount = 0;
    const str = t => JSON.stringify(t);
    for(let i = 0; i<4; i++){
        if(str(_tabs[i]) !== str(new Tab())){
            let cont = usedCount < 2 ? container : container2;
            copyTab(cont, i);
            usedCount++;
            cont.querySelectorAll("input[type='radio']").forEach(el => el.name+="P");
        }
    }

    //voeg buttons toe
    const buttons = document.createElement("div");
    buttons.classList.add("buttonsP");
    buttons.innerHTML = `<input type="button" value="&#128427;" id="download"> <input type="button" value="&#128473;" id="cancel">`;
    resView.appendChild(buttons);

    //reset index
    document.querySelector(`.costs .tab[index="${_resetT}"]`).onclick();

    //preview naar canvas
    document.body.appendChild(container);
    document.body.appendChild(container2)

    const pos = convertToCanvas(container, container2);
    resView.appendChild(pos);
    resView.classList.add("resView");
    document.body.appendChild(resView);
    printPreviewBehaviour(resView);
}

module.exports = {
openNewTab : () => openTab()
}