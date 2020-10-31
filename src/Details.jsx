import React from "react";
import {
  obtenerTramoImpositivo,
  cotizacionesObligatorias,
  TOPE_IMPONIBLE_UF,
  calcularSueldoImponible,
  TRAMOS_IMPOSITIVOS,
} from "tax-cl";
import { formatAmount } from "./numbers";
import Amount from "./Amount";
import Assumptions from "./Assumptions";
import Emoji from "./Emoji";

export default function Details({ result }) {
  const {
    sueldoAnual,
    gastos,
    sueldoTributable,
    montoCotizacionesObligatorias,
    retencion,
    impuestos,
    deuda,
  } = result;
  const activeStep = obtenerTramoImpositivo(sueldoTributable);
  return (
    <div className="dark">
      <section>
        <h2>
          Detalle del cálculo <Emoji value="✍️" />
        </h2>
        <p>
          Tu <strong>ingreso bruto anual</strong> es {formatAmount(sueldoAnual)}
        </p>
        <p>
          A tu favor, tienes la <strong>retención de tus boletas</strong> (el
          10.75%), lo cual es <Amount success value={retencion} />
        </p>
        <blockquote>
          Esta retención se usa para pagar impuestos y obligaciones legales
          tales como AFP y salud (fonasa o isapre).
        </blockquote>
        <p>
          En <i>contra</i> tienes los impuestos (<Amount danger value={impuestos} />
          ) y las obligaciones legales (
          <Amount danger value={montoCotizacionesObligatorias} />)
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
            Gastos presuntos = <Amount value={gastos} /> (30% de tu BRUTO
            hasta un máximo de 15UTA)
          </li>
        </ul>
        <p>
          Por lo tanto, tu <strong>Base Tributable</strong> es{" "}
          <Amount value={sueldoTributable} />
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
            {TRAMOS_IMPOSITIVOS.map((step, index) => {
              const from = index === 0 ? 0 : TRAMOS_IMPOSITIVOS[index - 1].montoMaximo + 0.01;
              const to = step.montoMaximo;
              return (
                <tr
                  className={
                    sueldoTributable > from && sueldoTributable < to ? "active" : ""
                  }
                  key={`step-${index}`}
                >
                  <td>{formatAmount(from)}</td>
                  <td>
                    {index === TRAMOS_IMPOSITIVOS.length - 1 ? (
                      <Emoji value="🚀" />
                    ) : (
                      formatAmount(to)
                    )}
                  </td>
                  <td>{step.factor}</td>
                  <td>{formatAmount(step.descuento)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        Así que: impuesto ={" "}
        <code>
          {activeStep.factor} x {formatAmount(sueldoTributable)} -{" "}
          {formatAmount(activeStep.descuento)} = {formatAmount(impuestos)}
        </code>
        <h3>Descuentos Legales</h3>
        <p>
          Los descuentos legales se calculan sobre tu{" "}
          <strong>Bruto Imponible</strong> el cual es igual al 80% de tu bruto,
          hasta un máximo de {TOPE_IMPONIBLE_UF.toFixed(2)} (UF).
        </p>
        <p>
          Por lo tanto, <strong>Bruto Imponible</strong> ={" "}
          <Amount value={calcularSueldoImponible(sueldoAnual)} />
        </p>
        <p>
          Tu monto total de descuento legal es{" "}
          <Amount value={montoCotizacionesObligatorias} />. A continuación el detalle:
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
            {cotizacionesObligatorias.map(({ name, percent }) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{percent}%</td>
                <td>
                  {formatAmount((calcularSueldoImponible(sueldoAnual) * percent) / 100)}
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
            <Amount success value={retencion} />
          </li>
          <li>
            Tienes que pagar impuestos: <Amount danger value={impuestos} />
          </li>
          <li>
            Tienes que pagar obligaciones legales:{" "}
            <Amount danger value={montoCotizacionesObligatorias} />
          </li>
        </ul>
        <p>
          Deuda ={" "}
          <code>
            {formatAmount(retencion)} - {formatAmount(impuestos)} -{" "}
            {formatAmount(montoCotizacionesObligatorias)} = {formatAmount(deuda)}
          </code>
        </p>
        <p>
          {deuda > 0
            ? `Como este resultado es > 0, debes ${formatAmount(deuda)}`
            : `Como este resultado es < 0, tendrás una devolución de ${formatAmount(
                deuda
              )}`}
        </p>
        <Assumptions />
      </section>
    </div>
  );
}
