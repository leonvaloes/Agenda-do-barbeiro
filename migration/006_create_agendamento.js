class create_agendamento {
    async up(connection) {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS agendamento (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item_id INT NOT NULL,
                FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE,
                cliente_id INT NOT NULL,
                FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela agendamento criada!');
    }

    async down(connection) {
        await connection.execute(`DROP TABLE IF EXISTS agendamento;`);
        console.log('Tabela agendamento excluída!');
    }
}

export default create_agendamento;
