class create_horario_atendente {

    async up(connection) {
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS horario_atendente (
            id INT AUTO_INCREMENT PRIMARY KEY,
            data_hora_entrada DATETIME,
            data_hora_saida DATETIME
        )`);
        console.log('Tabela horario_atendente criada!');
    }

    async down(connection) {
        await connection.execute(`
            DROP TABLE IF EXISTS horario_atendente;
        `);
        console.log("Tabela horario_atendente excluida");
    }
}

export default create_horario_atendente;
