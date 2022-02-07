import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface attribute {
  parent: string;
  child: string[];
}

export default function IndeterminateCheckbox(prop: attribute) {
  const [checked, setChecked] = React.useState(
    new Array(prop.child.length).fill(true)
  );

  const handleChangeParent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(checked.map((_) => event.target.checked));
  };

  const handleChangeChild =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(
        checked.map((_, ind) => (ind == index ? event.target.checked : _))
      );
    };

  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
      {prop.child.map((name, ind) => (
        <FormControlLabel
          label={name}
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
        label={prop.parent}
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
  parent: "Parent",
  child: ["Child 1", "Child 2"],
};
