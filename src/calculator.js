const UTA = 595476; // UTA december 2019
export const UF = 28309.94; // UF 31 december 2019
const TOPE_DE_GASTOS = 15 * UTA;
const PORCENTAJE_RETENCION = 10.75;
export const TOPE_IMPONIBLE_UF = 12 * 80.2; // 80.2
export const TOPE_IMPONIBLE = TOPE_IMPONIBLE_UF * UF; // anual
const FACTOR_COBERTURA_PARCIAL = 0.27 //year 2020

function min(a, b) {
  return a > b ? b : a;
}

export function calcularGastos(sueldoAnual) {
  const gastos = sueldoAnual * 0.3;
  return min(gastos, TOPE_DE_GASTOS);
}

export const cotizacionesObligatorias = [
  { 
    name: "Seguro de invalidez y sobrevivencia", 
    percent: 1.53,
    variable: false,
  },
  {
    name:
      "Seguro de la ley de accidentes del trabajo y enfermedades profesionales",
    percent: 0.91,
    variable: false,
  },
  { 
    name: "Seguro de acompañamiento niños y niñas", 
    percent: 0.02,
    variable: false,
  },
  { 
    name: "Salud", 
    percent: 7,
    variable: true,
  },
  { 
    name: "AFP", 
    percent: 10, 
    variable: true,
  },
  { 
    name: "Comisión AFP", 
    percent: 0.77,
    variable: false
  },
];

export function calcularSueldoImponible(sueldoAnual) {
  return min(0.8 * sueldoAnual, TOPE_IMPONIBLE);
}

export function calcularCotizacionesObligatorias(ingresos, cotizacionParcial = false){
  let totalCotizacionesObligatorias = 0;
  cotizacionesObligatorias.forEach((cotizacion) => {
    let montoCotizacion = (calcularSueldoImponible(ingresos) * cotizacion.percent) / 100;
    if(cotizacion.variable && cotizacionParcial){
      montoCotizacion = montoCotizacion * FACTOR_COBERTURA_PARCIAL;
    }
    totalCotizacionesObligatorias += montoCotizacion;
  })
  return totalCotizacionesObligatorias
}

export function calcularRetencion(sueldoAnual) {
  return (sueldoAnual * PORCENTAJE_RETENCION) / 100;
}

function construirTramoImpositivo(factor, montoMaximo, descuento) {
  return { factor, montoMaximo, descuento };
}

export const TRAMOS_IMPOSITIVOS = [
  construirTramoImpositivo(0, 13.5 * UTA, 0),
  construirTramoImpositivo(0.04, 30 * UTA, 0.54 * UTA),
  construirTramoImpositivo(0.08, 50 * UTA, 1.74 * UTA),
  construirTramoImpositivo(0.135, 70 * UTA, 4.49 * UTA),
  construirTramoImpositivo(0.23, 90 * UTA, 11.14 * UTA),
  construirTramoImpositivo(0.304, 120 * UTA, 17.8 * UTA),
  construirTramoImpositivo(0.35, 150 * UTA, 23.92 * UTA),
  construirTramoImpositivo(0.4, Number.MAX_VALUE, 30.67 * UTA),
];

export function obtenerTramoImpositivo(sueldoTributable) {
  return TRAMOS_IMPOSITIVOS.find(({ montoMaximo }) => sueldoTributable <= montoMaximo);
}

export function calcularImpuestos(sueldoTributable) {
  const { factor, descuento } = obtenerTramoImpositivo(sueldoTributable);
  return factor * sueldoTributable - descuento;
}

export function calcularDeuda(cotizacionesObligatorias, impuestos, retencion) {
  return impuestos - retencion + cotizacionesObligatorias;
}

export function calcular(sueldoMensual) {
  const sueldoAnual = 12 * sueldoMensual;
  const gastos = calcularGastos(sueldoAnual);
  const sueldoTributable = sueldoAnual - gastos;
  const montoCotizacionesObligatorias = calcularCotizacionesObligatorias(sueldoAnual);
  const cotizacionesParciales = calcularCotizacionesObligatorias(sueldoAnual, true);
  const retencion = calcularRetencion(sueldoAnual);
  const impuestos = calcularImpuestos(sueldoTributable);
  const deuda = calcularDeuda(montoCotizacionesObligatorias, impuestos, retencion);
  const deudaModalidadParcial = calcularDeuda(cotizacionesParciales, impuestos, retencion);
  return {
    sueldoAnual,
    gastos,
    sueldoTributable,
    montoCotizacionesObligatorias,
    retencion,
    impuestos,
    deuda,
    deudaModalidadParcial,
  };
}
