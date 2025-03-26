class alter_user_cliente {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE user 
                ADD COLUMN user_cliente_id INT,
                ADD CONSTRAINT fk_user_cliente FOREIGN KEY (user_cliente_id) REFERENCES cliente(id)
            `);
            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }

    async down(connection) {
        try {
            await connection.execute(`ALTER TABLE user DROP FOREIGN KEY fk_user_cliente;`);
            await connection.execute(`ALTER TABLE user DROP COLUMN user_cliente_id;`);
            await connection.execute(`DROP TABLE IF EXISTS cliente;`);
            console.log('Relação e tabela removidas com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação ou tabela:', error);
        }
    }
    
}
export default alter_user_cliente;
