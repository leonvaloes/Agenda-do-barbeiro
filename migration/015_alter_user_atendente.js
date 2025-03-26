class alter_user_atendente {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE user 
                ADD COLUMN user_atendente_id INT,
                ADD CONSTRAINT fk_user_atendente FOREIGN KEY (user_atendente_id) REFERENCES atendente(id)
            `);
            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }

    async down(connection) {
        try {
            await connection.execute(`
                ALTER TABLE user
                DROP FOREIGN KEY fk_user_atendente,
                DROP COLUMN user_atendente_id;
            `);
            console.log('Relação removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação:', error);
        }
    }
}
export default alter_user_atendente;
