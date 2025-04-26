class create_expediente {

    async up(connection) {
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS expediente (
            id INT AUTO_INCREMENT PRIMARY KEY,
            data_hora_entrada TIME,
            data_hora_intervalo TIME,
            tempo_intervalo INT,
            data_hora_saida TIME
        )`);
        console.log('Tabela expediente criada!');
    }

    async down(connection) {
        await connection.execute(`
            DROP TABLE IF EXISTS expediente;
        `);
        console.log("Tabela expediente excluida");
    }
}

export default create_expediente;
