class MySlider {
  constructor(min, max, value, x, y) {
    this.slider = createSlider(min, max, value).position(x + 60, y).style('width', '120px');
    this.textBox = createInput('').position(x,y).size(50).value(this.slider.value());
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
