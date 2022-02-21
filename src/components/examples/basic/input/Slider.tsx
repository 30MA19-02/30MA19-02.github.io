import { ChangeEventHandler, FC, Fragment, InputHTMLAttributes, useState } from 'react';

interface property extends InputHTMLAttributes<HTMLInputElement> {
  value: number;
  min: number;
  max: number;
  step: number;
}

const InputSlider: FC<property> = (prop) => {
  const [value, setValue] = useState<number>(prop.value);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.value === '') event.target.value = value.toString();
    prop.onChange?.call(undefined, event);
    setValue(parseFloat(event.target.value));
    handleBlur();
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
    <Fragment>
      <label>{prop.name}</label>
      <input type={'range'} {...prop_}></input>
      <input type={'number'} {...prop_}></input>
    </Fragment>
  );
};

InputSlider.defaultProps = { name: '', value: 30, min: 0, max: 100, step: 1 };

export default InputSlider;
