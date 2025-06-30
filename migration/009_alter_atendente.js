class alter_atendente {

    async up(connection) {
        try {
            await connection.execute(`ALTER TABLE atendente ADD COLUMN empresa_id INT;`);
            await connection.execute(`ALTER TABLE atendente ADD CONSTRAINT fk_empresa_atendente FOREIGN KEY (empresa_id) REFERENCES empresa(id);`);
            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }


    async down(connection) {
        try {
            await connection.execute(`ALTER TABLE atendente DROP FOREIGN KEY fk_empresa_atendente;`);
            await connection.execute(`ALTER TABLE atendente DROP COLUMN empresa_id;`);
            console.log('alter_atendente removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação:', error);
        }
    }
}

export default alter_atendente;
