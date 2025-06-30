class alter_agendamento {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE agendamento 
                ADD COLUMN item_id INT,
                ADD COLUMN cliente_id INT,
                ADD CONSTRAINT fk_item_agendamento FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE,
                ADD CONSTRAINT fk_cliente_agendamento FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE;
            `);
            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }

    async down(connection) {
        try {
            await connection.execute(`
                ALTER TABLE agendamento
                DROP FOREIGN KEY fk_item_agendamento,
                DROP FOREIGN KEY fk_cliente_agendamento,
                DROP COLUMN item_id,
                DROP COLUMN cliente_id;
            `);
            console.log('alter_agendamento removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação:', error);
        }
    }
}
export default alter_agendamento;
