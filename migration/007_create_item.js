class create_item {
    async up(connection) {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                serv_id INT NOT NULL,
                atendente_id INT NOT NULL,
                data_hora DATETIME NOT NULL,
                agendamento_id INT NOT NULL,
                FOREIGN KEY (serv_id) REFERENCES servicos(id) ON DELETE CASCADE,
                FOREIGN KEY (atendente_id) REFERENCES atendente(id) ON DELETE CASCADE,
                FOREIGN KEY (agendamento_id) REFERENCES agendamento(id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela item criada!');
    }

    async down(connection) {
        await connection.execute(`DROP TABLE IF EXISTS item;`);
        console.log('Tabela item excluída!');
    }
}

export default create_item;
