import fs from "fs";
import path from "path";

class FilesHandler {
    static read_json(file) {
        const fullPath = path.resolve("src/json/" + file);
        return fs.readFileSync(fullPath, 'utf8');
    }

    static read_psycho() {
        return this.read_json("psycho.json");
    }

    static read_cat(newValues) {
        return newValues ? this.read_json("categorie/new/categorieen.json") :
            this.read_json("categorie/transition/transitie.categorieen.json");
    }

    static read_global() {
        return this.read_json("globale_gegevens.json");
    }

    static read_pack() {
        return this.read_json("pakketten.json");
    }

    static read_bvalues(newValues) {
        return newValues ? this.read_json("categorie/new/bwaarden.json") :
            this.read_json("categorie/transition/transitie.bwaarden.json");
    }

    static read_pvalues(newValues) {
        return newValues ? this.read_json("categorie/new/pwaarden.json") :
            this.read_json("categorie/transition/transitie.pwaarden.json");
    }
}