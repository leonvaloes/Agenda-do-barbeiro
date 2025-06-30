class create_dayoff {
    
    async up(connection) {
        await connection.execute(`
                CREATE TABLE IF NOT EXISTS dayoff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                data DATE NOT NULL,
                atendente_id INT NOT NULL,
                FOREIGN KEY (atendente_id) REFERENCES atendente(id)
            )`);
        console.log('Tabela dayoff criada!');
    }

    async down(connection) {
        await connection.execute(`
                DROP TABLE IF EXISTS dayoff;
            `);
        console.log("Tabela dayoff excluida");
    }
}

export default create_dayoff;
