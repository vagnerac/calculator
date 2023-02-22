/*
This is a Typescript code that is responsible to all logic in the calculator.
There are types to operation functions and HTML elements that are implemented
by the class Calculator.
Class Calculator has all methods to handle the buttons and its logics.
Some validation is implemented to check, for example, if operation signal is
pressed after a number and case the parentheses is already open in an operation
*/

import math = require('mathjs');

type OperationFunctions = {
  identifyClick(): void;
  handleRemoveChar(): void;
  handleValues(): void;
  handleNumber(value: HTMLButtonElement): void;
  handleClear(): void;
  handleOperation(value: HTMLButtonElement): void;
  handleParentheses(value: HTMLButtonElement): void;
  handleError(): void;
  doCalculation(): void;
};

type HTMLElements = {
  calculator: HTMLTableElement;
  display: HTMLInputElement;
  spanValues: HTMLSpanElement;
};

// class responsible to all methods in the application
export class Calculator implements OperationFunctions, HTMLElements {
  calculator: HTMLTableElement;
  display: HTMLInputElement;
  spanValues: HTMLSpanElement;
  private hasParentheses: number;
  private calculationValues: string[];
  private displayValue: number;

  constructor() {
    this.calculator = document.getElementById('calculator') as HTMLTableElement;
    this.display = document.getElementById('display') as HTMLInputElement;
    this.spanValues = document.getElementById('span-values') as HTMLSpanElement;
    this.calculationValues = [];
    this.hasParentheses = 0;
    this.displayValue = 0;
  }

  // method that is called and handle the buttons and its logics according the
  // class name in the html tags
  identifyClick(): void {
    this.calculator.addEventListener('click', (event) => {
      const el = event.target as HTMLButtonElement;
      if (el === null) return;
      if (el.classList.contains('btn-num')) this.handleNumber(el);
      if (el.classList.contains('btn-clear')) this.handleClear();
      if (el.classList.contains('btn-op')) this.handleOperation(el);
      if (el.classList.contains('btn-par')) this.handleParentheses(el);
      if (el.classList.contains('btn-equal')) this.doCalculation();
      if (el.classList.contains('btn-del')) this.handleRemoveChar();
    });
  }

  //method to handle the << button, that remove last character from the display
  handleRemoveChar(): void {
    this.display.value = this.display.value.slice(0, -1);
  }

  // method to handle the values showed in the span class below the display
  handleValues(): void {
    let values = '';
    this.calculationValues.forEach((value) => (values += value));
    this.spanValues.innerText = values;
  }

  // method to handle all numeric values when inpue
  handleNumber(value: HTMLButtonElement): void {
    this.displayValue = Number(this.display.value);
    if (isNaN(this.displayValue)) this.display.value = '';
    this.display.value += value.innerText;
  }

  // method that hanle the clear button
  handleClear(): void {
    this.calculationValues = [];
    this.display.value = '';
    this.handleValues();
  }

  // method to handle operations buttons
  handleOperation(value: HTMLButtonElement): void {
    this.displayValue = Number(this.display.value);
    if (isNaN(this.displayValue) || this.display.value === '') {
      this.handleError();
      return;
    }

    this.calculationValues.push(this.display.value);
    this.display.value = value.innerText;
    this.calculationValues.push(value.innerText);
    this.handleValues();
  }

  // Method to handle the parentheses symbols
  handleParentheses(value: HTMLButtonElement): void {
    const buttonValue = value.innerText;
    this.displayValue = Number(this.display.value);

    if (buttonValue === '(') {
      if (this.hasParentheses !== 0 || !isNaN(this.displayValue)) {
        this.handleError();
        return;
      }
      this.hasParentheses = 1;
    }

    if (buttonValue === ')') {
      if (this.hasParentheses !== 1) {
        this.handleError();
        return;
      }
      this.hasParentheses = 0;
    }

    this.display.value = value.innerText;
    this.calculationValues.push(value.innerText);
    this.handleValues();
  }

  // handle error
  handleError(): void {
    this.display.value = 'ERROR';
    this.calculationValues = [];
    this.hasParentheses = 0;
    this.handleValues();
  }

  // method to do the calculation when equal button is pressed
  doCalculation(): void {
    this.displayValue = Number(this.display.value);
    console.log(this.hasParentheses);
    if (
      isNaN(this.displayValue) ||
      this.display.value === '' ||
      this.hasParentheses === 1
    ) {
      this.handleError();
      return;
    }

    this.calculationValues.push(this.display.value);
    this.handleValues();

    try {
      const result: number = math.evaluate(this.spanValues.innerText);
      this.display.value = result.toString();
      this.calculationValues = [];
    } catch (e) {
      this.handleError();
    }
  }
}

//Instance of the class created
const calculator1 = new Calculator();

// main method called
calculator1.identifyClick();
