import React, { ChangeEventHandler, FC, InputHTMLAttributes, useMemo, useState } from 'react';

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
    let { defaultChecked, onChange, checked, ...prop_ } = prop;
    prop_.child = prop_.child.map((prop) => {
      let { defaultChecked, onChange, checked, ...prop_ } = prop;
      return prop_;
    });
    return prop_;
  }, [prop]);

  return (
    <>
      <label>{prop.name ?? ''}</label>
      <input
        type={'checkbox'}
        checked={checked.every((_) => _)}
        // indeterminate={checked.some((_) => _) && checked.some((_) => !_)}
        onChange={handleChangeParent}
        {...prop_}
      />
      <div>
        {prop.child.map((prop, ind) => (
          <React.Fragment key={ind}>
            <label>{prop.name ?? ''}</label>
            <input
              type={'checkbox'}
              checked={checked[ind]}
              onChange={handleChangeChild(ind)}
              {...prop_.child[ind]}
            />
          </React.Fragment>
        ))}
      </div>
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
