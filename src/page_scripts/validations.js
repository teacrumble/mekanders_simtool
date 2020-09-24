function checkDates_start_lt_end(){
    const start = document.getElementById("startDt").value;
    const end = document.getElementById("endDt").value;

    if(start > end) lblError.value = "De startdatum mag niet na de einddatum komen"
    else lblError.value = "";
}

function checkCategory_exists(){
    const bValue = document.getElementById("bValue").value;
    const pValue = document.getElementById("pValue").value;
    const selected_category = `B${bValue}/P${pValue}`;
    if ( bValue != "" && pValue != "" && _categories.indexOf(selected_category) == -1){
        lblError.value = `${selected_category} is geen mogelijke optie`;
    }
    else{
        lblError.value = "";
    }
}

function checkOndersteuning_limit(input, max){
    input.value = cleanTxt(input.value);
    const lblError = input.nextElementSibling;
    if( input.value != "" && eval(input.value) > max) lblError.textContent = `!! De max grootte is: ${max}`;
    else lblError.textContent = "";
}

function checkOndersteuning_limit_dag(){
    const dag = document.querySelector("#dag input");
    const woon = document.querySelector("#woon input");

    woon.value == "" ?  checkOndersteuning_limit(dag, _globals.max.dagZonderWoon) : 
                        checkOndersteuning_limit(dag, _globals.max.dag);
}

module.exports = {
    setOndersteuning_limits: function(){
        const dag = document.querySelector("#dag input");
        const woon = document.querySelector("#woon input");
        const psycho = document.querySelector("#psycho input");
    
        dag.addEventListener("change", () => checkOndersteuning_limit_dag());
        woon.addEventListener("change", () => {
            checkOndersteuning_limit(woon, _globals.max.woon);
            checkOndersteuning_limit_dag();
        });
        psycho.addEventListener("change", () => checkOndersteuning_limit(psycho, _globals.max.psycho));
    }
}

