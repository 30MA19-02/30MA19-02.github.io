import { ChangeEventHandler, FC, Fragment, InputHTMLAttributes, useState } from 'react';

interface property extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  child: InputHTMLAttributes<HTMLInputElement>[];
}
const IndeterminateCheckbox: FC<property> = (prop) => {
  const [checked, setChecked] = useState(prop.child.map((_) => (_.checked ? _.checked : false)));

  const handleChangeParent: ChangeEventHandler<HTMLInputElement> = (event) => {
    setChecked(checked.map((_) => event.target.checked));
    prop.onChange?.call(undefined, event);
  };

  const handleChangeChild: (index: number) => ChangeEventHandler<HTMLInputElement> = (index) => (event) => {
    setChecked(checked.map((_, ind) => (ind === index ? event.target.checked : _)));
    if (prop.child[index].onChange) {
      prop.child[index].onChange!(event);
    }
  };

  const children = (
    <>
      {prop.child.map((prop_, ind) => (
        <Fragment key={ind}>
          <label>{prop_.name ? prop_.name : ''}</label>
          <input type={'checkbox'} checked={checked[ind]} onChange={handleChangeChild(ind)} />
        </Fragment>
      ))}
    </>
  );

  return (
    <>
      <label>{prop.name ? prop.name : ''}</label>
      <input
        type={'checkbox'}
        checked={checked.every((_) => _)}
        // indeterminate={checked.some((_) => _) && checked.some((_) => !_)}
        onChange={handleChangeParent}
      />
      <br />
      {children}
    </>
  );
};

IndeterminateCheckbox.defaultProps = {
  name: 'Parent',
  child: [
    {
      name: 'Child 1',
      checked: true,
    },
    {
      name: 'Child 2',
      checked: false,
    },
  ],
};

export default IndeterminateCheckbox;
