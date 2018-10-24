const chai   = require('chai');
chai.should();
const mongoose = require('mongoose');
const Pago = require('../../app/models/pago');
const mockData=require('../utils');
describe('Pagos', () => {
  before(()=>mongoose.connect('mongodb://localhost:27017/testdb',{useNewUrlParser: true}));
  after(() => mongoose.disconnect());
  afterEach(() => Pago.deleteMany({}));
  it('deberia crear pagoNuevo', async() => {
    let expected=mockData.getPago();
    let result=await Pago.crear(expected);
    expected.referencia.should.be.equal(result.referencia);
  });
  it('deberia crear pagoNuevo reemplazando', async() => {
    let expected=mockData.getPago();
    await Pago.crear(expected);

    expected.monto="42";
    let result=await Pago.crear(expected);
    result.monto.should.be.equal(42);

  });

});
