import React, { useState } from 'react';
import { calculateExpenses, mandatoryExpenses, calculateRetention, calculateTaxes, calculateDebt } from './calculator';

const CLPFormat = new Intl.NumberFormat('es', { style: 'currency', currency: 'CLP' });

function formatAmount(number) {
  return CLPFormat.format(number);
}

function App() {
  const [income, setIncome] = useState(1400000);
  const anualIncome = 12 * income;
  const expenses = calculateExpenses(anualIncome);
  const taxableIncome = anualIncome - expenses;
  const mandatoryExpense = mandatoryExpenses(taxableIncome);
  const retention = calculateRetention(anualIncome);
  const taxes = calculateTaxes(taxableIncome);
  const debt = calculateDebt(mandatoryExpense, taxes, retention);

  const onChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setIncome(isNaN(value) ? 0 : value);
  };

  return (
    <section>
      <article>
        <h1>
          Calculadora de impuestos para trabajadores independientes
          {' '}
          <span role="img" aria-label="Bandera Chilena">🇨🇱</span>
        </h1>
        <fieldset>
          <label htmlFor="income">¿Cuál es tu sueldo bruto (Mensual)?</label>
          <input
            id="income"
            type="number"
            value={income}
            onChange={onChange}
          />
        </fieldset>
        <table>
          <tbody>
            <tr>
              <th>Ingreso Bruto Anual</th>
              <td>{formatAmount(anualIncome)}</td>
            </tr>
            <tr>
              <th>Gastos Supuestos</th>
              <td>{formatAmount(expenses)}</td>
            </tr>
            <tr>
              <th>Renta Imponible (para cálculo de impuestos)</th>
              <td>{formatAmount(taxableIncome)}</td>
            </tr>
            <tr>
              <th>Retención de boletas</th>
              <td>{formatAmount(retention)}</td>
            </tr>
            <tr>
              <th>Cotización Obligatoria (AFP, Salud, etc)</th>
              <td>{formatAmount(mandatoryExpense)}</td>
            </tr>
            <tr>
              <th>Impuesto a la renta</th>
              <td>{formatAmount(taxes)}</td>
            </tr>
            <tr>
              <th>DEUDA</th>
              <td>
                <code className={debt > 0 && 'debt'}>
                  {formatAmount(debt)}
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>
  );
}

export default App;
