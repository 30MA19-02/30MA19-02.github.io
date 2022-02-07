import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";

const Input = styled(MuiInput)`
  width: 42px;
`;

interface attribute {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export default function InputSlider(prop: attribute) {
  const [value, setValue] = React.useState<number>(prop.value);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "object") return;
    setValue(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "") {
      setValue(parseFloat(event.target.value));
    }
  };

  const handleBlur = () => {
    if (value < prop.min) {
      setValue(prop.min);
    } else if (value > prop.max) {
      setValue(prop.max);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        {prop.name}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            min={prop.min}
            max={prop.max}
            step={prop.step}
            value={value}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: prop.step,
              min: prop.min,
              max: prop.max,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

InputSlider.defaultProps = { name: "", value: 30, min: 0, max: 100, step: 1 };
