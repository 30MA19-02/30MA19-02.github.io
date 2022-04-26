import { ChangeEventHandler, FC, InputHTMLAttributes, useMemo, useState } from 'react';
import { Box, Switch } from 'theme-ui';

interface property extends InputHTMLAttributes<HTMLInputElement> {
  child: InputHTMLAttributes<HTMLInputElement>[];
}
const IndeterminateCheckbox: FC<property> = (prop) => {
  const [checked, setChecked] = useState(prop.child.map((_) => _.defaultChecked as boolean));

  const handleChangeParent: ChangeEventHandler<HTMLInputElement> = (event) => {
    setChecked((checked) => checked.map((_) => event.target.checked));
    prop.onChange?.(event);
  };

  const handleChangeChild: (index: number) => ChangeEventHandler<HTMLInputElement> = (index) => (event) => {
    setChecked((checked) => checked.map((_, ind) => (ind === index ? event.target.checked : _)));
    prop.child[index].onChange?.(event);
  };

  const prop_ = useMemo(() => {
    let { defaultValue, onChange, checked, ...prop_ } = prop;
    prop_.child = prop_.child.map((prop) => {
      let { defaultValue, onChange, checked, ...prop_ } = prop;
      return prop_;
    });
    return prop_;
  }, [prop]);

  return (
    <>
      <Switch
        label={prop.name ?? ''}
        checked={checked.every((_) => _)}
        // indeterminate={checked.some((_) => _) && checked.some((_) => !_)}
        onChange={handleChangeParent}
        {...prop_}
      />
      <Box px={40}>
        {prop.child.map((prop, ind) => (
          <Switch
            key={ind}
            label={prop.name ?? ''}
            checked={checked[ind]}
            onChange={handleChangeChild(ind)}
            {...prop_.child[ind]}
          />
        ))}
      </Box>
    </>
  );
};

IndeterminateCheckbox.defaultProps = {
  name: 'Parent',
  child: [
    {
      name: 'Child 1',
      defaultChecked: true,
    },
    {
      name: 'Child 2',
      defaultChecked: false,
    },
  ],
};

export default IndeterminateCheckbox;
