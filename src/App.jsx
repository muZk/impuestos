import React, { useState } from "react";
import Result from "./Result";
import Emoji from "./Emoji";

function App() {
  const [income, setIncome] = useState(1400000);
  const [showResults, setShowResults] = useState(false);

  const onChange = (event) => {
    const parsed = event.target.value;
    const value = parseInt(parsed, 10);
    setIncome(isNaN(value) ? income : value);
  };

  return (
    <>
      <div>
        <section className="hero">
          <h1>
            Impuesto
            <Emoji value="💰" />
          </h1>
          <h4>
            Calcula cuánto tienes que pagar de impuestos el 2021{" "}
            <Emoji value="🇨🇱" />
          </h4>
          <p>
            Solo ingresa tu <strong>sueldo bruto mensual</strong>
          </p>
          <div className="inputs">
            <input type="number" value={income} onChange={onChange} />
            <button onClick={() => setShowResults(true)} type="submit">
              <Emoji value="✨" /> Calcular
            </button>
          </div>
        </section>
      </div>
      {showResults && <Result income={income} />}
    </>
  );
}

export default App;
