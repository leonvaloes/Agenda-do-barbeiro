const  Sequelize = require('sequelize');
const database=required('../db')

class Destinatario extends Model{}

Destinatario.init({
    Id:{
        type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true,
        allowNull:false,
    },
    Nome:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    Email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    Numero:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    CPF:{
        type:DataTypes.STRING,unique:true,
        allowNull:false,
    }
  },{
    database,
    modelName:'Destinatario',
  })
  
module.exports=Destinatario;


