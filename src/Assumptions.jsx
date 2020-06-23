import React from "react";
import { UF } from "./calculator";
import Amount from "./Amount";

export default function Assumptions() {
  return (
    <>
      <h2>Supuestos para el cálculo:</h2>
      <ul>
        <li>
          Valor UF: <Amount value={UF} /> (31 diciembre 2019)
        </li>
        <li>Eres trabajador independiente</li>
        <li>Estás en el tramo etario que paga retenciones.</li>
        <li>
          No tienes otras fuentes de ingreso (inversiones, sociedades,
          viviendas, etc).
        </li>
        <li>No tienes APV-B.</li>
        <li>Optas por cobertura TOTAL.</li>
        <li>0.77 es la comisión de tu AFP.</li>
        <li>
          Tus gastos se calculan en base a "gastos supuestos" (30% de tu bruto)
        </li>
      </ul>
    </>
  );
}
