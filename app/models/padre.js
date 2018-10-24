'use strict';
const mongoose = require('mongoose');
const TAG = 'modelRepresentante|';

const Pago = require('./pago');
const Estudiante = require('./estudiante');

const PadreSchema = new mongoose.Schema({
  nombre: {
    type: String,
    default: '',
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: true,
    default: '',
    trim: true,
  },
  email: {
    type: String,
    default: '',
    trim: true,
  },
  tlf: {
    type: String,
    trim: true,
    default: '',
  },
  pagos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pago',
    },
  ],
  hijos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Estudiantes',
    },
  ],
  createdAt: {type: Date, default: Date.now},
});
/**
 * Validations
 */
PadreSchema.path('nombre').required(true, 'Nombre no puede estar en blanco');
PadreSchema.path('apellido').required(
  true,
  'Apellido no puede estar en blanco'
);
/**
 * Pre-remove hook
 */
PadreSchema.pre('remove', function(callback) {
  this.model('Pago').remove({$in: this.pagos});
  this.model('Estudiante').remove({$in: this.pagos});
});

/**
 * Methods
 */
PadreSchema.methods = {
  agregarHijo: async function(hijoNuevo) {
    let padThis = this;
    let hijo = await Estudiante.crear(hijoNuevo);
    padThis.hijos.addToSet(hijo._id);
    await padThis.save();
    console.log(
      TAG,
      `Se agrego ${hijo.nombre} ${hijo.apellido} a ${padThis.nombre} ${
        padThis.apellido
      }`
    );
    let letmesee = await Estudiante.findById(hijo._id);
    return letmesee;
  },
  agregarPago: async function(pagoNuevo) {
    let padThis = this;
    let pago = await Pago.crear(pagoNuevo);
    padThis.pagos.addToSet(pago._id);
    padThis.save(function(error) {
      if (error) {
        console.error(TAG, ``, error);
      }
      console.log(
        TAG,
        `Se agrego el pago ${pagoNuevo.referencia} del banco ${
          pagoNuevo.banco
        } al Rep:${padThis.nombre} ${padThis.apellido}`
      );
      return pago;
    });
    if (padThis.hijos.length > 0) {
      for (let estId in padThis.hijos) {
        Estudiante.crearPagoById(estId, pagoNuevo);
      }
    }
  },
  eliminar: () => {
    let padThis = this;
    Promise.all([
      padThis.eliminarPago(padThis.pagos),
      padThis.eliminarHijo(padThis.hijos),
      padThis.remove({_id: padThis._id}),
    ]).then(() => {
      console.log('Se elimino el padre, con sus hijos y pagos');
    });
  },
  eliminarPago: async function(pagosArray) {
    let padThis = this;
    if (argument.constructor !== Array) {
      //El pago se eliminar
      //Se saca de Padre
      //Si el padre tiene hijos se saca de los hijos
    }
  },
};
/**
 * Statics
 */
PadreSchema.statics = {
  agregarHijo: async function(padId, hijoNuevo) {
    let pad = await this.findById(padId);
    return await pad.agregarHijo(hijoNuevo);
  },
  crearPagoById: async function(padId, pagoNuevo) {
    let pad = await this.findById(padId);
    return await pad.agregarPago(pagoNuevo);
  },
  crear: async function(pNuevo) {
    let padThis = this;
    const filtro = {
      nombre: pNuevo.nombre,
      apellido: pNuevo.apellido,
    };
    if (pNuevo.hasOwnProperty('_id')) {
      console.log(
        TAG,
        `eNuevo ya tenia ._id por lo tanto ya es parte de la DB`
      );
      return pNuevo;
    }
    let updated = await padThis
      .findOneAndUpdate(filtro, pNuevo, {upsert: true, runValidators: true})
      .catch(err => console.error(err));
    let letmesee = await padThis.findOne(filtro);
    console.log(
      TAG,
      `SE ENCONTRÓ\\CREÓ Estudiante ${letmesee.nombre} ${letmesee.apellido}`,
      '\n'
    );
    return letmesee;
  },
  eliminarById: async function(padId) {
    let padThis = this;
    try {
      let pad = await padThis.findById(padId);
      if (pad != null) {
        pad.eliminar();
      } else console.log(TAG, 'No se ha encontrado este padre');
    } catch (err) {
      console.error(TAG, err);
    }
  },
};

module.exports = mongoose.model('Padres', PadreSchema);
