class alter_user_empresa {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE user 
                ADD COLUMN user_empresa_id INT,
                ADD CONSTRAINT fk_user_empresa FOREIGN KEY (user_empresa_id) REFERENCES empresa(id)
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
                DROP FOREIGN KEY fk_user_empresa,
                DROP COLUMN user_empresa_id;
            `);
            console.log('Relação removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação:', error);
        }
    }
}
export default alter_user_empresa;
