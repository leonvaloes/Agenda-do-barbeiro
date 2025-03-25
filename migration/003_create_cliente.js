const mysql = require('mysql2/promise');
import Database from '../config/database.ts'

class create_cliente {

    async up(connection) {
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS cliente (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            cpf VARCHAR(20) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL,
            cidade VARCHAR(255)NOT NULL
        )`);
        console.log('Tabela cliente criada!');
    }

    async down(connection) {
        await connection.execute(`
            DROP TABLE IF EXISTS cliente;
        `);
        console.log("Tabela cliente excluida");
    }
}

export default create_cliente;


