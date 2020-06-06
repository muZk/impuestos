const UTA = 604464; // 12 UTM
const MAX_EXPENSE = 15 * UTA;

export function calculateExpenses(anualIncome) {
  const expenses = anualIncome * 0.3;
  return expenses > MAX_EXPENSE ? MAX_EXPENSE : expenses;
}

const DISABILITY_AND_SURVIVAL_INSURANCE = 1.53;
const ACCIDENTS_INSURANCE = 0.91;
const ACCOMPANIMENT_INSURANCE = 0.02;
const HEALTHCARE = 7;
const RETIREMENT = 10.77; // is not really constant

export function mandatoryExpenses(taxableIncome) {
  const allFactors = [
    DISABILITY_AND_SURVIVAL_INSURANCE,
    ACCIDENTS_INSURANCE,
    ACCOMPANIMENT_INSURANCE,
    HEALTHCARE,
    RETIREMENT,
  ];

  const factorSum = allFactors.reduce((currentSum, factor) => currentSum + factor, 0);

  return factorSum * taxableIncome / 100;
}

const RETENTION_FACTOR = 10.75;

export function calculateRetention(anualIncome) {
  return anualIncome * RETENTION_FACTOR / 100;
}

function buildStep(factor, maxAmount, discount) {
  return { factor, maxAmount, discount };
}

const STEPS = [
  buildStep(0,     7833186,          0),
  buildStep(0.04,  17407080,         313327.44),
  buildStep(0.08,  29011800,         1009610.64),
  buildStep(0.135, 40616520,         2605259.64),
  buildStep(0.23,  52221240,         6463829.04),
  buildStep(0.304, 69628320,         10328200.8),
  buildStep(0.35,  87035400,         13531103.52),
  buildStep(0.4,   Number.MAX_VALUE, 17882873.52),
];

function getTaxStep(taxableIncome) {
  return STEPS.find(({ maxAmount }) => taxableIncome <= maxAmount);
}

export function calculateTaxes(taxableIncome) {
  const { factor, discount } = getTaxStep(taxableIncome);
  return factor * taxableIncome - discount;
}

export function calculateDebt(mandatoryExpense, taxes, retention) {
  return (mandatoryExpense + taxes) - retention;
}
