const Sequelize= require('sequelize');
const sequelize=new Sequelize('meu_banco','usuario','senha',{
    dialect:'mysql',
    host: 'localhost',port: 3306,
})

module.exports=sequelize;