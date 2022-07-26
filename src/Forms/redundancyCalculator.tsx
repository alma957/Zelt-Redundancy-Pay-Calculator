import {useEffect, useState} from "react";
import {rates, CapRates, Max} from "./variables";
import {
  Select,
  TextField,
  Paper,
  FormControl,
  MenuItem,
  InputLabel,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import "../App.css";

interface InputState {
  date: string;
  pay: number;
  yearsWorked: number;
  payPeriod: string;
  age: number;
  jurisdiction: string;
}
interface ErrorState {
  date: string;
  pay: string;
  yearsWorked: string;
  age: string;
}
export const RedundancyPayCalculator = (): JSX.Element => {
  const initialState: InputState = {
    date: "2022-01-01",
    pay: 2500,
    yearsWorked: 5,
    age: 30,
    payPeriod: "annually",
    jurisdiction: "england",
  };
  const st = {marginTop: "20px", background: "white"};
  const [inputState, setInputState] = useState<InputState>(initialState);
  const [result, setResult] = useState<number>(0);
  const [ErrorInputState, setErrorInputState] = useState<ErrorState>({
    date: "",
    pay: "",
    yearsWorked: "",
    age: "",
  });
  const errorStyle = {
    color: "red",
    background: "#F2F2F7",
    marginLeft: "0",
    marginTop: "0",
    width: "100%",
  };
  const mappingEarnings = {
    weekly: 1,
    daily: 7,
    annually: 1 / 52,
    monthly: 12 / 52,
  };
  useEffect(() => {
    for (let e in ErrorInputState) {
      if (ErrorInputState[e as keyof typeof ErrorInputState] !== "") return;
    }
    const date = new Date(inputState.date).getTime();
    const jurisdiction = inputState.jurisdiction;
    const data: CapRates = rates.reduce((a, b) => {
      if (
        date <= new Date(b.end).getTime() &&
        date >= new Date(b.start).getTime()
      )
        return b;
      return a;
    });
    const max: Max = data[jurisdiction as keyof CapRates] as Max;

    const weekEarnings = Math.min(
      max.max_week,
      inputState.pay *
        mappingEarnings[inputState.payPeriod as keyof typeof mappingEarnings]
    );

    const total = Math.min(
      max.max_total,
      calculateWeeks(inputState.age, Math.min(inputState.yearsWorked, 20)) *
        weekEarnings
    );
    setResult(total);
  }, [inputState]);
  const calculateWeeks = (age: number, yearsWorked: number) => {
    let res = 0;
    for (let i = 0; i < yearsWorked; i++) {
      if (age + i < 22) res += 0.5;
      else if (age + i >= 22 && age + i < 41) res += 1;
      else if (age >= 41) res += 1.5;
    }
    return res;
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
        marginLeft: "20px",
        marginTop: "20px",
        background: "#F2F2F7",
      }}
    >
      <TextField
        type="date"
        style={{background: "white"}}
        label="Date you were made redundant"
        InputLabelProps={{
          shrink: true,
          style: {color: "black"},
        }}
        value={inputState.date}
        onChange={e => {
          inputState.date = e.target.value;
          if (!isValidDate(e.target.value)) {
            ErrorInputState.date = "Insert a valid date";
          } else if (
            new Date(inputState.date).getTime() <
              new Date(2021, 3, 6).getTime() ||
            new Date(inputState.date).getTime() > new Date(2023, 3, 5).getTime()
          ) {
            ErrorInputState.date =
              "The date must be between 6 Apr 2021 and 5 Apr 2023";
          } else {
            ErrorInputState.date = "";
          }
          setErrorInputState({...ErrorInputState});
          setInputState({...inputState});
        }}
        error={ErrorInputState.date !== ""}
        helperText={ErrorInputState.date}
        FormHelperTextProps={{
          style: errorStyle,
        }}
      />
      <FormControl>
        <InputLabel style={{marginTop: st.marginTop, color: "black"}}>
          Jurisdiction
        </InputLabel>
        <Select
          label="Pay period"
          style={st}
          value={inputState!.jurisdiction}
          input={<OutlinedInput label="Pay period" />}
          onChange={e => {
            inputState!.jurisdiction = e.target.value as string;
            setInputState({...inputState});
          }}
        >
          <MenuItem value="england">England & Wales</MenuItem>
          <MenuItem value="scotland">Scotland</MenuItem>
          <MenuItem value="northern_ireland">Northern Ireland</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Age when you were made redundant"
        type="number"
        error={ErrorInputState.age !== ""}
        style={st}
        InputProps={{
          inputProps: {min: 0, max: 100},
        }}
        InputLabelProps={{
          shrink: true,
          style: {color: "black"},
        }}
        value={inputState.age}
        onChange={e => {
          inputState.age = parseInt(e.target.value);
          setInputState({...inputState});
          if (inputState.age - inputState.yearsWorked < 15) {
            ErrorInputState.age =
              "Given the amount of years worked, you should not be younger than " +
              (inputState.yearsWorked + 16 - 1).toString();
          } else if (inputState.age < 16 || inputState.age > 100) {
            ErrorInputState.age = "Please insert an age between 16 and 100";
          } else {
            ErrorInputState.age = "";
          }
          setErrorInputState({...ErrorInputState});
        }}
        helperText={ErrorInputState.age}
        FormHelperTextProps={{style: errorStyle}}
      />
      <TextField
        label="How many years have you worked for your employer"
        InputLabelProps={{
          style: {color: "black"},
          shrink: true,
        }}
        error={ErrorInputState.yearsWorked !== ""}
        type="number"
        style={st}
        InputProps={{
          inputProps: {min: 0, max: 100},
        }}
        value={inputState.yearsWorked}
        onChange={e => {
          inputState.yearsWorked = parseInt(e.target.value);
          setInputState({...inputState});
          if (inputState.age - inputState.yearsWorked < 15) {
            ErrorInputState.yearsWorked =
              "Given your age, you should not have worked more than " +
              (inputState.age - 16 + 1).toString() +
              " years";
          } else {
            ErrorInputState.yearsWorked = "";
          }
          setErrorInputState({...ErrorInputState});
        }}
        helperText={ErrorInputState.yearsWorked}
        FormHelperTextProps={{style: errorStyle}}
      />
      <FormControl>
        <InputLabel
          style={{
            marginTop: st.marginTop,

            color: "black",
          }}
        >
          Pay period
        </InputLabel>
        <Select
          label="Pay period"
          style={st}
          value={inputState!.payPeriod}
          input={<OutlinedInput label="Pay period" />}
          onChange={e => {
            inputState!.payPeriod = e.target.value as string;
            setInputState({...inputState});
          }}
        >
          <MenuItem value="annually">Annually</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="daily">Daily</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Enter pay"
        type="number"
        style={st}
        InputLabelProps={{
          style: {color: "#000000"},
          shrink: true,
        }}
        InputProps={{
          startAdornment: <InputAdornment position="start">£</InputAdornment>,
          inputProps: {min: 0, max: 100},
        }}
        value={inputState.pay}
        onChange={e => {
          inputState.pay = parseFloat(e.target.value);

          setInputState({...inputState});
          if (isNaN(inputState.pay)) {
            ErrorInputState.pay = "Insert a valid pay";
          } else {
            ErrorInputState.pay = "";
          }
          setErrorInputState({...ErrorInputState});
        }}
      />

      <p style={{textDecoration: "underline", fontWeight: "bold"}}>
        Redundancy Pay: £{currencyFormat(result)}
      </p>
    </Paper>
  );
};
const currencyFormat = (num: number): string => {
  const ret = num.toFixed(3);
  let digit = null;
  const split = ret.split(".") as Array<string>;
  if (split[1].charAt(2) !== "0") {
    digit = parseInt(split[1].charAt(1)) + 1;
    const str = parseFloat(split[0] + "." + split[1].charAt(0) + digit);

    return str.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } else {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
};
const isValidDate = (date: string): boolean => {
  return date !== "" && !isNaN(new Date(date).getTime());
};
