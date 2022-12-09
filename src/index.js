const Afip = require("@afipsdk/afip.js");
const path = require("path");
const fs = require('fs');
const transactions = require("../res/transactions.json");

const CUIT = 0;
const FACTURA_C = 11;
const SERVICIOS = 2;
const DOC_TIPO_CONSUMIDOR_FINAL = 99;
const DNI = 0; // 0 para consumidores finales
const PUNTO_DE_VENTA = 0;
const FECHA_INICIO_SERVICIOS = 20221101;
const FECHA_FIN_SERVICIOS = 20221130;

const resFolder = path.resolve("./res");

const options = {
  CUIT,
  cert: "cert.crt",
  key: "private.key",
  production: true,
  res_folder: resFolder,
  ta_folder: resFolder,
};

const afip = new Afip(options);

const billsToGenerate = transactions.map((t) => {
  const is20000Bill = typeof t === "string";
  const amount = is20000Bill ? 20000 : t.amount;
  return {
    CantReg: 1, // Cantidad de comprobantes a registrar
    PtoVta: PUNTO_DE_VENTA, // Punto de venta
    CbteTipo: FACTURA_C, // Tipo de comprobante (ver tipos disponibles)
    Concepto: SERVICIOS, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
    DocTipo: DOC_TIPO_CONSUMIDOR_FINAL, // Tipo de documento del comprador (99 consumidor final, ver tipos disponibles)
    DocNro: DNI, // Número de documento del comprador (0 consumidor final)
    CbteDesde: 1, // Número de comprobante o numero del primer comprobante en caso de ser mas de uno
    CbteHasta: 1, // Número de comprobante o numero del último comprobante en caso de ser mas de uno
    CbteFch: 20221130, // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
    ImpTotal: amount, // Importe total del comprobante
    ImpTotConc: 0, // Importe neto no gravado
    ImpNeto: amount, // Importe neto gravado
    ImpOpEx: 0, // Importe exento de IVA
    ImpIVA: 0, //Importe total de IVA
    ImpTrib: 0, //Importe total de tributos
    MonId: "PES", //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos)
    MonCotiz: 1, // Cotización de la moneda usada (1 para pesos argentinos)
    FchServDesde: FECHA_INICIO_SERVICIOS, // (Opcional) Fecha de inicio del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
    FchServHasta: FECHA_FIN_SERVICIOS, // (Opcional) Fecha de fin del servicio (yyyymmdd), obligatorio para Concepto 2 y 3,
    FchVtoPago: 20221230,
  };
});

(async () => {
  for (const bill of billsToGenerate) {
    const generatedBill = await afip.ElectronicBilling.createNextVoucher(bill);
    console.log(generatedBill);
    const billPath = `${resFolder}/facturas/${generatedBill.CAE}.json`;
    fs.writeFileSync(billPath, JSON.stringify(generatedBill));
  }
})();
