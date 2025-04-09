class alter_item {
    async up(connection) {
        await connection.execute(`
            ALTER TABLE item 
            ADD COLUMN cliente_id INT,
            ADD COLUMN atendente_id INT,
            ADD COLUMN serv_id INT,
            ADD CONSTRAINT fk_client_item FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE,
            ADD CONSTRAINT fk_atendente_item FOREIGN KEY (atendente_id) REFERENCES atendente(id) ON DELETE CASCADE,
            ADD CONSTRAINT fk_servico_item FOREIGN KEY (serv_id) REFERENCES servicos(id) ON DELETE CASCADE
        `);
        
        console.log('Relação adicionada com sucesso!');
    }

    async down(connection) {
        await connection.execute(`
            ALTER TABLE item 
            DROP FOREIGN KEY fk_client_item,
            DROP FOREIGN KEY fk_atendente_item,
            DROP FOREIGN KEY fk_servico_item,
            DROP COLUMN cliente_id,
            DROP COLUMN atendente_id,
            DROP COLUMN serv_id;
        `);
        
        console.log('Relação removida com sucesso!');
    }
}

export default alter_item;