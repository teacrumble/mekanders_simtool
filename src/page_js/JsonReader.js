class JsonReader {
    constructor() {
        this.categories = this.read_cat();
        this.oldCategories = this.read_cat(false);
        this.global = this.read_global();
        this.psycho = this.read_psycho();
        this.packets = this.read_pack();
        this.bValues = this.read_b();
        this.pValues = this.read_p();
        this.oldBValues = this.read_b(false);
        this.oldPValues = this.read_p(false);
        this.budgetCats = this.read_bc();
        this.currentCat = new Category(0, 0, 0, 0, 0);
    }

    to_map(obj) {
        const map = new Map();
        Object.keys(obj).forEach(k => {
            map.set(k, obj[k]);
        });
        return map;
    }

    read_cat(useNew = true) {
        return JSON.parse(FilesHandler.read_cat(useNew));
    }

    read_global() {
        return JSON.parse(FilesHandler.read_global());
    }

    read_pack() {
        return  this.to_map(JSON.parse(FilesHandler.read_pack()));
    }

    read_b(useNew = true) {
        return this.to_map(JSON.parse(FilesHandler.read_bvalues(useNew)));
    }

    read_p(useNew = true) {
        return this.to_map(JSON.parse(FilesHandler.read_pvalues(useNew)));
    }

    read_psycho() {
        return JSON.parse(FilesHandler.read_psycho());
    }

    read_bc(){
        return JSON.parse(FilesHandler.read_budgetcats());
    }

}