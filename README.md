# Impuesto💰: calcula cuanto tienes que pagarle al SII como trabajador independiente

[![Netlify Status](https://api.netlify.com/api/v1/badges/07ee9b81-d3e8-4f42-aa7d-500df46f174d/deploy-status)](https://app.netlify.com/sites/impuestos/deploys)
[![Lighthouse](lighthouse.svg)](https://github.com/muZk/impuestos)

Calculadora que te permite estimar **cuánto tienes que pagar** en tu próxima declaración de impuestos (CHILE 🇨🇱) como **trabajador independiente**.

Live en: https://impuestos.netlify.app/

## Soy trabajador independiente, ¿qué debo pagar?

**Todos los meses:**

Emitir boleta de honorarios y pagar la retención. La retención históricamente era de 10% pero a partir de 2020 es 10.75, monto que irá subiendo según la siguiente tabla:

| 2019 | 2020   | 2021  | 2022   | 2023 | 2024   | 2025  | 2026   | 2027 | 2028 |
|------|--------|-------|--------|------|--------|-------|--------|------|------|
| 10%  | 10.75% | 11.5% | 12.25% | 13%  | 13.75% | 14.5% | 15.25% | 16%  | 17%  |

Sólo eso estás obligado a pagar mes a mes.

**Año a Año:**

Cada año en la operación renta (Abril), debes pagar:

1. Impuesto por tus ingresos (del año anterior)
2. Cotizaciones obligatorias (se pagan adelantadas para que mes a mes no tengas que pagarlas)

El impuesto a pagar depende de tus ingresos (mientras más ganas, mayor % de impuesto tendrás que pagar).

Las cotizaciones obligatorias es un porcentaje de tu "sueldo imponible". El porcentaje a pagar es lo que aparece en la siguiente tabla:

| SEGURO DE INVALIDEZ Y SOBREVIVENCIA                                     | 1.53%              |
|-------------------------------------------------------------------------|--------------------|
| SEGURO DE LA LEY DE ACCIDENTES DEL TRABAJO Y ENFERMEDADES PROFESIONALES | 0.91%              |
| SEGURO DE ACOMPAÑAMIENTO DE NIÑOS Y NIÑAS                               | 0.02%              |
| SALUD                                                                   | 7%                 |
| PENSIONES                                                               | 10% + comision AFP |

## ¿Qué pasa con la retención de la boleta?

La retención de tu boleta (que será 17% el 2028) se usa para pagar tus impuestos, y lo que sobre, para pagar tus cotizaciones obligatorias.

Por eso, *es posible que quedes debiendo plata y tengas que pagar la diferencia en la operación renta!*

## Supuestos para el cálculo

La calculadora solo te pide tu ingreso mensual BRUTO (el monto por el cual haces la boleta) para calcular los impuestos.

Esto quiere decir que hace algunos supuestos:

1. Que estás en el tramo etario que paga impuestos.
2. Que no tienes otras fuentes de ingreso (inversiones, sociedades, viviendas, etc).
3. No tienes APV-B.
4. Optas por covertura TOTAL.
5. 0.77 es la comisión de tu APF.
6. Tus gastos se calculan en base a "gastos supuestos" (30% de tu bruto)

Estos supuestos son razonables para dar un estimado de lo que debes pagar al SII en la operación de renta (o de lo que recibirás como devolución).

## ¿Cómo se hace el cálculo?

El cálculo es: `DEUDA = IMPUESTOS - RETENCION + COTIZACIONES`

Si `DEUDA > 0`, le debes plata al SII. Si `DEUDA < 0`, el SII te debe plata.

### Impuestos

`IMPUESTOS = FACTOR * IMPONIBLE - REBAJA`

- `IMPONIBLE = BRUTO - GASTOS`
  - `BRUTO` es tu bruto anual
  - `GASTOS` es un 30% de tu ingreso bruto, hasta un máximo de 15UTA.
- `FACTOR` y `REBAJA` se sacan de esta tabla en base a `IMPONIBLE`.

Nota: las cotizaciones obligatorias se asumen dentro de `GASTOS`, así que no reducen tu imponible para impuestos.

### Cotizaciones

`COTIZACIONES = (19.46 + COMISION AFP)% de imponible`

El imponible para las cotizaciones es distinto al de impuestos, y es igual al 80% de tu sueldo bruto ([fuente](http://www.sii.cl/ayudas/ayudas_por_servicios/2032-cp-2035.html)) hasta un máximo de 962,4UF anual ([fuente](https://www.spensiones.cl/portal/institucional/594/w3-article-13843.html)).

La calculadora usa comisión 0.77 (AFP Modelo) para hacer el cálculo.

## Extras

- Puedes ver como construí la versión inicial [aquí](https://www.twitch.tv/videos/642524019) (Twitch).
- Si no entiendes nada de lo que escribí aquí, puedes ver [este video](https://www.circuloverde.cl/capitulo-11-la-obligacion-previsional-de-cotizar-de-los-trabajadores-independientes-ley-n-21-133/) donde lo explican más extendidamente.

## Preview

![Vista previea](preview.png)
