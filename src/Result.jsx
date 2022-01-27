import React from "react";
import { calcular, configurarDeclaracion } from "tax-cl";
import { formatAmount } from "./numbers";
import Details from "./Details";

configurarDeclaracion(new Date().getFullYear() + 1);

export default function Result({ income }) {
  const result = calcular(income);
  const { deuda, deudaModalidadParcial } = result;
  return (
    <>
      <div className="light">
        <section className="result">
          {deuda > 0 ? (
            <>
              Tendrás que <strong>pagar</strong> aproximadamente{" "}
              <strong>{formatAmount(deuda)}</strong>
            </>
          ) : (
            <>
              Recibirás una <strong>devolución</strong> de aproximadamente{" "}
              <strong>{formatAmount(-deuda)}</strong>
            </>
          )}
        <hr/>
          <small>Si eliges una cotización parcial,</small>
          <br/>
          {deudaModalidadParcial > 0 ? (
            <small>
              tendrás que <strong>pagar</strong> aproximadamente{" "}
              <strong>{formatAmount(deudaModalidadParcial)}</strong>
            </small>
          ) : (
            <small>
              recibirás una <strong>devolución</strong> de aproximadamente{" "}
              <strong>{formatAmount(-deudaModalidadParcial)}</strong>
            </small>
          )}
        </section>
      </div>
      <Details result={result} />
    </>
  );
}
