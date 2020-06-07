const UTA = 595476; // UTA december 2019
const UF = 28309.94; // UF 31 december 2019
const MAX_EXPENSE = 15 * UTA;
const RETENTION_FACTOR = 10.75;
const MANDATORY_MAX_EXPENSE = 12 * 80.2 * UF; // anual

function min(a, b) {
  return a > b ? b : a;
}

export function calculateExpenses(anualIncome) {
  const expenses = anualIncome * 0.3;
  return min(expenses, MAX_EXPENSE);
}

const DISABILITY_AND_SURVIVAL_INSURANCE = 1.53;
const ACCIDENTS_INSURANCE = 0.91;
const ACCOMPANIMENT_INSURANCE = 0.02;
const HEALTHCARE = 7;
const RETIREMENT = 10.77; // is not really constant

export function mandatoryExpenses(income) {
  const allFactors = [
    DISABILITY_AND_SURVIVAL_INSURANCE,
    ACCIDENTS_INSURANCE,
    ACCOMPANIMENT_INSURANCE,
    HEALTHCARE,
    RETIREMENT,
  ];

  const factorSum = allFactors.reduce((currentSum, factor) => currentSum + factor, 0);
  const taxableIncome = min(0.8 * income, MANDATORY_MAX_EXPENSE);
  return factorSum * taxableIncome / 100;
}

export function calculateRetention(anualIncome) {
  return anualIncome * RETENTION_FACTOR / 100;
}

function buildStep(factor, maxAmount, discount) {
  return { factor, maxAmount, discount };
}

const STEPS = [
  buildStep(0,     13.5 * UTA,          0),
  buildStep(0.04,  30   * UTA,         0.54  * UTA),
  buildStep(0.08,  50   * UTA,         1.74  * UTA),
  buildStep(0.135, 70   * UTA,         4.49  * UTA),
  buildStep(0.23,  90   * UTA,         11.14 * UTA),
  buildStep(0.304, 120  * UTA,         17.8  * UTA),
  buildStep(0.35,  150  * UTA,         23.92 * UTA),
  buildStep(0.4,   Number.MAX_VALUE,   30.67 * UTA),
];

function getTaxStep(taxableIncome) {
  return STEPS.find(({ maxAmount }) => taxableIncome <= maxAmount);
}

export function calculateTaxes(taxableIncome) {
  const { factor, discount } = getTaxStep(taxableIncome);
  return factor * taxableIncome - discount;
}

export function calculateDebt(mandatoryExpense, taxes, retention) {
  return taxes - retention + mandatoryExpense;
}
