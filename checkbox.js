export class Checkbox{
    constructor(){
        this.checkbox = document.createElement("input");
        this.checkbox.type = "checkbox";
        this.checkbox.name = "checkbox";
        this.div = document.createElement("div");
        this.div.appendChild(this.checkbox);
        let checkbox = this;
        this.checkbox.onchange = function(){
            checkbox.value = checkbox.checkbox.checked;
        }
        this.changed = true;
        this.value_ = this.value;
    }
    get text() {
        return this.text_;
    }
    set text(text) {
        this.text_ = text;
        this.div.id = text;
        this.txt = document.createTextNode(text);
        this.div.prepend(this.txt);
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