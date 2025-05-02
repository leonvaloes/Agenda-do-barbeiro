class alter_user_role {
    async up(connection) {
        await connection.execute(`
                alter table user add column role_id int,
                add foreign key (role_id) references roles(id)
            `);
        console.log('Tabela Role criada!');
    }

    async down(connection) {
        await connection.execute(`
                alter table user drop foreign key role_id,
                drop column role_id
            `);
        console.log("Tabela role excluida");
    }
}

export default alter_user_role;
