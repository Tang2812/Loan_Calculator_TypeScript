export class LoanModel {
  constructor(public propertyValue: number, public loanAmount: number, public loanTerm: number, public interestRate: number, public disbursementDate: string) {
  }

  // Calculate interest per month
  calculateInterest(amount: number, interestRate: number): number {
    return amount * (interestRate / 100) / 12;
  }

  // Calculate loan amount
  static calculateLoanAmount(loanRate: number, propertyValue: number): number {
    return propertyValue * loanRate / 100;
  }

  // Calculate interst payable
  calculateInterestPayable(): number {
    return this.loanAmount + this.loanAmount * this.interestRate / 100
  }
}
