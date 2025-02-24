import { LoanModel } from "../models/loan_model";
import { Ultil } from "../utils/utils"
import { PageLoadView } from "../views/page_load_view";

const ultil = new Ultil();
export const PageLoadController = {
  init: function () {
    PageLoadView.init();
  },


  // change value of Loan amount
  calculateLoanAmountByLoanRate: function (loanRate: number, propertyValue: number) {
    let value = LoanModel.calculateLoanAmount(loanRate, propertyValue);
    return Number(value).toLocaleString('vi-VN')
  },

  // get date today
  getDayToDay: function () {
    return ultil.getDayToDay();
  }
}

