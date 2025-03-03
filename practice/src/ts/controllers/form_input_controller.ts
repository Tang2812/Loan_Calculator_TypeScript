import { LoanModel } from '@models/loan_model';
import { LoanPaymentModel } from '@models/loan_payment_model';
import { Ultil } from '@utils/utils';
import { FormInputView } from '@views/form_input_view';

interface LoanParam {
  propertyValue: number,
  loanAmount: number,
  loanTerm: number,
  interestRate: number,
  disbursementDate: string
}

const ultil = new Ultil();
const FormInputController = {
  innit: function () {
    FormInputView.init();
  },


  // calculate Loan payment
  /**
   * calculate loan payment, return array result of payment per month and total interest payable,
   * min monthly payment and max monthly payment
   */
  calculateLoanPayment: function (object: LoanModel) {
    let result: LoanPaymentModel[] = [];
    let remainingOriginalAmount = object.loanAmount;
    let repaymentPeriod = object.disbursementDate;
    const repaymentInfor = {
      remainingOriginalAmount: remainingOriginalAmount,
      repaymentPeriod: repaymentPeriod
    }

    if (object.loanTerm < 2) {
      const totalInterestPayable = ultil.calculateSingleTermLoan(object, result, repaymentInfor);
      return {
        result,
        totalInterestPayable,
        minMonthlyPayment: remainingOriginalAmount,
        maxMonthlyPayment: totalInterestPayable
      };
    } else {
      const { totalInterestPayable, minMonthlyPayment, maxMonthlyPayment } = ultil.calculateMultiTermLoan(object, result, repaymentInfor);
      return {
        result,
        totalInterestPayable,
        minMonthlyPayment,
        maxMonthlyPayment
      };
    }
  },


  // handle Loan Value
  /**
   * function handle loan value, calculate and save loan payment result to localstorage
   */
  handleLoanValue: function (loanParam: LoanParam) {
    const object = new LoanModel(loanParam.propertyValue, loanParam.loanAmount, loanParam.loanTerm, loanParam.interestRate, loanParam.disbursementDate);
    const { result, totalInterestPayable, minMonthlyPayment, maxMonthlyPayment } = this.calculateLoanPayment(object);
    const totalInterest = ultil.checkIfNAN(totalInterestPayable - loanParam.loanAmount);
    const totalOrigin = ultil.reformater(object.loanAmount);

    // Check numbers
    const finalTotalInterestPayable = ultil.checkIfNAN(totalInterestPayable);
    const finalMinMonthlyPayment = ultil.checkIfNAN(minMonthlyPayment);
    const finalMaxMonthlyPayment = ultil.checkIfNAN(maxMonthlyPayment);
    const finalInterstPayable = ultil.checkIfNAN(object.calculateInterestPayable());
    // Save data to localStorage
    localStorage.setItem('result', JSON.stringify(result));

    // Set value for table result
    const valueOfTableResultParam = {
      totalInterest: finalTotalInterestPayable,
      totaInterestPayple: finalMinMonthlyPayment,
      totalOrigin: finalMaxMonthlyPayment,
      minMonthlyPayment: totalInterest,
      maxMonthlyPayment: totalOrigin
    }
    FormInputView.setValueOfTableResultAndModal(valueOfTableResultParam, result);

    // Set value for monthly payment sheet
    if (loanParam.loanTerm < 2) {
      FormInputView.setValueOfMonthlyPaymentResult(finalMinMonthlyPayment, finalInterstPayable);
    } else {
      FormInputView.setValueOfMonthlyPaymentResult(finalMaxMonthlyPayment, finalInterstPayable);
    }
  },

  // validate value
  validateValue: function (loanParam: LoanParam) {
    const inputErrors = {
      inputStatus: true,
      errorMessages: []
    };

    // validate value of property
    ultil.checkValueGreaterThan0(loanParam.propertyValue, inputErrors, 'Property');

    // validate value loan amount
    ultil.checkValueGreaterThan0(loanParam.loanAmount, inputErrors, 'Loan value');

    // validate loan term
    ultil.checkValueGreaterThan0(loanParam.loanTerm, inputErrors, 'Loan term');

    // validate interst rate
    ultil.checkValueGreaterThan0(loanParam.interestRate, inputErrors, 'Interest rate');

    // validate Disbursement date
    ultil.checkDateInPass(loanParam.disbursementDate, inputErrors)

    return inputErrors;
  },

  // export file
  exportToXLSX: function () {
    ultil.exportToXLSX();
  }
}

export default FormInputController;
