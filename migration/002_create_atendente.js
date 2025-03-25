class create_atendente {

    async up(connection) {

        try {
            await connection.execute(`
            CREATE TABLE IF NOT EXISTS atendente (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                cpf VARCHAR(20) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL
            )
            `);
            console.log('Tabela empresa criada!');
        } catch (error) {
            console.error('Erro ao criar tabela empresa:', error);
        }

        console.log('Tabela atendente criada!');
    }

    async down(connection) {
        try {
            await connection.execute(`
            DROP TABLE IF EXISTS empresa;
        `);
            console.log("Tabela empresa excluida");
        } catch (error) {
            console.error('Erro ao excluir tabela empresa:', error);
        }
    }

    async relaction(connection) {
        try {
            await connection.execute(`
            ALTER TABLE atendente ADD COLUMN empresa_id INT;
            ALTER TABLE atendente ADD FOREIGN KEY (empresa_id) REFERENCES empresa(id);
        `);
            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }
}

export default create_atendente;
