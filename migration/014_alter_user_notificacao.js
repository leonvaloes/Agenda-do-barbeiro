class alter_user_notificacao {

    async up(connection) {
        try {
            await connection.execute(`ALTER TABLE user_notificacao ADD COLUMN user_id INT;`);
            await connection.execute(`ALTER TABLE user_notificacao ADD CONSTRAINT fk_user_notificacao FOREIGN KEY (user_id) REFERENCES user(id);`);
            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }

    async down(connection) {
        try {
            await connection.execute(`ALTER TABLE user_notificacao DROP FOREIGN KEY fk_user_notificacao;`);
            await connection.execute(`ALTER TABLE user_notificacao DROP COLUMN user_id;`);
            console.log('Relação removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação:', error);
        }
    }
}

export default alter_user_notificacao;
