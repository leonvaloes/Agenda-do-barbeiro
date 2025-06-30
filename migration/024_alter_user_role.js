class alter_user_role {
    async up(connection) {
        await connection.execute(`
            ALTER TABLE user 
            ADD COLUMN role_id INT,
            ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id)
        `);

        console.log('Tabela Role criada!');
    }

    async down(connection) {
        await connection.execute(`
            ALTER TABLE user 
            DROP FOREIGN KEY fk_user_role,
            DROP COLUMN role_id
        `);

        console.log("Tabela role excluida");
    }
}

export default alter_user_role;
