class create_agendamentosPendentes {
    
    async up(connection) {
        await connection.execute(`
                CREATE TABLE IF NOT EXISTS agendamentosPendentes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item_id INT NOT NULL,
                atendente_id INT NOT NULL,
                FOREIGN KEY (item_id) REFERENCES item(id),
                FOREIGN KEY (atendente_id) REFERENCES atendente(id)
            )`);
        console.log('Tabela agendamentosPendentes criada!');
    }

    async down(connection) {
        await connection.execute(`
                DROP TABLE IF EXISTS agendamentosPendentes;
            `);
        console.log("Tabela agendamentosPendentes excluida");
    }
}

export default create_agendamentosPendentes;
