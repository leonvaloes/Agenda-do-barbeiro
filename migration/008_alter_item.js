class alter_item {
    async up(connection) {
        await connection.execute(`
            ALTER TABLE item 
            ADD COLUMN cliente_id INT, 
            ADD CONSTRAINT fk_cliente_id FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE;
        `);
        console.log('Relação adicionada com sucesso!');
    }

    async down(connection) {
        await connection.execute(`
            ALTER TABLE item 
            DROP FOREIGN KEY fk_cliente_id, 
            DROP COLUMN cliente_id;
        `);
        console.log('Relação removida com sucesso!');
    }
}

export default alter_item;
