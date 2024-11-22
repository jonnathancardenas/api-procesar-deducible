const express = require('express');
const app = express();
app.use(express.json());

app.listen(8000);

const procesarDeducible = (req) => {
  const text = req.payload.text;

  const patroneDeducibles = /(\*|-)\s*(.*?)(?=\s*\*|\s*-|$)/g;

  let encontrado;
  const listaEncontrados = [];

  while ((encontrado = patroneDeducibles.exec(text))) {
    listaEncontrados.push(encontrado[2]);
  }
  const listaDeducibles = listaEncontrados.length > 0 ? listaEncontrados : [ text ];
  const deducibles = listaDeducibles.map((deducible) => {
    let patronDeducible = /(\d+(\.\d+)?)%\s*del monto a indemnizar/i.exec(deducible);
    let valorDeducible = patronDeducible ? parseInt(patronDeducible[1]) : 0;

    patronDeducible = /(\d+(\.\d+)?)%\s*del monto indemnizable/i.exec(deducible);
    valorDeducible = patronDeducible ? parseInt(patronDeducible[1]) : valorDeducible;
    patronDeducible = /(\d+(\.\d+)?)%\s*del monto del siniestro/i.exec(deducible);
    valorDeducible = patronDeducible ? parseInt(patronDeducible[1]) : valorDeducible;

    const patronCopago = /mínimo\s+(US\$|S\/)\s*(\d+(\.\d+)?)/i.exec(deducible);
    const valorCopago = patronCopago ? parseInt(patronCopago[2]) : 0;

    let moneda = patronCopago[1];
    if (moneda === 'US$') {
      moneda = 'USD';
    } else if (moneda === 'S/') {
      moneda = 'SOL';
    }

    const tipo = /MULTIMARCA/i.test(deducible.toUpperCase()) ? "Multimarca" : "NO TIPO";
    const patronMarca = /Marca([^\n]*)\n/i.exec(deducible);
    const marca = patronMarca ? patronMarca[1].trim() : "NO MARCA";
    const patronTaller = /taller(es)? ([^\n]*)\n/i.exec(deducible);
    const taller = patronTaller ? patronTaller[2] : "NO TALLER";

    return {
      deducible: valorDeducible,
      copago: valorCopago,
      moneda: moneda,
      tipo: tipo,
      marca: marca,
      taller: taller
    };
  });

  const resultado = {
    payload: deducibles
  };
  return { requestBody: resultado };
};

app.post('/procesar-deducible', (req, res) => {
  res.json(procesarDeducible(req));
});

module.exports = { app, procesarDeducible };