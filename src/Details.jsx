import React from "react";
import {
  buscarTramoImpositivo,
  calcularSueldoImponible,
  obtenerConfiguracion,
} from "tax-cl";
import { formatAmount } from "./numbers";
import Amount from "./Amount";
import Assumptions from "./Assumptions";
import Emoji from "./Emoji";

export default function Details({ result }) {
  const { TRAMOS_IMPOSITIVOS, TOPE_IMPONIBLE_MENSUAL, RETENCION, UF } =
    obtenerConfiguracion();

  const TOPE_IMPONIBLE_ANUAL_EN_UF = TOPE_IMPONIBLE_MENSUAL * 12;
  const {
    sueldoAnual,
    gastos,
    sueldoTributable,
    montoCotizacionesObligatorias,
    retencion,
    impuestos,
    deuda,
    cotizaciones,
  } = result;
  const activeStep = buscarTramoImpositivo(sueldoTributable);
  const imponibleCotizaciones = calcularSueldoImponible(sueldoAnual);
  const maximoImponible = UF * TOPE_IMPONIBLE_ANUAL_EN_UF;
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
          A tu favor, tienes la <strong>retención de tus boletas</strong> (el{" "}
          {100 * RETENCION}%), lo cual es <Amount success value={retencion} />
        </p>
        <blockquote>
          Esta retención se usa para pagar impuestos y obligaciones legales
          tales como AFP y salud (fonasa o isapre).
        </blockquote>
        <p>
          En <i>contra</i> tienes los impuestos (
          <Amount danger value={impuestos} />
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
            Gastos presuntos = <Amount value={gastos} /> (30% de tu BRUTO hasta
            un máximo de 15UTA)
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
              const from =
                index === 0
                  ? 0
                  : TRAMOS_IMPOSITIVOS[index - 1].montoMaximo + 0.01;
              const to = step.montoMaximo;
              return (
                <tr
                  className={
                    sueldoTributable > from && sueldoTributable < to
                      ? "active"
                      : ""
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
        <h3>Cotizaciones</h3>
        <p>
          Las cotizaciones se calculan sobre tu <strong>Bruto Imponible</strong>{" "}
          el cual es igual al 80% de tu bruto, hasta un máximo de{" "}
          {TOPE_IMPONIBLE_ANUAL_EN_UF.toFixed(2)} UF (aproximadamente{" "}
          <Amount value={maximoImponible} />
          ).
        </p>
        <p>
          {imponibleCotizaciones > maximoImponible
            ? "Como tu bruto imponible es mayor al tope, se considera el tope como base para el cálculo de las cotizaciones."
            : "Como tu bruto imponible es menor al tope, se considera tu bruto imponible como base para el cálculo de las cotizaciones."}
        </p>
        <p>
          Por lo tanto, <strong>Bruto Imponible</strong> ={" "}
          <Amount value={imponibleCotizaciones} />
        </p>
        <p>
          El monto total que se va a tus cotizaciones es{" "}
          <Amount value={montoCotizacionesObligatorias} />. A continuación el
          detalle:
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
            {cotizaciones.total.map(({ name, percent }) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{Number(percent.toFixed(2))}%</td>
                <td>
                  {formatAmount(
                    (calcularSueldoImponible(sueldoAnual) * percent) / 100
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <blockquote>
          Nota: La AFP se paga con el remanente de tu retención. Es por eso que el porcentaje de cotización es menor al 10%.
        </blockquote>
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
            {formatAmount(montoCotizacionesObligatorias)} +{" "}
            {formatAmount(impuestos)} - {formatAmount(retencion)} ={" "}
            {formatAmount(deuda)}
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
