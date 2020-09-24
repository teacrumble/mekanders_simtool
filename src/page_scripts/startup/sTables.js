//calculate columns DAG WOON
function calColumn(basis, inc, index){
    const wm = _globals.weekend_modifier;
    const week = basis + (Math.min(index, 4) * inc)
    const weekend = wm * (Math.max(0, index-4) * inc);

    return fixedPrice(week + weekend);
}

//calculate rows DAG WOON
function calRow(basis, inc, index=0){
    const col = calColumn(basis, inc, index);
    if(index == 6) return [col]
    else return [col].concat(calRow(basis, inc, index+1));
}

function header(cols, unit){
    if(cols == 0) return ["Beschrijving"]
    return header(cols-1, unit).concat([`${cols} ${unit}${cols > 1 ? "en" : ""}`]);
}


module.exports = {
    setTables : function(){
        _dag.rows = [];
        _woon.rows = [];
        //dag en woon
        _categories.forEach(cat => {
            cat.cat_ids.forEach(id => {
                let info = cat.cat_info;
                _dag.header = header(7, "Dag");
                _woon.header = header(7, "Nacht");
                _dag.rows.push([id].concat(calRow(info.dag_basis, info.dag_inc)));
                _woon.rows.push([id].concat(calRow(info.woon_basis, info.woon_inc)));
            })
        });

        //BP
    }
}