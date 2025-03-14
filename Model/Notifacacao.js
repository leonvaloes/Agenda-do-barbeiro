const  Sequelize = require('sequelize');
const database=required('../db')
const Destinatario=require('./Destinatario.js')


 class Notificacao extends Model{}

 Notificacao.init({
    Mensagem:{
        type:DataTypes.STRING(1000),
    },
    destinatarioId:{
        type: DataTypes.INTEGER,
        references:{
            model: Destinatario,
            key:'Id',
        }
    }

 },{
    database,
    modelName:'Notificacao',
 })

 module.exports= Notificacao;

 Destinatario.hasMany(Notificacao, { foreignKey: 'destinatarioId' });
 Notificacao.belongsTo(Destinatario, { foreignKey: 'destinatarioId' });

