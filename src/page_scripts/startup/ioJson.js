import fs from 'fs';
import path from 'path';

function read_json(file){
    let rawdata = fs.readFileSync(path.join(__dirname, "../../assets/json_data/", file));
    return JSON.parse(rawdata);
}

function read_cat(useNew=true){
    _categories = useNew ?  read_json("categorieen.json") : 
                            read_json("transitie.categorieen.json");
}

function read_global(){
    _globals = read_json("globale_gegevens.json");
}

function read_pack(){
    _packets = read_json("pakketten.json");
}

function read_bp(useNew=true){
    _bp = useNew ?  read_json("bp_betekenissen.json") : 
                    read_json("transitie.bp_betekenissen.json");
}

module.exports = {
    read_all : function(){
        read_cat();
        read_global();
        read_pack();
        read_bp();
    },

    update_version : function(useNew){
        read_cat(useNew);
        read_bp(useNew);
    }
}