class alterUserCliente {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE cliente 
                ADD COLUMN cliente_user_id INT,
                ADD CONSTRAINT fk_cliente_user FOREIGN KEY (cliente_user_id) REFERENCES user(id)
                ON DELETE CASCADE;
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
                DROP FOREIGN KEY fk_cliente_user,
                DROP COLUMN cliente_user_id;
            `);           
            
            console.log('alterUserClienteremovidas com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação ou coluna:', error);
        }
    }
    
    
}
export default alterUserCliente;
