import React from "react";
import { obtenerConfiguracion, COTIZACIONES_OBLIGATORIAS } from "tax-cl";
import Amount from "./Amount";

const { UF, OPERACION_RENTA } = obtenerConfiguracion();
const { percent: AFP } = COTIZACIONES_OBLIGATORIAS.find(({ name }) => name === "AFP");

export default function Assumptions() {
  return (
    <>
      <h2>Supuestos para el cálculo:</h2>
      <ul>
        <li>
          Los cálculos considera valores para la <strong>Operación Renta {OPERACION_RENTA}</strong>
        </li>
        <li>
          Valor UF: <Amount value={UF} /> (31 diciembre {OPERACION_RENTA - 1})
        </li>
        <li>Eres trabajador independiente</li>
        <li>Estás en el tramo etario que paga retenciones.</li>
        <li>
          No tienes otras fuentes de ingreso (inversiones, sociedades,
          viviendas, etc).
        </li>
        <li>No tienes APV-B.</li>
        <li>{(AFP - 10).toFixed(2)}% es la comisión de tu AFP.</li>
        <li>
          Tus gastos se calculan en base a "gastos supuestos" (30% de tu bruto)
        </li>
      </ul>
    </>
  );
}
