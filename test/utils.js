const chai=require('chai');
const expect=chai.expect;
const Bancos= require('../src/models/bancos');
const Grupos= require('../src/models/grupos');
const NameArray=["Alejandro","Fernando","Dominga","Armando","Arturo","Lennittza","Ricardo","Eduardo","Paola","Ramon"];
const LastNameArray=["Duran","Aparicio","Cova","Martinez","Brito","Zorrilla","Hernandez"];
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
module.exports={
  assertSameId(result, expected){
    expect(result._id.toString()).to.equal(expected._id.toString());
  },
  
  getMockPago(){
    const a= {
      banco: Bancos[Math.floor(Math.random() * Bancos.length)],
      referencia: Math.floor(Math.random() * 1000 + 100).toString(),
      monto: Math.floor(Math.random() * 1000 + 100).toString(),
      fecha:randomDate(new Date(2018, 5, 2), new Date())
    };
    console.log(a.fecha)
    return a;
  },
  getMockStudent(){
    const a={
      nombre:NameArray[Math.floor(Math.random() * NameArray.length)],
      apellido:LastNameArray[Math.floor(Math.random() * LastNameArray.length)],
      tlf: Math.floor(Math.random()*1000),
      cedula: Math.floor(Math.random()*Math.random()*100),
      grupo: Grupos[Math.floor(Math.random() * Grupos.length)],
    };
    a.email=`${a.nombre}_${a.apellido}@noexiste.com`;
    return a;
  },
  getMockPadre(){
    const a={
      nombre:NameArray[Math.floor(Math.random() * NameArray.length)],
      apellido:LastNameArray[Math.floor(Math.random() * LastNameArray.length)],
      tlf: Math.floor(Math.random()*1000),
      pagos:[],
      hijos:[]
    };
    a.email=`${a.nombre}_${a.apellido}@noexiste.com`;
    return a;
  }

};


