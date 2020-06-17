import React, { useState } from "react";
import Result from "./Result";

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
      <section>
        <div className="hero">
          <div className="text">
            <h1>
              Calcula cuánto tienes que pagar de impuestos el 2021{" "}
              <span role="img" aria-label="Bandera Chilena">
                🇨🇱
              </span>
            </h1>
            <p>
              Solo ingresa tu <strong>sueldo bruto mensual</strong>
            </p>
            <div className="inputs">
              <input type="number" value={income} onChange={onChange} />
              <button onClick={() => setShowResults(true)} type="submit">
                Calcular
              </button>
            </div>
          </div>
        </div>
      </section>
      {showResults && <Result income={income} />}
    </>
  );
}

export default App;
