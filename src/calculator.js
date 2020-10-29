const UTA = 595476; // UTA december 2019
export const UF = 28309.94; // UF 31 december 2019
const MAX_EXPENSE = 15 * UTA;
const RETENTION_FACTOR = 10.75;
export const MANDATORY_MAX_EXPENSE_UF = 12 * 80.2; // 80.2
export const MANDATORY_MAX_EXPENSE = MANDATORY_MAX_EXPENSE_UF * UF; // anual
const PARTIAL_FACTOR = 0.27 //year 2020

function min(a, b) {
  return a > b ? b : a;
}

export function calculateExpenses(anualIncome) {
  const expenses = anualIncome * 0.3;
  return min(expenses, MAX_EXPENSE);
}

export const mandatoryExpenseFactors = [
  { 
    name: "Seguro de invalidez y sobrevivencia", 
    factor: 1.53,
    variable: false,
  },
  {
    name:
      "Seguro de la ley de accidentes del trabajo y enfermedades profesionales",
    factor: 0.91,
    variable: false,
  },
  { 
    name: "Seguro de acompañamiento niños y niñas", 
    factor: 0.02,
    variable: false,
  },
  { 
    name: "Salud", 
    factor: 7,
    variable: true,
  },
  { 
    name: "AFP", 
    factor: 10, 
    variable: true,
  },
  { 
    name: "Comisión AFP", 
    factor: 0.77,
    variable: false
  },
];

export function taxableGross(income) {
  return min(0.8 * income, MANDATORY_MAX_EXPENSE);
}

export function getMandatoryExpenses(income, partial = false){
  let mandatoryExpensesTotal = 0;
  mandatoryExpenseFactors.forEach((expense) => {
    let expenseValue = (taxableGross(income) * expense.factor) / 100;
    if(expense.variable && partial){
      expenseValue = expenseValue * PARTIAL_FACTOR;
    }
    mandatoryExpensesTotal += expenseValue;
  })
  return mandatoryExpensesTotal
}

export function calculateRetention(anualIncome) {
  return (anualIncome * RETENTION_FACTOR) / 100;
}

function buildStep(factor, maxAmount, discount) {
  return { factor, maxAmount, discount };
}

export const STEPS = [
  buildStep(0, 13.5 * UTA, 0),
  buildStep(0.04, 30 * UTA, 0.54 * UTA),
  buildStep(0.08, 50 * UTA, 1.74 * UTA),
  buildStep(0.135, 70 * UTA, 4.49 * UTA),
  buildStep(0.23, 90 * UTA, 11.14 * UTA),
  buildStep(0.304, 120 * UTA, 17.8 * UTA),
  buildStep(0.35, 150 * UTA, 23.92 * UTA),
  buildStep(0.4, Number.MAX_VALUE, 30.67 * UTA),
];

export function getTaxStep(taxableIncome) {
  return STEPS.find(({ maxAmount }) => taxableIncome <= maxAmount);
}

export function calculateTaxes(taxableIncome) {
  const { factor, discount } = getTaxStep(taxableIncome);
  return factor * taxableIncome - discount;
}

export function calculateDebt(mandatoryExpense, taxes, retention) {
  return taxes - retention + mandatoryExpense;
}

export function calculate(monthlyIncome) {
  const anualIncome = 12 * monthlyIncome;
  const expenses = calculateExpenses(anualIncome);
  const taxableIncome = anualIncome - expenses;
  const mandatoryExpense = getMandatoryExpenses(anualIncome);
  const partialMandatoryExpense = getMandatoryExpenses(anualIncome, true);
  const retention = calculateRetention(anualIncome);
  const taxes = calculateTaxes(taxableIncome);
  const debt = calculateDebt(mandatoryExpense, taxes, retention);
  const partialDebt = calculateDebt(partialMandatoryExpense, taxes, retention);
  return {
    anualIncome,
    expenses,
    taxableIncome,
    mandatoryExpense,
    retention,
    taxes,
    debt,
    partialDebt,
  };
}
