class alterUserCliente {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE cliente 
                ADD COLUMN cliente_user_id INT,
                ADD FOREIGN KEY (cliente_user_id) REFERENCES user(id);
            `);
            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }

    async down(connection) {
        try {
            await connection.execute(`
                ALTER TABLE cliente
                DROP FOREIGN KEY cliente_user_id,
                DROP COLUMN cliente_user_id;
            `);
            console.log('Relação e tabela removidas com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação ou tabela:', error);
        }
    }
    
}
export default alterUserCliente;
