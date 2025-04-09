class alterUserAtendente {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE atendente 
                ADD COLUMN atendente_user_id INT,
                ADD FOREIGN KEY (atendente_user_id) REFERENCES user(id);
            `);
            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }

    async down(connection) {
        try {
            await connection.execute(`
                ALTER TABLE atendente
                DROP FOREIGN KEY atendente_user_id,
                DROP COLUMN atendente_user_id;
            `);
            console.log('Relação removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação:', error);
        }
    }
}
export default alterUserAtendente;
