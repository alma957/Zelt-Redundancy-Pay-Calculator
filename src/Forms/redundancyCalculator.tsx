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
  Typography,
  Box,
   Fade,
  FormLabel,
  Switch,
} from "@mui/material";

import "../App.css";

interface InputState {
  redundancyDate: string;
  startDate:string;
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
    startDate: new Date(new Date().getTime()-3600*1000*24*368*2).toISOString().substring(0,10),
    redundancyDate: new Date().toISOString().substring(0,10),
    pay: 456,
    yearsWorked: 3,
    age: 42,
    payPeriod: "weekly",
    jurisdiction: "england",
  };
  const st = {marginTop: "20px", background: "white",width:"95%"};
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
  const [maxWeek,setMaxWeek] = useState<number>(0)
 
    const [accruedWeeks,setAccruedWeeks] = useState<number>(0)
    const [adjustEarnings,setadjustEarnings] = useState<number>(0)
    const [yearsWorkedBreak,setYearsWorkedBreak] = useState<any>({
      "22":0,
      "41":0,
      "old":0
    })
  useEffect(() => {
    if(isNaN(inputState.pay)) {
      setadjustEarnings(0)
      setResult(0)
      return
    } else if(inputState.yearsWorked<2) {
      inputState.yearsWorked=0
      setInputState(inputState)
      setResult(0)
    }
    for (let e in ErrorInputState) {
      if (ErrorInputState[e as keyof typeof ErrorInputState] !== ""){ 
        return
      };
    }
    const date = new Date(inputState.redundancyDate).getTime();
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
      setMaxWeek(max.max_week)
   
    const nWeeks =  calculateWeeks(inputState.age, Math.min(inputState.yearsWorked, 20))
      setAccruedWeeks(nWeeks)
      
    const total = Math.min( max.max_total, nWeeks * weekEarnings);
    setadjustEarnings(roundUpAll(inputState.pay*(mappingEarnings[inputState.payPeriod as keyof typeof mappingEarnings] as number)))
    setResult(roundUpAll(total));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputState]);
  const calculateWeeks = (age: number, yearsWorked: number) => {
    let res = 0;
    yearsWorkedBreak["22"] = 0
    yearsWorkedBreak["41"] = 0
    yearsWorkedBreak["old"] = 0
    for (let i = 1; i < yearsWorked+1; i++) {
      if (age - i < 22) {
        res += 0.5
        yearsWorkedBreak["22"]+=1
      }
      else if (age - i >= 22 && age - i < 41) {
        res += 1
        yearsWorkedBreak["41"]+=1
      }
      else if (age-i >= 41) {
        res += 1.5
        yearsWorkedBreak["old"]+=1
      };
    }
    setYearsWorkedBreak(yearsWorkedBreak)
    return res;
  };
  const [displayExplanation,setDisplayExplanation] = useState<boolean>(false)
  return (
    <Paper
      className="myinput"
      style={{
        width: "85%",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        marginLeft: "20px",
        marginTop: "20px",
        background: "#F2F2F7",
      }}
    >
    <Box style={{display:"flex",flexDirection:"column",width:"100%"}}>
    <TextField
        label="Employment start date"
        InputLabelProps={{
          style: {color: "black",fontWeight:"bold",fontSize:"95%"},
          shrink: true,
        }}
        size="small"
        error={ErrorInputState.yearsWorked !== ""}
        type="date"
        style={st}
  
        value={inputState.startDate}
        onChange={e => {
       
          if (!isValidDate(e.target.value)) {
            ErrorInputState.yearsWorked = "Insert a valid date"
          
          } 
          
          const date = new Date(e.target.value).getTime()
          inputState.startDate = e.target.value
          const reduDate = new Date(inputState.redundancyDate).getTime()
          if(reduDate<=date) {
            ErrorInputState.yearsWorked = "Employment must start before redundancy"
            return;
          }
          inputState.yearsWorked = Math.floor((reduDate-date)/(3600*1000*24*365));
          console.log(inputState.yearsWorked)
         
          if (inputState.age - inputState.yearsWorked < 15) {
            ErrorInputState.yearsWorked =
              "Given your age, you should not have worked more than " +
              (inputState.age - 16 + 1).toString() +
              " years";
          } else {
            ErrorInputState.yearsWorked = "";
          }
          setErrorInputState({...ErrorInputState});
          console.log("setting")
           setInputState({...inputState});
        }}
        helperText={ErrorInputState.yearsWorked}
        FormHelperTextProps={{style: errorStyle}}
      />
      <TextField
        type="date"
        size="small"
        style={{...st,marginLeft:"0%"}}
        label="Redundancy start date"
        InputLabelProps={{
          shrink: true,
          style: {color: "black",fontWeight:"bold",fontSize:"95%"},
        }}
        value={inputState.redundancyDate}
        onChange={e => {
          inputState.redundancyDate = e.target.value;
        
          const date = new Date(inputState.startDate).getTime()
          const reduDate = new Date(inputState.redundancyDate).getTime()
          if(inputState.redundancyDate<=inputState.startDate) {
            ErrorInputState.date = "Employment must start before redundancy"
            
          }
          if (!isValidDate(e.target.value)) {
            ErrorInputState.date = "Insert a valid date";
          } else if (
            new Date(inputState.redundancyDate).getTime() <
              new Date(2021, 3, 6).getTime() ||
            new Date(inputState.redundancyDate).getTime() > new Date(2023, 3, 5).getTime()
          ) {
            ErrorInputState.date =
              "The date must be between 6 Apr 2021 and 5 Apr 2023";
          } else {
            ErrorInputState.date = "";
          }

          inputState.yearsWorked = Math.floor((reduDate-date)/(3600*1000*24*365));
          
          setErrorInputState({...ErrorInputState});
          setInputState({...inputState});
        }}
        error={ErrorInputState.date !== ""}
        helperText={ErrorInputState.date}
        FormHelperTextProps={{
          style: errorStyle,
        }}
      />
      </Box>
      <FormControl>
        <InputLabel size="small" style={{marginTop: st.marginTop, color: "black",fontWeight:"bold",fontSize:"95%"}}>
          Jurisdiction
        </InputLabel>
        <Select
        size="small"
          label="Jurisdiction"
          style={st}
          value={inputState!.jurisdiction}
          input={<OutlinedInput label="Jurisdiction" />}
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
        label="Age when the employee was made redundant"
        type="number"
        size="small"
        error={ErrorInputState.age !== ""}
        style={st}
        InputProps={{
          inputProps: {min: 0, max: 100},
          
        }}
        InputLabelProps={{       
          style: {color: "black",fontWeight:"bold",fontSize:"95%"},
        }}
        value={inputState.age}
        onChange={e => {
          inputState.age = Math.floor(parseInt(e.target.value));
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
        label="Weekly income"
        key="pay"  
        size="small"     
        type="number"
        style={st}
        InputLabelProps={{
          style: {color: "#000000",fontWeight:"bold",fontSize:"95%"}         
        }}
        variant="outlined"
        InputProps={{
          startAdornment: <InputAdornment position="start">£</InputAdornment>,
          inputProps: {min: 0, max: 100},
        }}
        helperText="average over the past 12 weeks"
        FormHelperTextProps={{style:{...errorStyle,color:"black"}}}
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
      <Box style={{marginLeft:"0px",marginTop:"0"}}>
      {/* Breakdown  <IconButton aria-label="Example" style={{transform: !displayExplanation? "rotate(0deg)":"rotate(90deg)"}} onClick={()=>{
    setDisplayExplanation(!displayExplanation)
  }}  > 
  <ArrowForward/>

</IconButton>  */}
<FormLabel style={{fontWeight: "bold", color: "black"}}>
          Display breakdown
        </FormLabel>
        <Switch
          onChange={e => {
            setDisplayExplanation(e.target.checked)
          }
        }
        />
</Box>
<Fade in={displayExplanation} unmountOnExit style={{display:displayExplanation?"block":"none"}} >
      <Typography >
      <li>
          Considered years worked: <i style={{fontWeight:"bold"}}>min({inputState.yearsWorked},<span style={{"color":"red",fontWeight:"bold"}}>{20}</span>)</i> =<span style={{}}></span> <span style={{color:inputState.yearsWorked>20 ? "red":"black",fontWeight:"bold"}}>{Math.min(inputState.yearsWorked,20)}</span> 
      </li>
        
        <li style={{marginTop:"5px"}}>
          Total number of accrued weeks =<span style={{fontWeight:"bold"}}> {accruedWeeks}</span>

          <ul style={{listStyleType:"circle"}}>         
          <li style={{display:yearsWorkedBreak["22"]===0?"none":"list-item",listStyleType:"circle"}}>
          Weeks accrued (age {"<"} 22): {yearsWorkedBreak["22"]} years * 0.5 = <b>{yearsWorkedBreak["22"]*0.5} weeks</b>
          </li>
          <li style= {{display:yearsWorkedBreak["41"]===0?"none":"list-item",listStyleType:"circle"}}>
          Weeks accrued (22{" <= age < "}41): {yearsWorkedBreak["41"]} years * 1 =<b> {yearsWorkedBreak["41"]*1} weeks</b>
          </li>
          <li style= {{display:yearsWorkedBreak["old"]===0?"none":"list-item",listStyleType:"circle"}}>
          Weeks accrued {"(age >= 41)"}: {yearsWorkedBreak["old"]} years * 1.5 = <b>{yearsWorkedBreak["old"]*1.5} weeks</b>
          </li>
          </ul>
     
        </li>
        

        <li >
          Considered weekly earnings: <i style={{fontWeight:"bold"}}>min({roundUpAll(inputState.pay*(mappingEarnings[inputState.payPeriod as keyof typeof mappingEarnings] as number))},<span style={{"color":"red",fontWeight:"bold"}}>{maxWeek}</span>)</i> =<span style={{fontWeight:"bold"}}> £{currencyFormat(Math.min(adjustEarnings,maxWeek))}</span>
          </li>
        <li style={{marginTop:"5px"}}>
          Total: <i style={{fontWeight:"bold"}}>£<span style={{color:adjustEarnings>maxWeek?"red":"black"}}>{currencyFormat(roundUpAll(Math.min(adjustEarnings,maxWeek)))}</span>*{accruedWeeks}</i> = <span style={{fontWeight:"bold"}}> £{currencyFormat(result)} </span>
        </li>
      </Typography>
      </Fade>
    </Paper>
  );
};
const currencyFormat = (num: number): string => {

  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const roundUpAll = (original: number): number => {
  const tempOr = original.toString();

  let value;
  if (tempOr.indexOf(".") === -1) return original;
  else {
    value = tempOr + "00";
  }
  let up = false;
  for (let i = value.indexOf(".") + 3; i < value.length; i++) {
    const d = value.charAt(i);
    if (d !== "0") {
      up = true;
      break;
    }
  }
  const digits = value.split(".")[1];
  if (up && digits[1] === "9" && digits[0] === "9") {
    return Math.round(original);
  } else if (up && digits[1] === "9") {
    return parseFloat(value.split(".")[0] + "." + (parseInt(digits[0]) + 1).toString());
  } else if (up) {
    return parseFloat(value.split(".")[0] +"." + digits[0] +  (parseInt(digits[1]) + 1).toString());
  } else {
    return original;
  }
};

const isValidDate = (date: string): boolean => {
  return date !== "" && !isNaN(new Date(date).getTime());
};
