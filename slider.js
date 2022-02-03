export class PairedSlider{
    constructor(){
        this.slider = document.createElement("input");
        this.slider.type = "range";
        this.slider.name = "slider";
        this.number = document.createElement("input");
        this.number.type = "number";
        this.number.name = "number";
        this.div = document.createElement("div");
        this.div.appendChild(this.slider);
        this.div.appendChild(this.number);
        let pairedSlider = this;
        this.slider.onchange = function(){
           pairedSlider.value = pairedSlider.slider.value;
        }
        this.number.onchange = function(){
           pairedSlider.value = pairedSlider.number.value;
        }
        this.changed = true;
        this.value_ = this.value;
    }
    get value(){
        return this.slider.value;
    }
    set value(value){
        this.slider.value = value;
        this.number.value = this.value;
    }
    get max(){
        return this.slider.max;
    }
    set max(value){
        this.slider.max = value;
        this.number.max = this.max;
    }
    get min(){
        return this.slider.min;
    }
    set min(value){
        this.slider.min = value;
        this.number.min = this.min;
    }
    get step(){
        return this.slider.step;
    }
    set step(value){
        if (value!=0) {
            this.slider.step = value;
            this.number.step = this.step;
        } else {
            this.slider.step = 1e-18;
        }
    }
    setAttribute(qualifiedName, value){
        this.slider.setAttribute(qualifiedName, value);
    }
    getAttribute(qualifiedName){
        this.slider.getAttribute(qualifiedName);
    }
    refresh() {
        this.changed = (this.value != this.value_);
        this.value_ = this.value;
    }
}