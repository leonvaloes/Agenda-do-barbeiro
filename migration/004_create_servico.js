class create_servico {

    async up(connection) {

        await connection.execute(`
        CREATE TABLE IF NOT EXISTS servicos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            descricao TEXT NOT NULL,
            valor DECIMAL(10,2) NOT NULL,
            tempo_medio INT NOT NULL,
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

export default create_servico;