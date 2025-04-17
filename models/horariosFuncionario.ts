import unformatDate from "../type/unformatDate";

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


    // static async criarHorario(funcionarioId: number, dataHora: any, connection: any) {
    //     if (!(dataHora instanceof Date)) {
    //         dataHora = new Date(dataHora);
    //     }
    //     const formatador = new unformatDate();
    //     const dataHoraFormatada = formatador.FormatDate(dataHora);

    //     const query = `
    //         INSERT INTO horario_atendente (atendente_id, data_hora, ocupado)
    //         VALUES (?, ?, FALSE)
    //         ON DUPLICATE KEY UPDATE atendente_id = atendente_id
    //     `;

    //     console.log("funcionarioId:", funcionarioId);
    //     console.log("dataHoraFormatada:", dataHoraFormatada);

    //     const retorno = await connection.execute(query, [funcionarioId, dataHoraFormatada]);
    //     console.log("retorno:", retorno);
    // }



    static createExpediente(connection: any, data: any) { //CERTO, FAZ O EXPEDIENTE DO ATENDENTE
        const query = `
            INSERT INTO expediente(data_hora_entrada, data_hora_saida, atendente_id, dias_semana_id)
            VALUES (?, ?, ?, ?)
        `;
        
        const formatador = new unformatDate();

        connection.execute(query, [data.data_hora_entrada, data.data_hora_saida, data.atendente_id, data.dias_semana_id]);

        // Geração de horários disponíveis
        const diasSemanaPermitidos = [data.dias_semana_id]; 

        const hoje = new Date();
        const fim = new Date();
        fim.setMonth(fim.getMonth() + 3); // 3 meses à frente

        const horariosDisponiveis = [];

        for (
            let dia = new Date(hoje);
            dia <= fim;
            dia.setDate(dia.getDate() + 1)
        ) {
            const diaSemana = dia.getDay(); // 0=Dom, 1=Seg, ..., 6=Sab
            if (diasSemanaPermitidos.includes(diaSemana)) {
                const entradaDia = new Date(dia);
                entradaDia.setHours(new Date(data.data_hora_entrada).getHours(), new Date(data.data_hora_entrada).getMinutes(), 0);

                const saidaDia = new Date(dia);
                saidaDia.setHours(new Date(data.data_hora_saida).getHours(), new Date(data.data_hora_saida).getMinutes(), 0);

                for (
                    let horaAtual = new Date(entradaDia);
                    horaAtual < saidaDia;
                    horaAtual.setMinutes(horaAtual.getMinutes() + 15)
                ) {
                    const horarioFormatado = formatador.FormatDate(new Date(horaAtual));
                    horariosDisponiveis.push([horarioFormatado, false, data.atendente_id]);
                }
            }
        }

        const insertQuery = `
            INSERT INTO horario_atendente(data_hora, ocupado, atendente_id)
            VALUES (?, ?, ?)
        `;

        for (const horario of horariosDisponiveis) {
            connection.execute(insertQuery, horario);
        }

        console.log("Horários disponíveis criados!");
    }



    static async marcarComoOcupado(funcionarioId: number, dataHora: Date, connection: any) {// teoricamente certo
        const formatador = new unformatDate();
        const dataHoraFormatada = formatador.FormatDate(dataHora);

        const query = `
        UPDATE horario_atendente
        SET ocupado = TRUE
        WHERE atendente_id = ? AND data_hora = ?
      `;
        await connection.execute(query, [funcionarioId, dataHoraFormatada]);
    }

    static async marcarComoLivre(agendamentoId: number, connection: any) {
        const query = `
            UPDATE horario_atendente
            SET ocupado = FALSE
            WHERE (atendente_id, data_hora) = (
                SELECT i.atendente_id, i.data_hora
                FROM agendamento a
                JOIN item i ON a.item_id = i.id
                WHERE a.id = ?
            );
        `;
        await connection.execute(query, [agendamentoId]);
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

        const [rows] = await connection.execute(query, [funcionarioId, hoje, fim]);
        return rows;
    }
}

export default HorarioFuncionario;
