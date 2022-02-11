import { ChangeEventHandler, FC, InputHTMLAttributes, useState } from "react";

interface property extends InputHTMLAttributes<HTMLInputElement> {
  value: number;
  min: number;
  max: number;
  step: number;
}

const InputSlider: FC<property> = (prop) => {
  const [value, setValue] = useState<number>(prop.value);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (prop.onChange) {
      prop.onChange(event);
    }
    if (event.target.value !== "") {
      setValue(parseFloat(event.target.value));
      handleBlur();
    }
  };

  const handleBlur = () => {
    if (value < prop.min) {
      setValue(prop.min);
    } else if (value > prop.max) {
      setValue(prop.max);
    }
  };

  let { type: _, ...prop_ } = prop;
  prop_.value = value;
  prop_.onChange = onChange;
  if (prop_.step === 0) prop_.step = 1e-18;

  return (
    <div>
      <label>{prop.name}</label>
      <input type={"range"} {...prop_}></input>
      <input type={"number"} {...prop_}></input>
    </div>
  );
};

InputSlider.defaultProps = { name: "", value: 30, min: 0, max: 100, step: 1 };

export default InputSlider;
