import React from "react";
import { calculate } from "./calculator";
import { formatAmount } from "./numbers";
import Details from "./Details";

export default function Result({ income }) {
  const result = calculate(income);
  const { debt } = result;
  return (
    <>
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
      </section>
      <Details result={result} />
    </>
  );
}
