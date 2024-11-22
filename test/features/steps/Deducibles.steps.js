const { defineFeature, loadFeature } = require('jest-cucumber');
const feature = loadFeature('../Deducibles.feature', { loadRelativePath: true, errors: true });
const { procesarDeducible } = require('../../../app');

defineFeature(feature, test => {
  test('Póliza con deducible texto plano', ({ given, when, then }) => {
    let request;
    let resultado;

    given(/^la póliza tiene un deducible en forma del (.+)$/, (texto) => {
      request = require(`./../input/${texto}.json`);
    });

    when('ejecutamos el conversor de deducible', () => {
      resultado = procesarDeducible(request).requestBody;
    });

    then(/^obtenemos la parametrización del deducible en (.+)$/, (detalle) => {
      expect(resultado).toEqual(require(`../output/${detalle}.json`));
    });
  });
});