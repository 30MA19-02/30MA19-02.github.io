import { ChangeEventHandler, FC, InputHTMLAttributes, useState } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface property extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  child: InputHTMLAttributes<HTMLInputElement>[];
}
const IndeterminateCheckbox:FC<property> = (prop) => {
  const [checked, setChecked] = useState(
    prop.child.map(_=>_.checked? _.checked:false)
  );

  const handleChangeParent: ChangeEventHandler<HTMLInputElement> = (event) => {
    setChecked(checked.map((_) => event.target.checked));
    if(prop.onChange){prop.onChange(event)};
  };

  const handleChangeChild: ((index: number) => ChangeEventHandler<HTMLInputElement>) =
    (index) => (event) => {
      setChecked(
        checked.map((_, ind) => (ind === index ? event.target.checked : _))
      );
      if(prop.child[index].onChange){prop.child[index].onChange!(event)};
    };

  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
      {prop.child.map((prop_, ind) => (
        <FormControlLabel
          label={prop_.name? prop_.name: ""}
          key={ind}
          control={
            <Checkbox
              checked={checked[ind]}
              onChange={handleChangeChild(ind)}
            />
          }
        />
      ))}
    </Box>
  );

  return (
    <div>
      <FormControlLabel
        label={prop.name? prop.name: ""}
        control={
          <Checkbox
            checked={checked.every((_) => _)}
            indeterminate={checked.some((_) => _) && checked.some((_) => !_)}
            onChange={handleChangeParent}
          />
        }
      />
      {children}
    </div>
  );
}

IndeterminateCheckbox.defaultProps = {
  name: "Parent",
  child: [
    {
      name: "Child 1",
      checked: true,
    },
    {
      name: "Child 2",
      checked: false,
    },
  ],
};


export default IndeterminateCheckbox;