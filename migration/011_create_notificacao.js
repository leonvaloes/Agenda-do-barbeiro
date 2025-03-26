const mysql = require('mysql2/promise');

class create_notificacao {

    async up(connection) {
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS notificacao (
            id INT AUTO_INCREMENT PRIMARY KEY,
            estrategia VARCHAR(255),
            mensagem VARCHAR(255) NOT NULL          
        )`);
        console.log('Tabela notificacao criada!');
    }

    async down(connection) {
        await connection.execute(`
            DROP TABLE IF EXISTS notificacao;
        `);
        console.log("Tabela notificacao excluida");
    }
}

export default create_notificacao;
