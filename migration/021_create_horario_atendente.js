class create_horario_atendente{

    async up(connection) {
        try {
            await connection.execute(`
               CREATE TABLE IF NOT EXISTS horario_atendente (
                id INT AUTO_INCREMENT PRIMARY KEY,
                data_hora DATETIME NOT NULL,
                ocupado BOOLEAN NOT NULL
                )
            `);

            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }

    async down(connection) {
        try {
            await connection.execute(`
                DROP TABLE IF EXISTS horario_atendente
            `);
            console.log('Relação removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação:', error);
        }
    }
}
export default create_horario_atendente;