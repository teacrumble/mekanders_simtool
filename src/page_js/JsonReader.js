/**
 * Copyright 2020 Dries Rascar

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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