import { PageLoadController } from "@controllers/page_load_controller";
import flatpickr from 'flatpickr';

export const PageLoadView = {
  init: function () {
    const inputBox = document.querySelector('#datepicker') as HTMLInputElement;
    this.reformatNumber();
    this.changeValuesWhenSliderChange();
    this.changeLoanAmountWhenInputProperty();
    this.getDate(inputBox);
    this.changeLoanRateByLoanAmount();
    this.openCloseModal();
    this.activeButtonLeft();
    this.activeButtonRight();
    this.initializeDatePicker();
  },

  // call reformat number from controller
  reformatNumber: function () {
    this.reformatNumberToVietNameseNumberFormat('#property-value');
    this.reformatNumberToVietNameseNumberFormat('#loan-amount');
  },


  /**
   * function change value when pull or change slider
   */
  changeValuesWhenSliderChange: function () {
    const slider = document.querySelector('#slider')! as HTMLInputElement;
    const sliderValue = document.querySelector('#sliderValue') as HTMLInputElement;
    slider.addEventListener('input', () => {
      const propertyValue = Number((document.querySelector('#property-value')! as HTMLInputElement).value.replace(/\./g, ''));
      const loanAmount = document.querySelector('#loan-amount')! as HTMLInputElement;
      sliderValue.textContent = slider.value + '%';
      loanAmount.value = PageLoadController.calculateLoanAmountByLoanRate(parseInt(slider.value), propertyValue);
    });
  },

  /**
   * function change loan amount when input property value, loan amout = 0 if loan amout is NaN
   */
  changeLoanAmountWhenInputProperty: function () {
    const propertyValueBox = document.querySelector('#property-value')! as HTMLInputElement;
    const slider = document.querySelector('#slider')! as HTMLInputElement;
    const sliderValue = document.querySelector('#sliderValue')! as HTMLInputElement;
    propertyValueBox.addEventListener('input', () => {
      const propertyValue = Number(((document.querySelector('#property-value')!) as HTMLInputElement).value.replace(/\./g, ''));
      const loanAmount = document.querySelector('#loan-amount')! as HTMLInputElement;
      sliderValue.textContent = slider.value + '%';
      const loanAmountValue = PageLoadController.calculateLoanAmountByLoanRate(parseInt(slider.value), propertyValue);
      loanAmount.value = Number.isNaN(loanAmountValue) ? '0' : loanAmountValue;

    });
  },

  /**
   * get date today and set to input box
   */
  getDate: function (inputBox: HTMLInputElement) {
    const today = PageLoadController.getDayToDay();
    inputBox.value = today;
  },


  /**
   *function reformat number by VN number format in input box
   * @param {String} idElement name, id, class of input box
   */
  reformatNumberToVietNameseNumberFormat: function (idElement: string) {
    document.addEventListener('DOMContentLoaded', () => {
      const numberInput = document.querySelector(idElement)! as HTMLInputElement;

      numberInput.addEventListener('input', (e: Event) => {
        let target = e.target as HTMLInputElement;
        let value: number | string = target.value;
        value = parseInt(value.replace(/\./g, ''));
        if (!isNaN(value) && value.toString() !== '') {
          value = Number(value).toLocaleString('vi-VN');
        } else {
          value = 0;
        };
        target.value = value.toString();
      })

    })
  },

  /**
   *function caculate Loan rate by loan amount
   * @param {*} inputEvent
   */
  calculateLoanRateByLoanAmount: function (inputEvent: Event) {
    const sliderValue = document.querySelector('#sliderValue')! as HTMLInputElement;
    const loanRate = document.querySelector('#slider')! as HTMLInputElement;
    const propertyValue = Number(((document.querySelector('#property-value')!) as HTMLInputElement).value.replace(/\./g, ''));
    let target = inputEvent.target! as HTMLInputElement;
    let loanAmountValue = Number(target.value.replace(/\./g, ''));
    let loanRateValue = Math.floor(loanAmountValue / propertyValue * 100);

    if (isNaN(loanRateValue) || loanRateValue < 0) {
      loanRate.value = '0';
      sliderValue.textContent = '0%';
    } else if (loanRateValue > 100) {
      loanRate.value = '100';
      sliderValue.textContent = '100%';
      target.value = propertyValue.toString();
    } else {
      loanRate.value = loanRateValue.toString();
      sliderValue.textContent = loanRateValue + '%';
    }

  },

  /**
   * function change Loan rate by Loan amount when input loan amount
   */
  changeLoanRateByLoanAmount: function () {
    const loanAmount = document.querySelector('#loan-amount')! as HTMLInputElement;

    loanAmount.addEventListener('input', (inputEvent) => {
      this.calculateLoanRateByLoanAmount(inputEvent);
    })

  },

  /**
   * function open and close modal when click button
   */
  openCloseModal: function () {
    const buttonExports = document.querySelectorAll('#button-export');
    buttonExports.forEach(buttonExport => {
      buttonExport.addEventListener('click', () => {
        const modal = document.querySelector('.modal-container')!;
        modal.classList.toggle('modal--visible');
      })
    });

  },

  /**
   * function open decreasing balance  when click button button #btn-decreasing-balance
   */
  activeButtonLeft: function () {
    const button = document.querySelector("#btn-decreasing-balance")!;
    const INDEX_OF_BUTTON = 0;
    const monthlyPaymentResult = document.querySelector('.monnthly-payment-calculate__result') as HTMLElement;
    const tableResult = document.querySelector('.calculate__result') as HTMLElement;

    button.addEventListener('click', () => {
      this.activeButton(INDEX_OF_BUTTON, tableResult, monthlyPaymentResult);
    });
  },

  /**
 * function open decreasing balance sheet when click button button #btn-decreasing-balance-shee
 */
  activeButtonRight: function () {
    const button = document.querySelector("#btn-decreasing-balance-sheet")!;
    const INDEX_OF_BUTTON = 1;
    const monthlyPaymentResult = document.querySelector('.monnthly-payment-calculate__result') as HTMLElement;
    const tableResult = document.querySelector('.calculate__result') as HTMLElement;

    button.addEventListener('click', () => {
      this.activeButton(INDEX_OF_BUTTON, monthlyPaymentResult, tableResult);
    });
  },

  // change button style and under line
  activeButton: function (index: number, sheetOpen: HTMLElement, sheetClose: HTMLElement) {
    const buttons = document.querySelectorAll('.btn')!;
    const underLine = document.querySelector('.line-under')!;
    const isWidth50 = underLine.classList.contains('width-50');

    buttons.forEach((button, i) => {
      button.classList.toggle('active', i === index);
    });

    // delete old positions
    underLine.classList.remove('position-0', 'position-1');

    // add class new position based on index
    underLine.classList.add(`position-${index}`);

    // change width
    if (isWidth50) {
      underLine.classList.remove('width-50');
      underLine.classList.add('width-44');
    } else {
      underLine.classList.remove('width-44');
      underLine.classList.add('width-50');
    }

    // open sheet need open
    sheetOpen.classList.remove('display--none');

    // close sheet need close
    sheetClose.classList.add('display--none');
  },

  initializeDatePicker: function () {
    flatpickr("#datepicker", {
      dateFormat: "d/m/Y" //format dd/mm/YYYY
    });
  }
}

