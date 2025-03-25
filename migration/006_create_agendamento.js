class create_agendamento {
    async up(connection) {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS agendamento (
                id INT AUTO_INCREMENT PRIMARY KEY,
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
