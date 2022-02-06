export class Checkbox{
    constructor(){
        this.checkbox = document.createElement("input");
        this.checkbox.type = "checkbox";
        this.checkbox.name = "checkbox";
        this.div = document.createElement("div");
        this.label = document.createElement("label");
        this.div.appendChild(this.label);
        this.div.appendChild(this.checkbox);
        this.checkbox.onchange = (() => {
            this.changed = true;
        }).bind(this);
        this.changed = true;
        this.value_ = this.value;
    }
    get labelText() {
        return this.label.textContent;
    }
    set labelText(text) {
        this.label.textContent = text;
    }
    get value() {
        return this.checkbox.checked;
    }
    set value(value) {
        this.checkbox.checked = value;
    }
    refresh() {
        this.changed = (this.value != this.value_);
        this.value_ = this.value;
    }
}