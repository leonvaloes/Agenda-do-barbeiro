class create_item {
    async up(connection) {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                data_hora DATETIME NOT NULL
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
