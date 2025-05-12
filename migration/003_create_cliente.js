const mysql = require('mysql2/promise');
class create_cliente {

    async up(connection) {
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS cliente (
            id INT AUTO_INCREMENT PRIMARY KEY,
            cpf VARCHAR(20) UNIQUE NOT NULL,
            cidade VARCHAR(255)
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


