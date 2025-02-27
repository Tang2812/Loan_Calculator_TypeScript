import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { LoanPaymentModel } from '@models/loan_payment_model';
import { LoanModel } from '@models/loan_model';

interface InputErrorMessage {
  inputStatus: boolean,
  errorMessages: string[]
};
interface ResultRecordParam {
  origin: number,
  remainingOriginalAmount: number,
  interest: number,
  repaymentPeriod: string,
  totalPayable: number
};

interface RepaymentInfor {
  remainingOriginalAmount: number,
  repaymentPeriod: string
}
export class Ultil {
  /**
   *function to get date today by format dd/MM/YYY
   */
  getDayToDay() {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
    const result = date.toLocaleDateString('vi-VN', options);
    return result;
  }

  /**
   *function check year input is a leap year
   */
  isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   *function calculate number of date in a month
   */
  getDaysInMonth(month: number, year: number) {
    const DATES_OF_MONTH = [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return DATES_OF_MONTH[month - 1];  /*DATES_OF_MONTH start from index 0*/
  }

  /**
   * function reformat value by format VN number
   */
  reformater(value: number) {
    return isNaN(value) ? '0' : value.toLocaleString('vi-VN');
  }

  /**
   *function check NAN value
   * @returns 0 if value is not a number or reformated number if value is a number
   */
  checkIfNAN(value: number) {
    return isNaN(value) ? '0' : this.reformater(Math.round(value));
  }

  /**
   *function check is date in past
   * @returns true if the date entered is older than today else return false
   */
  isDateInPast(valueOfDisbursementDate: string) {
    const currentDate = this.getDayToDay().split('/').map(Number);
    const inputDate = valueOfDisbursementDate.split('/').map(Number);
    const [currentDay, currentMonth, currentYear] = currentDate;
    const [inputDay, inputMonth, inputYear] = inputDate;
    const current = new Date(currentYear!, currentMonth! - 1, currentDay);
    const input = new Date(inputYear!, inputMonth! - 1, inputDay);

    return input < current;
  }


  /**
   *function push date error message to errors
   * push error message of date if date in pass
   */
  checkDateInPass(date: string, inputErrors: InputErrorMessage) {
    if (this.isDateInPast(date)) {
      inputErrors.inputStatus = false;
      inputErrors.errorMessages.push('Date cannot be in the past');
    } else {
      inputErrors.errorMessages.push('');
    }
  }

  /**
   *function check value greater than 0 or is a number and push error message
   */
  checkValueGreaterThan0(value: number, inputErrors: InputErrorMessage, string: string) {
    if (value < 0 || isNaN(value)) {
      inputErrors.inputStatus = false;
      if (value <= 0) inputErrors.errorMessages.push(`${string} value must greater than 0`);
      if (isNaN(value)) inputErrors.errorMessages.push(`${string} value must be a number`);
    } else {
      inputErrors.errorMessages.push('');
    };
  }


  /**
   *function caculate repayment date per month
   * @returns this day next month
   */
  calculateRepaymentDate(date: string) {
    const [day, month, year] = date.split('/').map(Number);
    const DAYS_OF_MONTH = this.getDaysInMonth(month!, year!);
    const TOTAL_MONTHS_OF_YEAR = 12;
    let newMonth = month;
    let newDay = day;
    let newYear = year;

    newMonth = newMonth! + 1;
    if (newMonth > TOTAL_MONTHS_OF_YEAR) {
      newMonth = 1;
      newYear = newYear! + 1;
    };

    // check Day
    if (newDay! > DAYS_OF_MONTH!) {
      newDay = DAYS_OF_MONTH;
    }

    return `${newDay}/${newMonth}/${newYear}`;
  }

  createResultRecord(param: ResultRecordParam) {
    const resultRecord = new LoanPaymentModel(param.origin, param.remainingOriginalAmount, param.interest, param.repaymentPeriod, param.totalPayable);
    return resultRecord;
  }

  /**
   * function calculate remaining amount
   * @returns remaining amount per month
   */
  calculateRemainingAmount(remainingAmount: number, origin: number) {
    return Math.max(remainingAmount - origin, 0);
  }

  calculateSingleTermLoan(object: LoanModel, result: LoanPaymentModel[], repaymentInfor: RepaymentInfor) {
    const interest = object.calculateInterest(repaymentInfor.remainingOriginalAmount, object.interestRate);
    const totalInterestPayable = repaymentInfor.remainingOriginalAmount + interest;
    let param = {
      origin: repaymentInfor.remainingOriginalAmount,
      remainingOriginalAmount: repaymentInfor.remainingOriginalAmount,
      interest: interest,
      repaymentPeriod: repaymentInfor.repaymentPeriod,
      totalPayable: totalInterestPayable
    }
    result.push(this.createResultRecord(param));
    return totalInterestPayable;
  }

  calculateMultiTermLoan(object: LoanModel, result: LoanPaymentModel[], repaymentInfor: RepaymentInfor) {
    let totalInterestPayable = 0;
    let minMonthlyPayment = repaymentInfor.remainingOriginalAmount;
    let maxMonthlyPayment = 0;
    const origin = repaymentInfor.remainingOriginalAmount / object.loanTerm;

    for (let i = 1; i <= object.loanTerm; i++) {
      const interest = object.calculateInterest(repaymentInfor.remainingOriginalAmount, object.interestRate);
      repaymentInfor.remainingOriginalAmount = this.calculateRemainingAmount(repaymentInfor.remainingOriginalAmount, origin);
      repaymentInfor.repaymentPeriod = this.calculateRepaymentDate(repaymentInfor.repaymentPeriod);
      const totalPayable = origin + interest;
      totalInterestPayable += totalPayable;
      let param = {
        origin: origin,
        remainingOriginalAmount: repaymentInfor.remainingOriginalAmount,
        interest: interest,
        repaymentPeriod: repaymentInfor.repaymentPeriod,
        totalPayable: totalPayable
      }

      result.push(this.createResultRecord(param));

      minMonthlyPayment = Math.min(minMonthlyPayment, totalPayable);
      maxMonthlyPayment = Math.max(maxMonthlyPayment, totalPayable);
    }

    return { totalInterestPayable, minMonthlyPayment, maxMonthlyPayment };
  }

  /**
   * function export data to file xlsx
   * get data from local storage, change to xlsx and dowload to user device
   */
  exportToXLSX() {
    //Get data from local storage, change to json
    const result = JSON.parse(localStorage.getItem('result')!);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Loans');

    // add data to worksheet
    worksheet.columns = Object.keys(result[0]).map(key => ({ header: key, key, width: 15 }));
    result.forEach((data: LoanModel) => {
      worksheet.addRow(data);
    });

    // set width of cells
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell!({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      // width cell = width content + 5 spaces
      column.width = maxLength + 5;
    });

    // format all cell on sheet
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.font = {
          name: 'Times New Roman',
          size: 13
        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        };
        if (typeof cell.value === 'number') {
          cell.numFmt = '#,##0';
        }

        //add boder
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // export to file
    workbook.xlsx.writeBuffer()
      .then(buffer => {
        saveAs(new Blob([buffer]), 'loan_data.xlsx');
      })
      .catch(err => {
        console.error('Error writing file:', err);
      });
  }
}
