class MySlider {
  constructor(min, max, value, step, x, y, label='') {

    this.label = createP(label).position(x, y - 15);
    this.slider = createSlider(min, max, value, step).position(x + 80, y).style('width', '120px');
    this.textBox = createInput('').position(x + 210, y).size(50).value(this.value());
    this.last_value = this.value();
    this.changed = true;
  }
  update() {
    if(this.value() == this.last_value){
      if(this.textBox.value() == this.value()){
        this.changed = false;
        return;
      }else{
        this.textboxChange();
      }
    }else{
      this.sliderChange();
    }
    this.changed = true;
    this.last_value = this.value();
  }
  value() {
    return this.slider.value();
  }
  sliderChange() {
    this.textBox.value(this.slider.value());
  }
  textboxChange() {
    this.slider.value(this.textBox.value());
  }
}
