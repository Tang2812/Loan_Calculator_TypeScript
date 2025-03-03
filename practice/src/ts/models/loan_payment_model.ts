export class LoanPaymentModel {
  constructor(public origin: number, public remainningOriginalAmount: number, public interest: number, public repaymentPeriod: string, public toralPrincipalAndInterest: number) {

  }

  static createResultRecord(origin: number, remainingOriginalAmount: number, interest: number, repaymentPeriod: string, totalPayable: number) {
    return new LoanPaymentModel(origin, remainingOriginalAmount, interest, repaymentPeriod, totalPayable);
  }
}

