import React, { useState, Suspense, useEffect } from "react";
import { configurarDeclaracion } from "tax-cl";
import Emoji from "./Emoji";
import Loading from "./Loading";
import HeaderBar from "./HeaderBar";
import YearSelector from "./YearSelector";

const Result = React.lazy(() => import("./Result"));
configurarDeclaracion(getDefaultYear());

function getDefaultYear() {
  // Siempre nos importa la declaración renta del próximo año
  return new Date().getFullYear() + 1
}

function App() {
  const [income, setIncome] = useState(1400000);
  const [showResults, setShowResults] = useState(false);
  const [year, setYear] = useState(() => getDefaultYear());

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const incomeParam = parseInt(queryParams.get("income"));
    const year = parseInt(queryParams.get("year"));
    if (incomeParam) {
      setIncome(incomeParam);
      setShowResults(true);
    }

    if (year) {
      configurarDeclaracion(year);
      setYear(year);
    }
  }, []);

  const handleYearChange = (newYear) => {
    configurarDeclaracion(newYear);
    setYear(newYear);
  };

  const onChange = (event) => {
    const parsed = event.target.value;
    if (parsed === "") {
      setShowResults(false);
      setIncome("");
      return;
    }
    const value = parseInt(parsed, 10);
    setIncome(isNaN(value) ? income : value);
  };

  return (
    <>
      <div>
        <HeaderBar />
        <section className="hero">
          <h1>
            Impuesto
            <Emoji value="💰" />
          </h1>
          <h2>
            Calcula cuánto tienes que pagar de impuestos el{" "}
            <YearSelector year={year} onChange={handleYearChange} />{" "}
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
            Un proyecto de{" "}
            <a
              href="https://trabajoremoto.cl/?utm_campaign=blog-launch&utm_source=impuestos&utm_medium=tools"
              target="_blank"
              rel="noopener noreferrer"
            >
              TrabajoRemoto.cl
            </a>
            {" "}
            <Emoji value="❤️" />
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
