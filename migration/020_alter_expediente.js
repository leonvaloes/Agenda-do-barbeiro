class alter_expediente {
    async up(connection) {
        try {
            await connection.execute(`
                ALTER TABLE expediente 
                ADD COLUMN atendente_id INT,
                ADD COLUMN dias_semana_id INT,
                ADD CONSTRAINT fk_atendente
                    FOREIGN KEY (atendente_id) REFERENCES atendente(id),
                ADD CONSTRAINT fk_dias_semana
                    FOREIGN KEY (dias_semana_id) REFERENCES dias_semana(id)
                    ON DELETE CASCADE
            `);
            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }

    async down(connection) {
        try {
            await connection.execute(`
                ALTER TABLE expediente
                DROP FOREIGN KEY fk_atendente,
                DROP FOREIGN KEY fk_dias_semana,
                DROP COLUMN atendente_id,
                DROP COLUMN dias_semana_id
            `);
            console.log('alter_expediente removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação:', error);
        }
    }
}

export default alter_expediente;
