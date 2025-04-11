class HorarioFuncionario {
    id?: number;
    atendente_id: number;
    data_hora: Date;
    ocupado: boolean;

    constructor(atendente_id: number, data_hora: Date, ocupado = false) {
        this.atendente_id = atendente_id;
        this.data_hora = data_hora;
        this.ocupado = ocupado;
    }

    static async gerarHorariosFuncionario(
        funcionarioId: number,
        connection: any,
        horaInicio: string = "08:00",
        horaFim: string = "18:00",
        dias: number = 30
    ) {
        const hoje = new Date();
        const fim = new Date();
        fim.setDate(hoje.getDate() + dias);

        for (
            let data = new Date(hoje);
            data <= fim;
            data.setDate(data.getDate() + 1)
        ) {
            const [hInicio, mInicio] = horaInicio.split(":").map(Number);
            const [hFim, mFim] = horaFim.split(":").map(Number);

            let inicio = new Date(data);
            inicio.setHours(hInicio, mInicio, 0, 0);

            const fimDia = new Date(data);
            fimDia.setHours(hFim, mFim, 0, 0);

            while (inicio <= fimDia) {
                await this.criarHorario(funcionarioId, new Date(inicio), connection);
                inicio = new Date(inicio.getTime() + 15 * 60000);
            }
        }
    }

    static async criarHorario(funcionarioId: number, dataHora: Date, connection: any) {
        const query = `
        INSERT INTO horarios_funcionario (atendente_id, data_hora, ocupado)
        VALUES (?, ?, FALSE)
        ON DUPLICATE KEY UPDATE atendente_id = atendente_id
      `;
        await connection.query(query, [funcionarioId, dataHora]);
    }

    static async marcarComoOcupado(funcionarioId: number, dataHora: Date, connection: any) {
        const query = `
        UPDATE horarios_funcionario
        SET ocupado = TRUE
        WHERE atendente_id = ? AND data_hora = ?
      `;
        await connection.query(query, [funcionarioId, dataHora]);
    }

    static async listarDisponiveis(funcionarioId: number, connection: any) {
        const hoje = new Date();
        const fim = new Date();
        fim.setDate(hoje.getDate() + 30);

        const query = `
        SELECT * FROM horario_atendente
        WHERE atendente_id = ? 
          AND ocupado = FALSE
          AND data_hora BETWEEN ? AND ?
        ORDER BY data_hora ASC
      `;

        const [rows] = await connection.query(query, [funcionarioId, hoje, fim]);
        return rows;
    }
}

export default HorarioFuncionario;
