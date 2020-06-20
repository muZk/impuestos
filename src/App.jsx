import React, { useState, Suspense } from "react";
import Emoji from "./Emoji";
import Loading from "./Loading";

const Result = React.lazy(() => import("./Result"));

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
          <h2>
            Calcula cuánto tienes que pagar de impuestos el 2021{" "}
            <Emoji value="🇨🇱" />
          </h2>
          <p>
            <label htmlFor="income">
              Solo ingresa tu <strong>sueldo bruto mensual</strong>
            </label>
          </p>
          <div className="inputs">
            <input
              id="income"
              type="number"
              value={income}
              onChange={onChange}
            />
            <button onClick={() => setShowResults(true)} type="submit">
              <Emoji value="✨" /> Calcular
            </button>
          </div>
        </section>
      </div>
      {showResults && (
        <Suspense fallback={<Loading />}>
          <Result income={income} />
        </Suspense>
      )}
      <footer>
        <section>
          <p>
            Made with <Emoji value="❤️" /> by{" "}
            <a
              href="https://gomezespejo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nicolás Gómez
            </a>
          </p>
          <p>
            Source Code in{" "}
            <a
              href="https://github.com/muZk/impuestos"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </p>
        </section>
      </footer>
    </>
  );
}

export default App;
