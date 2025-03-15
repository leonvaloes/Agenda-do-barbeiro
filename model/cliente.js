// models/Cliente.js
const { Model, DataTypes } = require('sequelize');

class Cliente extends Model {}

module.exports = (sequelize) => {
    Cliente.init({
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        telefone: {
            type: DataTypes.STRING
        },
        endereco: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Cliente',
        freezeTableName: true
    });

    // Método personalizado para formatar dados
    Cliente.prototype.getDadosFormatados = function() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            telefone: this.telefone,
            endereco: this.endereco
        };
    };

    return Cliente;
};