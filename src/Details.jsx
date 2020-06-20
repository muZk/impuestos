import React from "react";
import {
  getTaxStep,
  mandatoryExpenseFactors,
  MANDATORY_MAX_EXPENSE_UF,
  taxableGross,
  STEPS,
} from "./calculator";
import { formatAmount } from "./numbers";
import Amount from "./Amount";
import Assumptions from "./Assumptions";
import Emoji from "./Emoji";

export default function Details({ result }) {
  const {
    anualIncome,
    expenses,
    taxableIncome,
    mandatoryExpense,
    retention,
    taxes,
    debt,
  } = result;
  const activeStep = getTaxStep(taxableIncome);
  return (
    <div className="dark">
      <section>
        <h2>
          Detalle del cálculo <Emoji value="✍️" />
        </h2>
        <p>
          Tu <strong>ingreso bruto anual</strong> es {formatAmount(anualIncome)}
        </p>
        <p>
          A tu favor, tienes la <strong>retención de tus boletas</strong> (el
          10.75%), lo cual es <Amount success value={retention} />
        </p>
        <blockquote>
          Esta retención se usa para pagar impuestos y obligaciones legales
          tales como APF y salud (fonasa o isapre).
        </blockquote>
        <p>
          En <i>contra</i> tienes los impuestos (<Amount danger value={taxes} />
          ) y las obligaciones legales (
          <Amount danger value={mandatoryExpense} />)
        </p>
        <h3>Cálculo del impuesto</h3>
        <p>
          El <strong>impuesto a la renta</strong> se calcula sobre tu{" "}
          <strong>Base Tributable</strong>:
        </p>
        <ul>
          <li>
            Base Tributable = <strong>Tu bruto</strong> -{" "}
            <strong>Gastos presuntos</strong>
          </li>
          <li>
            Gastos presuntos = <Amount value={expenses} /> (30% de tu BRUTO
            hasta un máximo de 15UTA)
          </li>
        </ul>
        <p>
          Por lo tanto, tu <strong>Base Tributable</strong> es{" "}
          <Amount value={taxableIncome} />
        </p>
        <p>
          Con tu base tributable, se calcula el impuesto dependiendo del tramo
          en que te encuentres según la siguiente tabla:
        </p>
        <table>
          <thead>
            <tr>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Factor</th>
              <th>Rebaja</th>
            </tr>
          </thead>
          <tbody>
            {STEPS.map((step, index) => {
              const from = index === 0 ? 0 : STEPS[index - 1].maxAmount + 0.01;
              const to = step.maxAmount;
              return (
                <tr
                  className={
                    taxableIncome > from && taxableIncome < to ? "active" : ""
                  }
                  key={`step-${index}`}
                >
                  <td>{formatAmount(from)}</td>
                  <td>
                    {index === STEPS.length - 1 ? (
                      <Emoji value="🚀" />
                    ) : (
                      formatAmount(to)
                    )}
                  </td>
                  <td>{step.factor}</td>
                  <td>{formatAmount(step.discount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        Así que: impuesto ={" "}
        <code>
          {activeStep.factor} x {formatAmount(taxableIncome)} -{" "}
          {formatAmount(activeStep.discount)} = {formatAmount(taxes)}
        </code>
        <h3>Descuentos Legales</h3>
        <p>
          Los descuentos legales se calculan sobre tu{" "}
          <strong>Bruto Imponible</strong> el cual es igual al 80% de tu bruto,
          hasta un máximo de {MANDATORY_MAX_EXPENSE_UF.toFixed(2)} (UF).
        </p>
        <p>
          Por lo tanto, <strong>Bruto Imponible</strong> ={" "}
          <Amount value={taxableGross(anualIncome)} />
        </p>
        <p>
          Tu monto total de descuento legal es{" "}
          <Amount value={mandatoryExpense} />. A continuación el detalle:
        </p>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>% de descuento</th>
              <th>Monto a pagar</th>
            </tr>
          </thead>
          <tbody>
            {mandatoryExpenseFactors.map(({ name, factor }) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{factor}%</td>
                <td>
                  {formatAmount((taxableGross(anualIncome) * factor) / 100)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Cálculo Final</h3>
        Resumiendo tu situación:
        <ul>
          <li>
            A favor, tienes tus retenciones que son{" "}
            <Amount success value={retention} />
          </li>
          <li>
            Tienes que pagar impuestos: <Amount danger value={taxes} />
          </li>
          <li>
            Tienes que pagar obligaciones legales:{" "}
            <Amount danger value={mandatoryExpense} />
          </li>
        </ul>
        <p>
          Deuda ={" "}
          <code>
            {formatAmount(retention)} - {formatAmount(taxes)} -{" "}
            {formatAmount(mandatoryExpense)} = {formatAmount(debt)}
          </code>
        </p>
        <p>
          {debt > 0
            ? `Como este resultado es > 0, debes ${formatAmount(debt)}`
            : `Como este resultado es < 0, tendrás una devolución de ${formatAmount(
                debt
              )}`}
        </p>
        <Assumptions />
      </section>
    </div>
  );
}
