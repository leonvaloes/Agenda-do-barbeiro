class create_atendente_serv {
    async up(connection) {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS atendente_serv (
                atendente_id INT NOT NULL,
                serv_id INT NOT NULL,
                empresa_id INT NOT NULL,
                PRIMARY KEY (atendente_id, serv_id, empresa_id),
                FOREIGN KEY (atendente_id) REFERENCES atendente(id) ON DELETE CASCADE,
                FOREIGN KEY (serv_id) REFERENCES servicos(id) ON DELETE CASCADE,
                FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE

            )
        `);
        console.log('Tabela atendente_serv criada!');
    }

    async down(connection) {
        await connection.execute(`DROP TABLE IF EXISTS atendente_serv;`);
        console.log('Tabela atendente_serv excluída!');
    }
}

export default create_atendente_serv;
