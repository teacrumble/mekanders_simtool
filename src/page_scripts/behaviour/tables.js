//pas ALLES aan

function createHeader(content){
    let tHeader = document.createElement("thead");
    tHeader.classList.add("row");
    content.header.map(h => {
        let tableH = document.createElement("th");
        tableH.classList.add("col");
        tableH.innerHTML = h;
        return tableH;
    }).forEach(t => tHeader.appendChild(t));
    return tHeader;
}

function makeIndivTable(){
    const tabel = document.querySelector("#overviews table");
    let makeRow = (desc, punten, prijs="") => {
        let row = document.createElement("tr");
        row.classList.add("row");
        row.innerHTML = `<td class="col-2">${desc}</td> 
                        <td class="col-3" style="text-align: right">${typeof punten === "number" ? fixedPrice(punten)+" punten" : punten}</td>
                        <td class="col-3" style="text-align: right">${prijs == "" ? fixedPrice(punten * _globals.punt_euro_rate, 2)+" €" : prijs}</td>`;
        return row;
    }

    let tHeader = document.createElement("thead");
    tHeader.classList.add("row");
    [{h:"Uren per week", w:2}, {h:"Punten per jaar", w:3}, {h:"Kostprijs per jaar", w:3}].map(hd => {
        let head = document.createElement("th");
        head.classList.add(`col-${hd.w}`);
        head.innerHTML = hd.h;
        return head;
    }).forEach(t => tHeader.appendChild(t));
    
    tabel.appendChild(tHeader);
    let som = _globals.psychosociaal.eerste;
    tabel.appendChild(makeRow("Max 1 uur", som));
    som+= _globals.psychosociaal.tweede;
    tabel.appendChild(makeRow("1 -  2 uren", som));
    for(let i = 3; i<= 12; i++){
        som+= _globals.indiv.tien;
        tabel.appendChild(makeRow(`${i-1} - ${i>9 ? i : " "+i} uren`, som));
    }
    tabel.appendChild(makeRow("Overige uren", `+${fixedPrice(_globals.indiv.overige)} punten per uur`, `+${fixedPrice(_globals.indiv.overige * _globals.punt_euro_rate, 2)} € per uur`));
    
}

function loadTable(){
    const radios = document.getElementsByName("tabelR");

    radios.forEach(r => r.onchange = () => {
        const tabel = document.querySelector("#overviews table");
        tabel.innerHTML = "";

        if(r.value == "dag" || r.value == "woon"){
            const tableContent = r.value == "dag" ? _dag : _woon;
            tabel.appendChild(createHeader(tableContent));
            
            tableContent.rows.forEach(r => {
                let row = document.createElement("tr");
                row.classList.add("row");
                if(r[0] == getCategory()) row.classList.add("selected");
                row.innerHTML = r.map(c => `<td class="col">${c}</td>`).reduce((c1,c2) => c1+c2);
                tabel.appendChild(row);
            })
        }
        else if(r.value == "indiv"){
            makeIndivTable();
        }
        else if(r.value == "Bwaarden"){
            const tabel = document.querySelector("#overviews table");
            let header = document.createElement("thead");
            header.classList.add("row");
            [["B-waarden", 2], ["Beschrijving", 10]].forEach(t => {
                let thd = document.createElement("th");
                thd.innerText = t[0];
                thd.classList.add(`col-${t[1]}`);
                header.append(thd);
            });
            tabel.append(header);

            _bp.Begeleidingsintensiteit.forEach(b => {
                let row = document.createElement("tr");
                row.classList.add("row");
                row.innerHTML = `<td class="col-2">${b.waarde}</td> <td class="col-10">${b.uitleg}</td>`;
                tabel.append(row);
            })

        }
        else if(r.value == "Pwaarden"){
            const tabel = document.querySelector("#overviews table");
            let header = document.createElement("thead");
            header.classList.add("row");
            [["B-waarden", 2], ["Beschrijving", 10]].forEach(t => {
                let thd = document.createElement("th");
                thd.innerText = t[0];
                thd.classList.add(`col-${t[1]}`);
                header.append(thd);
            });
            tabel.append(header);

            _bp.Permanentienood.forEach(b => {
                let row = document.createElement("tr");
                row.classList.add("row");
                row.innerHTML = `<td class="col-2">${b.waarde}</td> <td class="col-10">${b.vorm}</td>`;
                tabel.append(row);
            })
        }
    })
}

module.exports = {
    setTableBehaviour : function(){
        loadTable();
        document.getElementsByName("tabelR")[0].onchange();
    }
}