import React from "react";
import { calcular } from "tax-cl";
import { formatAmount } from "./numbers";
import Details from "./Details";

export default function Result({ income }) {
  const result = calcular(income);
  const { deuda, deudaModalidadParcial } = result;
  const isPaying = deuda > 0;
  const isPayingPartial = deudaModalidadParcial > 0;

  return (
    <>
      <div className="result-section">
        <section className="result">
          <div className={`result__card ${isPaying ? 'result__card--pay' : 'result__card--refund'}`}>
            <span className="result__label">
              {isPaying ? 'Tendrás que pagar' : 'Recibirás de devolución'}
            </span>
            <span className="result__amount">
              {formatAmount(Math.abs(deuda))}
            </span>
            <span className="result__approx">aproximadamente</span>
          </div>

          <div className="result__divider">
            <span>cotización parcial</span>
          </div>

          <div className={`result__card result__card--secondary ${isPayingPartial ? 'result__card--pay' : 'result__card--refund'}`}>
            <span className="result__label">
              {isPayingPartial ? 'Pagarías' : 'Recibirías'}
            </span>
            <span className="result__amount">
              {formatAmount(Math.abs(deudaModalidadParcial))}
            </span>
          </div>
        </section>
      </div>
      <Details result={result} />
    </>
  );
}
