class create_user {

    async up(connection) {
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            senha VARCHAR(255) NOT NULL
        )`);
        console.log('Tabela user criada!');
    }

    async down(connection) {
        await connection.execute(`
            DROP TABLE IF EXISTS user;
        `);
        console.log("Tabela user excluida");
    }
}

export default create_user;
