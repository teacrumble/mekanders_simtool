class RowCalculator {
    constructor(valutaConvert, category, psycho) {
        this.valutaRate = valutaConvert;
        this.category = category;
        this.psycho = psycho;
    }

    GetWeeklyPricePsycho(hoursPerWeek) {
        if (hoursPerWeek <= 0) return 0;
        if (hoursPerWeek < 3) return this.psycho.eerste + (this.psycho.tweede * (hoursPerWeek - 1));
        if (hoursPerWeek < 13) return this.psycho.eerste + this.psycho.tweede + (this.psycho.tien * ((hoursPerWeek - 2) % 11));
        return this.psycho.eerste + this.psycho.tweede + (this.psycho.tien * 10) + (this.psycho.overige * (hoursPerWeek - 12));
    }

    //calculate costs
    calculateCost(weeklyPrice, days, inpoints) {
        const periodPrice = (weeklyPrice / 365) * days;
        if (inpoints) return periodPrice;
        return periodPrice * this.valutaRate;
    }
    calculateCostDay(weeklyAmount, days, inpoints) {
        const weeklyPrice = this.category.getWeeklyCostDay(weeklyAmount);
        return this.calculateCost(weeklyPrice, days, inpoints);
    }
    calculateCostLiving(weeklyAmount, days, inpoints) {
        const weeklyPrice = this.category.getWeeklyCostLiving(weeklyAmount);
        return this.calculateCost(weeklyPrice, days, inpoints);
    }
    calculateCostPsycho(weeklyAmount, days, inpoints) {
        const weeklyPrice = this.GetWeeklyPricePsycho(weeklyAmount);
        return this.calculateCost(weeklyPrice, days, inpoints);
    }

    //minmax
    getMinMax(weeklyAmount, days, extension) {
        const total = (weeklyAmount / 7) * days;
        return new MinMax(total, extension);
    }
    getMinMaxDay(weeklyAmount, days, withoutLiving) {
        const newAMount = withoutLiving ? (weeklyAmount * 245) / 260 : weeklyAmount;
        const result = this.getMinMax(newAMount, days, "dagen");
        result.changeMax(days);
        return result;
    }
    getMinMaxLiving(weeklyAmount, days) {
        return this.getMinMax(weeklyAmount, days, "nachten");
    }
    getMinMaxPsycho(weeklyAmount, days) {
        const newAmount = (weeklyAmount * 44) / 52;
        return this.getMinMax(newAmount, days, "uren");
    }

    //reverse calculate
    reverseTotal(total, days){
        return ((total / days) * 7).toPrecision(4);
    }

    reverseDay(total, days, withoutLiving){
        const newAmount = withoutLiving ? (total * 260) / 245 : total;
        return this.reverseTotal(newAmount, days);
    }

    reverseWoon(total, days){
        return this.reverseTotal(total, days);
    }

    reversePsycho(total, days){
        const newAmount = (total * 52) / 44;
        return this.reverseTotal(newAmount, days);
    }
    
}