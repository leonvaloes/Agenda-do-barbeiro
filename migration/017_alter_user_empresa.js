class alterUserEmpresa {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE empresa
                ADD COLUMN empresa_user_id INT,
                ADD CONSTRAINT fk_empresa_user FOREIGN KEY (empresa_user_id) REFERENCES user(id)
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
                DROP FOREIGN KEY fk_empresa_user,
                DROP COLUMN empresa_user_id;
            `);
            console.log('alterUserEmpresa removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação ou coluna:', error);
        }
    }
}

export default alterUserEmpresa;
