class create_atendente {

    async up(connection) {

        try {
            await connection.execute(`
            CREATE TABLE IF NOT EXISTS atendente (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cpf VARCHAR(20) UNIQUE NOT NULL
            )
            `);
            console.log('Tabela atendente criada!');
        } catch (error) {
            console.error('Erro ao criar tabela atendente:', error);
        }

        console.log('Tabela atendente criada!');
    }

    async down(connection) {
        try {
            await connection.execute(`
            DROP TABLE IF EXISTS atendente;
        `);
            console.log("Tabela atendente excluida");
        } catch (error) {
            console.error('Erro ao excluir tabela atendente:', error);
        }
    }
}

export default create_atendente;
