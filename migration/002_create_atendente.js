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
}

export default create_atendente;
