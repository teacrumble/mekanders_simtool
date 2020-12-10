class MinMax {
    constructor(total, extension) {
        this.total = Math.round(total);
        this.min = Math.ceil(total * 0.9);
        this.max = Math.ceil(total * 1.05);
        this.extension = extension;
    }

    changeMax(altMax) {
        if (altMax < this.max) this.max = altMax;
        return (altMax < this.max);
    }

    show() {
        return ` (Min. ${this.min} - Max. ${this.max}) `;
    }

}

class Category {
    constructor(dag_basis, dag_inc, woon_basis, woon_inc, weekend_mod) {
        this.dag_basis = dag_basis;
        this.dag_inc = dag_inc;
        this.woon_basis = woon_basis;
        this.woon_inc = woon_inc;
        this.weekend_mod = weekend_mod;
    }

    GetWeeklyCost(weekDays, baseV, incV) {
        if (weekDays <= 1) return weekDays * baseV;
        if (weekDays <= 5) return baseV + (incV * (weekDays - 1));
        return baseV + (incV * 4) + (incV * (weekDays - 5) * this.weekend_mod);
    }

    getWeeklyCostDay(weekDays) {
        return this.GetWeeklyCost(weekDays, this.dag_basis, this.dag_inc);
    }

    getWeeklyCostLiving(weekDays) {
        return this.GetWeeklyCost(weekDays, this.woon_basis, this.woon_inc);
    }
}