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

    static createExpediente(connection: any, data: any) { //CERTO, FAZ O EXPEDIENTE DO ATENDENTE
        const query = `
            INSERT INTO expediente(data_hora_entrada, data_hora_intervalo, tempo_intervalo, data_hora_saida, atendente_id, dias_semana_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        console.log("create expediente: ",data);
        connection.execute(query, [data.data_hora_entrada, data.data_hora_intervalo, data.tempo_intervalo, data.data_hora_saida, data.atendente_id, data.dias_semana_id]);
    }


    static async gerarHorariosDiarios(connection: any, dados: any, dataAtual: Date) {
        const atendente_id = dados.atendente_id;
        const insertQuery = `
            INSERT INTO horario_atendente (data_hora, ocupado, atendente_id)
            VALUES (?, ?, ?)
        `;

        if (dados.data_hora_entrada === '00:00' && dados.data_hora_saida === '00:00') {
            console.log(`Dia ${dados.dias_semana_id}: atendente não trabalha`);
            return;
        }
        let almocoHora = 0;
        let almocoMinuto = 0;
        let almoco = null;
        let horarioAlmoco = "";
        
        if (dados.data_hora_almoco) {
            [almocoHora, almocoMinuto] = dados.data_hora_almoco.split(':').map(Number);
            almoco = setMinutes(setHours(new Date(dataAtual), almocoHora), almocoMinuto);
            const formatador = new unformatDate();
            horarioAlmoco = formatador.FormatDate(almoco);
        }

        const [entradaHora, entradaMinuto] = dados.data_hora_entrada.split(':').map(Number);
        const [saidaHora, saidaMinuto] = dados.data_hora_saida.split(':').map(Number);

        if (
            isNaN(entradaHora) || isNaN(entradaMinuto) ||
            isNaN(saidaHora) || isNaN(saidaMinuto)
        ) {
            throw new Error("Horários de entrada ou saída inválidos");
        }

        let atual = setMinutes(setHours(new Date(dataAtual), entradaHora), entradaMinuto);
        const saida = setMinutes(setHours(new Date(dataAtual), saidaHora), saidaMinuto);
        const formatador = new unformatDate();

        while (isBefore(atual, saida)) {
            let horarioString = formatador.FormatDate(atual);

            if (dados.data_hora_almoco && horarioString == horarioAlmoco) {
                for (let i = 0; i < dados.tempo_almoco; i += 15) {
                    await connection.execute(insertQuery, [
                        horarioString,
                        true,
                        atendente_id
                    ]);
                    atual = addMinutes(atual, 15);
                    horarioString = formatador.FormatDate(atual)
                }
            } else {
                await connection.execute(insertQuery, [
                    horarioString,
                    false,
                    atendente_id
                ]);

                atual = addMinutes(atual, 15);
            }

        }
    }

    static async marcarComoOcupado(funcionarioId: number, dataHora: Date, connection: any) {//certo
        const formatador = new unformatDate();
        const dataHoraFormatada = formatador.FormatDate(dataHora);

        const query = `
        UPDATE horario_atendente
        SET ocupado = TRUE
        WHERE atendente_id = ? AND data_hora = ?
      `;
        await connection.execute(query, [funcionarioId, dataHoraFormatada]);
    }

    static async marcarComoLivre(data_hora: Date, atendente_id:number, connection: any) {
        const query = `
            UPDATE horario_atendente
            SET ocupado = FALSE
            WHERE data_hora = ? AND atendente_id = ?
        `;
        await connection.execute(query, [data_hora, atendente_id]);
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
