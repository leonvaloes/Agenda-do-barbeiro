class create_role {
    async up(connection) {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                descricao VARCHAR(255) NOT NULL
            )`);

        const [rows] = await connection.execute('SELECT COUNT(*) AS total FROM roles');
        if (rows[0].total === 0) {
            await connection.execute(`
                INSERT INTO roles (id, nome, descricao) VALUES
                    (1, 'ADMIN', 'ADMIN do sistema'),
                    (2, 'CLIENTE', 'Administrador do sistema'),
                    (3, 'EMPRESA', 'empresa'),
                    (4, 'ATENDENTE', 'Atendente da empresa')
            `);
        }
        console.log('Tabela Role criada!');
    }

    async down(connection) {
        await connection.execute(`
            DROP TABLE IF EXISTS role;
        `);
        console.log("Tabela role excluída");
    }
}

export default create_role;
