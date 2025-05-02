class alterUserAtendente {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE atendente 
                ADD COLUMN atendente_user_id INT,
                ADD CONSTRAINT fk_atendente_user FOREIGN KEY (atendente_user_id) REFERENCES user(id)
                ON DELETE CASCADE;
            `);


            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }

    async down(connection) {
        try {
            // Remove a chave estrangeira com o nome correto
            await connection.execute(`
                ALTER TABLE atendente
                DROP FOREIGN KEY atendente_ibfk_1;
            `);

            // Agora remova a coluna
            await connection.execute(`
                ALTER TABLE atendente
                DROP COLUMN atendente_user_id;
            `);

            console.log('Relação removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação:', error);
        }
    }

}
export default alterUserAtendente;
