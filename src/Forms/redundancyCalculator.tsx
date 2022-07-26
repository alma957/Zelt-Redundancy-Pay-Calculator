import {useEffect, useState} from "react";
import {
  InputState,
  initialState,
  employeeRates,
  employerData,
  RatesType,
  Mapping,
} from "./variables";
import {
  Select,
  TextField,
  FormGroup,
  Paper,
  Switch,
  FormLabel,
  FormControl,
  MenuItem,
  InputLabel,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import "../App.css";
import {TypeObject} from "@mui/material/styles/createPalette";
const multiplier: mult = {
  annually: 1 / 12,
  monthly: 1,
  weekly: 52 / 12,
  daily: 365 / 12,
};
interface mult {
  annually: number;
  monthly: number;
  weekly: number;

  daily: number;
}
export const RedundancyPayCalculator = (): JSX.Element => {
  const [inputState, setInputState] = useState<InputState>(initialState);
  useEffect(() => {
    const payPeriod = inputState.payPeriod;
    const pay = inputState.pay * multiplier[payPeriod as keyof mult];
    const category = inputState.category;
    const before = inputState.validDate ? false : true;
    const employeeContr = calculateNI(pay, category, employeeRates, before);
  }, [inputState]);
  const calculateNI = (
    pay: number,
    category: string,
    rates: RatesType,
    before: boolean
  ) => {
    const data = before ? rates["before"] : rates["after"];
    let tot = 0;
    let temp = pay;
    if (temp < data[0]!.start) return 0;
    for (let i = 0; i < data.length; i++) {
      const start: number = data[i].start;
      const end: number = data[i].end;
      const taxable = Math.max(Math.min(end, pay) - start, 0);
      tot += taxable * data[i].categories[category as keyof Mapping];
    }
    return tot;
  };
  return (
    <Paper
      className="myinput"
      style={{
        width: "35%",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <FormGroup
        style={{flexDirection: "row-reverse", justifyContent: "flex-end"}}
      >
        <FormLabel>Were earnings paid before 6th July 2022?</FormLabel>
        <Switch
          onChange={e => {
            if (e.target.checked) {
              inputState.validDate = false;
            } else {
              inputState.validDate = true;
            }
            setInputState({...inputState});
          }}
          value={!inputState.validDate}
        />
      </FormGroup>{" "}
      <FormControl>
        <InputLabel>Pay period</InputLabel>
        <Select
          label="Pay period"
          value={inputState.payPeriod}
          input={<OutlinedInput label="Pay period" />}
          onChange={e => {
            inputState.payPeriod = e.target.value as string;
            setInputState({...inputState});
          }}
        >
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Enter pay"
        type="number"
        style={{marginTop: "15px"}}
        InputLabelProps={{shrink: true}}
        InputProps={{
          startAdornment: <InputAdornment position="start">£</InputAdornment>,
          inputProps: {min: 0, max: 100},
        }}
        onChange={e => {
          inputState.pay = parseFloat(e.target.value);
          setInputState({...inputState});
        }}
        value={inputState.pay}
      />
      <FormControl style={{marginTop: "15px"}}>
        <InputLabel>Select NICs Category</InputLabel>
        <Select
          inputProps={{}}
          input={<OutlinedInput label="Select NICs Category" />}
          value={inputState.category}
        >
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="C">C</MenuItem>
          <MenuItem value="F">F</MenuItem>
          <MenuItem value="H">H</MenuItem>
          <MenuItem value="I">I</MenuItem>
          <MenuItem value="J">J</MenuItem>
          <MenuItem value="L">L</MenuItem>
          <MenuItem value="S">S</MenuItem>
          <MenuItem value="V">V</MenuItem>
          <MenuItem value="Z">Z</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
};
