class create_user_notificacao {
    async up(connection) {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS user_notificacao (
    user_id INT NOT NULL,
    notificacao_id INT NOT NULL,
    data_hora DATETIME NOT NULL,
    PRIMARY KEY (user_id, notificacao_id)
);

        `);
        console.log('Tabela user_notificacao criada!');
    }

    async down(connection) {
        await connection.execute(`DROP TABLE IF EXISTS user_notificacao;`);
        console.log('Tabela user_notificacao excluída!');
    }
}

export default create_user_notificacao;
