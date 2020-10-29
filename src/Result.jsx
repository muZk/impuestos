import React from "react";
import { calculate } from "./calculator";
import { formatAmount } from "./numbers";
import Details from "./Details";

export default function Result({ income }) {
  const result = calculate(income);
  const { debt, partialDebt } = result;
  return (
    <>
      <div className="light">
        <section className="result">
          {debt > 0 ? (
            <>
              Tendrás que <strong>pagar</strong> aproximadamente{" "}
              <strong>{formatAmount(debt)}</strong>
            </>
          ) : (
            <>
              Recibirás una <strong>devolución</strong> de aproximadamente{" "}
              <strong>{formatAmount(-debt)}</strong>
            </>
          )}
        <hr/>
          <small>Si eliges una cotización parcial,</small>
          <br/>
          {partialDebt > 0 ? (
            <small>
              tendrás que <strong>pagar</strong> aproximadamente{" "}
              <strong>{formatAmount(partialDebt)}</strong>
            </small>
          ) : (
            <small>
              recibirás una <strong>devolución</strong> de aproximadamente{" "}
              <strong>{formatAmount(-partialDebt)}</strong>
            </small>
          )}
        </section>
      </div>
      <Details result={result} />
    </>
  );
}
