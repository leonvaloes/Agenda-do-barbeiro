class alterUserEmpresa {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE empresa
                ADD COLUMN empresa_user_id INT,
                ADD FOREIGN KEY (empresa_user_id) REFERENCES user(id)
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
                ALTER TABLE empresa
                DROP FOREIGN KEY empresa_user_id,
                DROP COLUMN empresa_user_id;
            `);
            console.log('Relação e tabela removidas com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação ou tabela:', error);
        }
    }
    
}
export default alterUserEmpresa;
