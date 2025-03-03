import FormInputController from "@controllers/form_input_controller";
import { LoanPaymentModel } from "@models/loan_payment_model";
import { Ultil } from "@utils/utils";

const ultil = new Ultil();
interface InputErrorMessage {
  inputStatus: boolean,
  errorMessages: string[]
}

interface InputBoxsParam {
  propertyValue: HTMLInputElement,
  loanAmount: HTMLInputElement,
  loanTerm: HTMLInputElement,
  interestRate: HTMLInputElement,
  disbursementDate: HTMLInputElement
}

interface ValueOfTableResultParam {
  totalInterest: string,
  totaInterestPayple: string,
  totalOrigin: string,
  minMonthlyPayment: string,
  maxMonthlyPayment: string
}
const propertyValue = document.querySelector('#property-value')! as HTMLInputElement;
const loanAmount = document.querySelector('#loan-amount')! as HTMLInputElement;
const loanTerm = document.querySelector('#loan-term')! as HTMLInputElement;
const interestRate = document.querySelector('#interest-rate')! as HTMLInputElement;
const disbursementDate = document.querySelector('#datepicker')! as HTMLInputElement;
const inputBoxs = document.querySelectorAll('.input-box')!;
const slider = document.querySelector('#slider'!);
const totaInterestPaypleText = document.querySelector("#total-interest-payable")!;
const minMonthlyPaymentText = document.querySelector("#monthly-payment-min-amount")!;
const maxMonthlyPaymentText = document.querySelector("#monthly-payment-max-amount")!;
const totalOriginText = document.querySelector('#total-origin')!;
const totalInterestText = document.querySelector('#total-interest')!;
const totalPaymentText = document.querySelector('#total-payment')!;
const monthlyPaymentAmountTex = document.querySelector('#monthly-payment-amount')!;
const totalInterestPayableText = document.querySelector('#total-money-payable')!;
const propertyValueError = document.querySelector('#property-error')!;
const loanAmountError = document.querySelector('#loan-amount-error')!;
const loanTermError = document.querySelector('#loan-term-error')!;
const interestRateError = document.querySelector('#interest-rate-error')!;
const disbursementDateError = document.querySelector('#date-time-error')!;
const INDEX_OF_PROPERTYVALUE_ERRMESSAGE = 0;
const INDEX_OF_LOANAMOUNT_ERRMESSAGE = 1;
const INDEX_OF_LOANTERM_ERRMESSAGE = 2;
const INDEX_OF_INTERSTERATE_ERRMESSAGE = 3;
const INDEX_OF_DISBURSEMENTDATE_ERRMESSAGE = 4;
export const FormInputView = {

  init: function () {
    this.getValueWhenUserInput();
  },

  /**
   *function get value when user input to input box
   */
  getValueWhenUserInput: function () {
    const inputBoxsParam = {
      propertyValue: propertyValue,
      loanAmount: loanAmount,
      loanTerm: loanTerm,
      interestRate: interestRate,
      disbursementDate: disbursementDate
    }

    inputBoxs.forEach(input => {
      input.addEventListener('input', () => {
        this.getValue(inputBoxsParam);
      })
    });

    /**
     *function get user when user chang value of slider
     */
    slider!.addEventListener('input', () => {
      this.getValue(inputBoxsParam);
    })

    /**
     * function get value when user choose date
     */
    disbursementDate!.addEventListener('change', () => {
      this.getValue(inputBoxsParam);
    });
  },

  /**
   * function get value, validate and handle value
   */
  getValue: function (inputBoxsParam: InputBoxsParam) {
    const valueOfPropertyValue = Number(inputBoxsParam.propertyValue.value.replace(/\./g, ''));
    const valueOfLoanAmount = Number(inputBoxsParam.loanAmount.value.replace(/\./g, ''));
    const valueOfLoanTerm = Number(inputBoxsParam.loanTerm.value);
    const valueOfInterestRate = Number(inputBoxsParam.interestRate.value);
    const valueOfDisbursementDate = inputBoxsParam.disbursementDate.value;

    const loanParam = {
      propertyValue: valueOfPropertyValue,
      loanAmount: valueOfLoanAmount,
      loanTerm: valueOfLoanTerm,
      interestRate: valueOfInterestRate,
      disbursementDate: valueOfDisbursementDate
    }

    //  validate input
    const errorsAndMessages = FormInputController.validateValue(loanParam);

    if (errorsAndMessages.inputStatus === true) {

      this.setMessageErrorToView(errorsAndMessages)
      FormInputController.handleLoanValue(loanParam);
    } else {
      this.setMessageErrorToView(errorsAndMessages)
    }
  },

  /**
   * function set error message to view
   * @param {} errorsAndMessages an object of errors and error messages
   */
  setMessageErrorToView: function (errorsAndMessages: InputErrorMessage) {
    // set message to error label
    propertyValueError.textContent = errorsAndMessages.errorMessages[INDEX_OF_PROPERTYVALUE_ERRMESSAGE]!;
    loanAmountError.textContent = errorsAndMessages.errorMessages[INDEX_OF_LOANAMOUNT_ERRMESSAGE]!;
    loanTermError.textContent = errorsAndMessages.errorMessages[INDEX_OF_LOANTERM_ERRMESSAGE]!;
    interestRateError.textContent = errorsAndMessages.errorMessages[INDEX_OF_INTERSTERATE_ERRMESSAGE]!;
    disbursementDateError.textContent = errorsAndMessages.errorMessages[INDEX_OF_DISBURSEMENTDATE_ERRMESSAGE]!;
  },

  /**
   * set value of table result and Modal
   */
  setValueOfTableResultAndModal: function (valueOfTableResultParam: ValueOfTableResultParam, result: LoanPaymentModel[]) {

    // set result to table result
    this.setValueToTableResult(valueOfTableResultParam);

    // set value to modal
    this.setValueOfModal(result);
  },

  setValueOfMonthlyPaymentResult: function (monthlyPaymentAmount: string, totalInterestPayable: string) {
    this.setValueOfMonthlyPaymentTable(monthlyPaymentAmount, totalInterestPayable);
  },

  /**
   * reformat value of element by reformater or 0 if value is NaN
   * @param {*} element
   * @param {*} value
   */
  updateTextContent: function (element: HTMLTableCellElement, value: number) {
    element.textContent = !isNaN(value) ? (ultil.reformater(Math.round(value)))! : '0';
  },



  // function to set value to row of table result
  /**
   * set result record after calculate to row of table result
   * @param {*} modalTable
   * @param {*} item
   * @param {*} number
   */
  setValueToTableRow: function (modalTable: HTMLTableSectionElement, item: LoanPaymentModel, number: number) {

    const ORDINAL_ROW = 0;
    const REPAYMENT_ROW = 1;
    const REMAINING_ORIGINAL_ROW = 2;
    const ORIGIN_ROW = 3;
    const INTEREST_ROW = 4;
    const TOTAL_ROW = 5;
    const row = modalTable.insertRow();
    const ordinalNumber = row.insertCell(ORDINAL_ROW);
    const repaymentPeriod = row.insertCell(REPAYMENT_ROW);
    const remainingOriginalAmount = row.insertCell(REMAINING_ORIGINAL_ROW);
    const origin = row.insertCell(ORIGIN_ROW);
    const interest = row.insertCell(INTEREST_ROW);
    const total = row.insertCell(TOTAL_ROW);

    ordinalNumber.textContent = number.toString();
    repaymentPeriod.textContent = item.repaymentPeriod;
    this.updateTextContent(remainingOriginalAmount, item.remainningOriginalAmount);
    this.updateTextContent(origin, item.origin);
    this.updateTextContent(interest, item.interest);
    this.updateTextContent(total, item.toralPrincipalAndInterest);

    // add css to record
    ordinalNumber.classList.add('content__result');
    repaymentPeriod.classList.add('content__result');
    remainingOriginalAmount.classList.add('content__result');
    origin.classList.add('content__result');
    interest.classList.add('content__result');
    total.classList.add('content__result');

  },

  /**
   * set value of result to modal contain table result
   */
  isEventAttached: false,
  setValueOfModal: function (result: LoanPaymentModel[]) {
    const modalTable = document.querySelector('#modal-table-result')!.getElementsByTagName('tbody')[0];
    const button = document.querySelector("#export")!;
    let number = 0;

    // clear conttent of modal
    modalTable!.innerHTML = '';
    result.forEach(item => {
      number = number + 1;
      this.setValueToTableRow(modalTable!, item, number);
    })

    // active button export to file xlsx
    if (!this.isEventAttached) {
      // listen event of button
      button.addEventListener('click', function () {
        FormInputController.exportToXLSX();
      });
      this.isEventAttached = true;
    }
  },

  /**
   * set totalInterest, totaInterestPayple, totalOrigin, minMonthlyPayment, maxMonthlyPayment to Decreasing balance sheet
   */
  setValueToTableResult: function (valueOfTableResultParam: ValueOfTableResultParam) {
    // set value to table result
    totalInterestText.textContent = valueOfTableResultParam.totalInterest;
    totalPaymentText.textContent = valueOfTableResultParam.totaInterestPayple;
    totalOriginText.textContent = valueOfTableResultParam.totalOrigin;
    totaInterestPaypleText.textContent = `${valueOfTableResultParam.totaInterestPayple} VND`;
    minMonthlyPaymentText.textContent = `${valueOfTableResultParam.minMonthlyPayment} VND`;
    maxMonthlyPaymentText.textContent = `${valueOfTableResultParam.maxMonthlyPayment} VND`;
  },

  //
  /**
   * set value of monthly payment amount, total Interest Payable to table of fixed monthly payment
   * @param {*} monthlyPaymentAmount
   * @param {*} totalInterestPayable
   */
  setValueOfMonthlyPaymentTable: function (monthlyPaymentAmount: string, totalInterestPayable: string) {
    monthlyPaymentAmountTex.textContent = `${monthlyPaymentAmount} VND`;
    totalInterestPayableText.textContent = `${totalInterestPayable} VND`;
  },

}



