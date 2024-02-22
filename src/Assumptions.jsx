import React from "react";
import { obtenerConfiguracion } from "tax-cl";
import Amount from "./Amount";

export default function Assumptions() {
  const { UF, OPERACION_RENTA } = obtenerConfiguracion();

  return (
    <>
      <h2>Supuestos para el cálculo:</h2>
      <ul>
        <li>
          Los cálculos considera valores para la{" "}
          <strong>Operación Renta {OPERACION_RENTA}</strong> (considera tus
          ingresos del año {OPERACION_RENTA - 1})
        </li>
        <li>
          Valor UF: <Amount value={UF} /> (31 diciembre {OPERACION_RENTA - 1})
        </li>
        <li>Eres trabajador independiente</li>
        <li>
          Tienes la obligación a cotizar (hay personas que no deben hacerlo).
        </li>
        <li>
          No tienes otras fuentes de ingreso (inversiones, sociedades,
          viviendas, etc).
        </li>
        <li>No tienes APV-B.</li>
        <li>El porcentaje de la AFP incluye la comisión.</li>
        <li>
          Tus gastos se calculan en base a "gastos presuntos" (30% de tu bruto,
          hasta un máximo de 15 UTA)
        </li>
      </ul>
    </>
  );
}
