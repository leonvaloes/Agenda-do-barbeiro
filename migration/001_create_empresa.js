const mysql = require('mysql2/promise');
import Database from '../config/database.ts'

class create_empresa {

    async up(connection) {
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS empresa (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            cnpj VARCHAR(20) UNIQUE,
            senha VARCHAR(255) NOT NULL,
            cidade VARCHAR(255) NOT NULL,
            endereco VARCHAR(255) NOT NULL,
            estado VARCHAR(255) NOT NULL,
            telefone VARCHAR(15) NOT NULL,
            email VARCHAR(255) NOT NULL
        )`);
        console.log('Tabela empresa criada!');
    }

    async down(connection) {
        await connection.execute(`
            DROP TABLE IF EXISTS empresa;
        `);
        console.log("Tabela empresa excluida");
    }
}

export default create_empresa;
