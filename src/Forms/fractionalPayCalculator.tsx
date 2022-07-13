import { Checkbox } from "@mui/material";
import { useState } from "react";

import { salaryBpMap } from "./variables";

export const FractionalPayForm = (): JSX.Element => {
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [salary, setGrossSalary] = useState<number | undefined>();
  let [checkedWorkingDays, setWorkingDays] = useState<Set<number>>(
    new Set([1, 2, 3, 4, 5])
  );
  const [salaryBasis, setSalaryBasis] = useState<string>("Annually");
  const [daysToTakeOff, setDaysWorkedPerWeek] = useState<number | undefined>(0);
  const [fractionalPay, setFractionalPay] = useState<number | undefined>();

  const updateCheckedVal = (num: number, action: string) => {
    switch (action) {
      case "add":
        checkedWorkingDays.add(num);
        setWorkingDays(checkedWorkingDays);
        break;
      case "delete":
        checkedWorkingDays.delete(num);
        setWorkingDays(checkedWorkingDays);
        break;
    }
  };
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <form
      className="myForm"
      id="form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex-container">
        <h2>Pay Calculator</h2>
      </div>
      <p>
        <label>
          Start Date *{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
      </p>
      <p>
        <label>
          End Date *
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
      </p>
      <p>
        <label>
          Gross Salary *
          <input
            type="number"
            min="0"
            value={salary}
            step="0.01"
            onChange={(e) => {
              if (parseFloat(e.target.value) < 0) {
                setGrossSalary(0);
              } else {
                setGrossSalary(parseFloat(e.target.value));
              }
            }}
            required
          />
        </label>
      </p>
      <p>
        <label>
          Salary Basis *
          <select
            value={salaryBasis}
            onChange={(e) => {
              setSalaryBasis(e.target.value);
            }}
            //defaultValue={"Annually"}

            required
          >
            <option value="Annually">Annually</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
          </select>
        </label>
      </p>
      <div className="multiselect">
        <div
          className="selectBox"
          onClick={(e) => {
            var checkboxes = document.getElementById("checkboxes");
            if (!expanded) {
              checkboxes!.style.display = "block";
              setExpanded(true);
            } else {
              checkboxes!.style.display = "none";
              setExpanded(false);
            }
          }}
        >
          <label>
            Select Working Days (Mon-Fri Default)
            <select style={{ fontWeight: "normal" }}>
              <option>Select an Option</option>
            </select>
          </label>
          <div className="overSelect" style={{ fontWeight: "normal" }}></div>
        </div>
        <div id="checkboxes" className="expand">
          <label>
            <Checkbox
              value="1"
              onClick={(e: any) => {
                // checkWorkingDays(e);
                updateCheckedVal(
                  parseInt(e.target.value),
                  e.target.checked ? "add" : "delete"
                );
              }}
              defaultChecked
            />
            Monday
          </label>
          <label>
            <Checkbox
              value="2"
              onClick={(e: any) => {
                // checkWorkingDays(e);
                updateCheckedVal(
                  parseInt(e.target.value),
                  e.target.checked ? "add" : "delete"
                );
              }}
              defaultChecked
            />
            Tuesday
          </label>
          <label>
            <Checkbox
              value="3"
              onClick={(e: any) => {
                // checkWorkingDays(e);
                updateCheckedVal(
                  parseInt(e.target.value),
                  e.target.checked ? "add" : "delete"
                );
              }}
            />
            Wedsnesday
          </label>
          <label>
            <Checkbox
              value="4"
              onClick={(e: any) => {
                // checkWorkingDays(e);
                updateCheckedVal(
                  parseInt(e.target.value),
                  e.target.checked ? "add" : "delete"
                );
              }}
              defaultChecked
            />
            Thursday
          </label>
          <label>
            <Checkbox
              value="5"
              onClick={(e: any) => {
                // checkWorkingDays(e);
                updateCheckedVal(
                  parseInt(e.target.value),
                  e.target.checked ? "add" : "delete"
                );
              }}
              defaultChecked
            />
            Friday
          </label>
          <label>
            <Checkbox
              value="6"
              onClick={(e: any) => {
                // checkWorkingDays(e);
                updateCheckedVal(
                  parseInt(e.target.value),
                  e.target.checked ? "add" : "delete"
                );
              }}
            />
            Saturday
          </label>
          <label>
            <Checkbox
              value="0"
              onClick={(e: any) => {
                // checkWorkingDays(e);
                updateCheckedVal(
                  parseInt(e.target.value),
                  e.target.checked ? "add" : "delete"
                );
              }}
            />
            Sunday
          </label>
        </div>
      </div>
      <p>
        <label>
          Days to Take Off
          <input
            type="number"
            min="0"
            step="0.01"
            value={daysToTakeOff}
            onChange={(e) =>
              parseFloat(e.target.value) < 0 || parseFloat(e.target.value) > 7
                ? ""
                : setDaysWorkedPerWeek(parseFloat(e.target.value))
            }
          />
        </label>
      </p>

      <div className="flex-container">
        <div>
          <button
            onClick={() => {
              const pay = calculateFractionalPay(
                new Date(startDate as string),
                new Date(endDate as string),
                daysToTakeOff as number,
                checkedWorkingDays,
                salaryBasis,
                salary as number
              );
              setFractionalPay(pay);
            }}
          >
            Calculate
          </button>
        </div>

        <div></div>
      </div>
      <h2>
        {fractionalPay === undefined
          ? ""
          : `Fractional Pay: £${(
              Math.round(fractionalPay * 100) / 100
            )?.toFixed(2)}`}
      </h2>
    </form>
  );
};
const calculateFractionalPay = (
  startDate: Date,
  endDate: Date,
  daysOff: number,
  workingDays: Set<number>,
  salaryBasis: string,
  grossSalary: number
): number | undefined => {
  console.log(grossSalary);
  if (endDate.getTime() < startDate.getTime()) {
    alert("End date must be after start date");
    return undefined;
  } else if (workingDays.size === 0) {
    alert("You need to select at least a working day");
    return undefined;
  } else if (grossSalary === undefined || isNaN(grossSalary)) {
    alert("You need to insert a valid salary");
    return undefined;
  }
  const days = Math.max(
    calcNumberOfFractionalDays(startDate, endDate, workingDays) -
      (daysOff === undefined || isNaN(daysOff) ? 0 : daysOff),
    0
  );
  console.log(salaryBpMap.get(salaryBasis));
  console.log(grossSalary);
  console.log(days);
  return (grossSalary * salaryBpMap.get(salaryBasis)! * days) / 365;
};

const calcNumberOfFractionalDays = (
  startDate: Date,
  endDate: Date,
  workingDays: Set<number>
) => {
  const startDateTime = startDate.getTime();
  const endDateTime = endDate.getTime();
  let actualDateTime = startDateTime;

  let days = 0;
  while (actualDateTime <= endDateTime) {
    const d = new Date(actualDateTime);

    if (workingDays.has(d.getDay())) {
      days++;
    }

    actualDateTime = addOneDay(d);
  }

  return days;
};

const addOneDay = (date: Date) => {
  return date.getTime() + 1000 * 3600 * 24;
};
