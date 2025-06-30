class create_dias_semana {

    async up(connection) {
        try {
            await connection.execute(`
               CREATE TABLE IF NOT EXISTS dias_semana (
                id INT PRIMARY KEY,
                name VARCHAR(50) NOT NULL)
            `);
            await connection.execute(`
                INSERT INTO dias_semana (id, name) VALUES
                  (1, 'Domingo'),
                  (2, 'Segunda-feira'),
                  (3, 'Terça-feira'),
                  (4, 'Quarta-feira'),
                  (5, 'Quinta-feira'),
                  (6, 'Sexta-feira'),
                  (7, 'Sábado')
                `);
            console.log('Relação adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar relação:', error);
        }
    }

    async down(connection) {
        try {
            await connection.execute(`
                DROP TABLE IF EXISTS dias_semana
            `);
            console.log('create_dias_semana removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover relação:', error);
        }
    }
}

export default create_dias_semana;
