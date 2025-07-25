class alter_horario_atendente {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE horario_atendente
                ADD COLUMN atendente_id INT,
                ADD CONSTRAINT fk_horario_atendente_atendente_id
                FOREIGN KEY (atendente_id) REFERENCES atendente(id) ON DELETE CASCADE
            `);
            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }

    async down(connection) {
        try {
            await connection.execute(`
                ALTER TABLE horario_atendente
                DROP FOREIGN KEY fk_horario_atendente_atendente_id,
                DROP COLUMN atendente_id
            `);
            console.log('Alter_horario removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação:', error);
        }
    }
}

export default alter_horario_atendente;
