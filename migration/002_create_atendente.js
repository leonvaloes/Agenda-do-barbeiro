class create_atendente {

    async up(connection) {

        await connection.execute(`
        CREATE TABLE IF NOT EXISTS atendente (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            cpf VARCHAR(20) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL.
            empresa_id INT NOT NULL,
            FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE
        )`);
        
        console.log('Tabela atendente criada!');
    }

    async down(connection) {
        await connection.execute(`
            DROP TABLE IF EXISTS atendente;
        `);
        console.log("Tabela atendente excluida");
    }
}

export default create_atendente;
