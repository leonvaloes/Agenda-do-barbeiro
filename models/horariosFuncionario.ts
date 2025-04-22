import unformatDate from "../type/unformatDate";
import { parse, setHours, setMinutes, addMinutes, isBefore, addDays } from 'date-fns';



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

        connection.execute(query, [data.data_hora_entrada, data.data_hora_saida, data.atendente_id, data.dias_semana_id]);
    }


    static async gerarHorariosDiarios(connection: any, dados: any, dataAtual: Date) {
        if (!dados.data_hora_entrada || !dados.data_hora_saida) {
            throw new Error("Horário de entrada ou saída inválido");
        }
    
        if (!(dataAtual instanceof Date) || isNaN(dataAtual.getTime())) {
            throw new Error("Data inválida ao gerar horários");
        }
    
        if (dados.atendente_id == null) {
            throw new Error("ID do atendente inválido");
        }
    
        const atendente_id = dados.atendente_id;
    
        const insertQuery = `
            INSERT INTO horario_atendente (data_hora, ocupado, atendente_id)
            VALUES (?, ?, ?)
        `;
    
        if (dados.data_hora_entrada === '00:00' && dados.data_hora_saida === '00:00') {
            console.log(`Dia ${dados.dias_semana_id}: atendente não trabalha`);
            return;
        }
    
        const [entradaHora, entradaMinuto] = dados.data_hora_entrada.split(':').map(Number);
        const [saidaHora, saidaMinuto] = dados.data_hora_saida.split(':').map(Number);
    
        if (
            isNaN(entradaHora) || isNaN(entradaMinuto) ||
            isNaN(saidaHora) || isNaN(saidaMinuto)
        ) {
            throw new Error("Horários de entrada ou saída inválidos");
        }
    
        console.log("entradaHora:", entradaHora, entradaMinuto);
        console.log("saidaHora:", saidaHora, saidaMinuto);
    
        let atual = setMinutes(setHours(new Date(dataAtual), entradaHora), entradaMinuto);
        const saida = setMinutes(setHours(new Date(dataAtual), saidaHora), saidaMinuto);
        const formatador = new unformatDate();
    
        while (isBefore(atual, saida)) {
            const horarioString = formatador.FormatDate(atual);
            console.log("HoraString: ", horarioString);
            console.log("atendenteId: ", atendente_id);
    
            await connection.execute(insertQuery, [
                horarioString,
                false,
                atendente_id
            ]);
    
            atual = addMinutes(atual, 15);
        }
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
