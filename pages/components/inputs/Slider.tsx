import { ChangeEventHandler, FC, InputHTMLAttributes, useMemo, useState } from 'react';
import { Flex, Input, Label, Slider } from 'theme-ui';

interface property extends InputHTMLAttributes<HTMLInputElement> {
  defaultValue: number;
  min: number;
  max: number;
  step: number;
}

const InputSlider: FC<property> = (prop) => {
  const [value, setValue] = useState<number>(prop.defaultValue);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.value === '') event.target.value = value.toString();
    prop.onChange?.(event);
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

  const prop_ = useMemo(() => {
    let { type, defaultValue, step, value, onChange, ...prop_ } = prop;
    return prop_;
  }, [prop]);

  return (
    <>
      <Label>{prop.name}</Label>
      <Flex mb={2}>
        <Slider value={value} onChange={onChange} step={prop.step || 1e-18} {...prop_} />
        <Input type={'number'} value={value} onChange={onChange} step={prop.step || 1e-18} {...prop_} />
      </Flex>
    </>
  );
};

InputSlider.defaultProps = { name: '', defaultValue: 30, min: 0, max: 100, step: 1 };

export default InputSlider;
