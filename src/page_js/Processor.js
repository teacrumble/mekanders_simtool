import {ipcRenderer} from "electron";
const { jsPDF } = window.jspdf;

class Processor {
    constructor(tabMgr) {
        this.tabMgr = tabMgr;
        this.pp1 = undefined;
        this.pp2 = undefined;
    }

    formatDate(num) {
        return `0${num}`.slice(-2);
    }

    getFileNameDefault() {
        const name = document.querySelector(".mainInfo #txtName").value;
        const nameString = name != "" ? name.replace(" ", "_") : "Sim_result";

        const today = new Date();
        const dateString = this.formatDate(today.getDate())
            + this.formatDate(today.getMonth() + 1)
            + this.formatDate(today.getFullYear());

        return `${nameString}_${dateString}.pdf`;
    }

    getPdf() {
        let pdf = new jsPDF({ unit: "px" });
        const today = new Date();
        const dateString = `${this.formatDate(today.getDate())}/${this.formatDate(today.getMonth() + 1)}/${this.formatDate(today.getFullYear())}`;
        pdf.setFontSize(12);

        //first
        const previewW = this.pp1.width;
        const previewH = this.pp1.height;
        const imageData = this.pp1.toDataURL("image/jpeg");
        const pdfW = pdf.internal.pageSize.getWidth();
        let ratio = pdfW / previewW;
        pdf.addImage(imageData, 'JPEG', 20, 20, previewW * ratio - 40, previewH * ratio);
        pdf.text(`Dit is een voorstel op basis van de VAPH-regelgeving op datum van ${dateString}.`, 20, (previewH * ratio) + 40);

        //second
        if (this.pp2 != undefined) {
            pdf.addPage();
            const previewW2 = this.pp2.width;
            const previewH2 = this.pp2.height;
            const imageData2 = this.pp2.toDataURL("image/jpeg");
            let ratio2 = pdfW / previewW2;
            pdf.addImage(imageData2, 'JPEG', 20, 20, previewW2 * ratio2 - 40, previewH2 * ratio2);
            pdf.text(`Dit is een voorstel op basis van de VAPH-regelgeving op datum van ${dateString}.`, 20, (previewH2 * ratio2) + 40);
        }

        const name = this.getFileNameDefault();
        var data = new Uint8Array(pdf.output('arraybuffer'));
        return { data: data, filename: name };
    }

    printPreviewBehaviour(resV) {
        document.querySelector("#btnCancel").onclick = () => document.body.removeChild(resV);
        document.querySelector("#btnDownload").onclick = () => {
            const pdf = this.getPdf();
            ipcRenderer.send("download", pdf);
            document.body.removeChild(resV);
        }
    }


    convertToCanvas(cont1, cont2) {
        const positioning = document.createElement("div");
        return html2canvas(cont1).then(preview => {
            positioning.appendChild(preview);
            this.pp1 = preview;
            document.body.removeChild(cont1);
            positioning.classList.add("positioningP");

        }).then(() => {
            if (cont2.innerHTML != "") {
                return html2canvas(cont2).then(pre2 => {
                    positioning.appendChild(pre2);
                    this.pp2 = pre2;
                    document.body.removeChild(cont2);
                    return positioning;
                });
            }
            return positioning;
        });
    }

    copyTab(cont, index, resultType) {
        document.querySelector(`.costs .tab[index="${index}"]`).dispatchEvent(new Event("click"));
        resultType.dispatchEvent(new Event("click"));
        const cost = document.querySelector(".costs").cloneNode(true);
        cost.querySelector("#others").setAttribute("hidden", "");
        const selectedOption = Array.from(document.querySelectorAll(`.costs select option`)).filter(x => x.selected)[0];
        Array.from(cost.querySelectorAll(`.costs select option`)).filter(x => x.value == selectedOption.value)[0].selected = true;

        cont.appendChild(cost);
        cont.lastElementChild.classList.remove("container");
        cont.lastElementChild.classList.add("printable");
    }

    getPreview() {
        const resView = document.createElement("div");

        //create containers
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

        const reset = this.tabMgr.tabIndex;

        //itereer door elke tab en kopieer enkel degenen waar data in staat
        const resultType = document.querySelector("#prices #switchTotal input:checked");
        let usedCount = 0;
        const str = t => JSON.stringify(t);
        for (let i = 0; i < 4; i++) {
            if (str(this.tabMgr.tabs[i]) !== str(new Tab())) {
                let cont = usedCount < 2 ? container : container2;
                this.copyTab(cont, i, resultType);
                usedCount++;
                cont.querySelectorAll("input[type='radio']").forEach(el => el.name += "P");
            }
        }

        //voeg buttons toe
        const buttons = document.createElement("div");
        buttons.classList.add("buttonsP");
        buttons.innerHTML = `<input type="button" value="&#128427;" id="btnDownload"> <input type="button" value="&#128473;" id="btnCancel">`;
        resView.appendChild(buttons);

        //reset index
        document.querySelector(`.costs .tab[index="${reset}"]`).dispatchEvent(new Event("click"));

        //preview naar canvas
        document.body.appendChild(container);
        document.body.appendChild(container2)

        this.convertToCanvas(container, container2).then(pos => {
            resView.appendChild(pos);
            resView.classList.add("resView");
            document.body.appendChild(resView);
        }).then(() => this.printPreviewBehaviour(resView));
        
    }
}
