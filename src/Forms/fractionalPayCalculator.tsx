import { useState } from "react";

import { salaryBpMap } from "./variables";

export const FractionalPayForm = (): JSX.Element => {
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [salary, setGrossSalary] = useState<number | undefined>();

  const [salaryBasis, setSalaryBasis] = useState<string>("Annually");

  const [fractionalPay, setFractionalPay] = useState<number | undefined>();

  return (
    <form
      className="myForm"
      id="form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex-container">
        <h2>Fractional Pay Calculator</h2>
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
          Gross Salary (£) *
          <input
            type="number"
            min="0"
            step="any"
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

      <div className="flex-container">
        <div>
          <button
            onClick={() => {
              if (
                startDate === undefined ||
                endDate === undefined ||
                salary === undefined ||
                isNaN(salary)
              )
                return;
              const pay = calculateFractionalPay(
                new Date(startDate as string).getTime(),
                new Date(endDate as string).getTime(),

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
          : `Fractional Pay: £${currencyFormat(roundUpAll(fractionalPay, 1))}`}
      </h2>
    </form>
  );
};
const calculateFractionalPay = (
  startDate: number,
  endDate: number,
  salaryBasis: string,
  grossSalary: number
): number | undefined => {
  if (endDate < startDate) {
    alert("End date must be after start date");
    return undefined;
  }

  const gross =
    (grossSalary *
      salaryBpMap.get(salaryBasis)! *
      (endDate -
        startDate +
        1000 *
          3600 *
          24 *
          (1 +
            new Date(endDate).getFullYear() -
            new Date(startDate).getFullYear()))) /
    (1000 * 3600 * 24 * (365 + leapAdjustments(startDate, endDate)));
  return gross;
};

const currencyFormat = (num: number): string => {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
export const roundUpAll = (original: number, precision: number) => {
  const value = original.toFixed(10);

  const digits = value.split(".")[1];
  let rounded: number | undefined = undefined;

  const sDigits = digits[1];
  if (sDigits === "0") {
    return original;
  } else if (digits[0] === "9") {
    return Math.round(parseFloat(value));
  } else {
    rounded = parseFloat(
      value.split(".")[0] + "." + (parseInt(digits[0]) + 1).toString()
    );
    return rounded;
  }
};

const leapYear = (year: number) => {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true;
  }

  return false;
};
const leapAdjustments = (start: number, end: number): number => {
  let res = 0;

  let annMill = 365 * 24 * 60 * 1000 * 365;
  let startYear = new Date(start);
  if (leapYear(new Date(end).getFullYear())) {
    res++;
  }

  while (startYear.getFullYear() < new Date(end).getFullYear()) {
    if (leapYear(startYear.getFullYear())) res++;
    startYear = new Date(startYear.getTime() + annMill);
  }

  return res;
};
