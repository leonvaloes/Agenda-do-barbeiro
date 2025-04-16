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

    static async gerarHorariosFuncionario() {
        const hoje = new Date();
        const fim = new Date();
        fim.setDate(hoje.getDate() + dias);
        
    }

    static async criarHorario(funcionarioId: number, dataHora: any, connection: any) {
        if (!(dataHora instanceof Date)) {
            dataHora = new Date(dataHora);
        }
        const formatador = new unformatDate();
        const dataHoraFormatada = formatador.FormatDate(dataHora);
    
        const query = `
            INSERT INTO horario_atendente (atendente_id, data_hora, ocupado)
            VALUES (?, ?, FALSE)
            ON DUPLICATE KEY UPDATE atendente_id = atendente_id
        `;
    
        console.log("funcionarioId:", funcionarioId);
        console.log("dataHoraFormatada:", dataHoraFormatada);
    
        const retorno = await connection.execute(query, [funcionarioId, dataHoraFormatada]);
        console.log("retorno:", retorno);
    }
    


    static async marcarComoOcupado(funcionarioId: number, dataHora: Date, connection: any) {
        const formatador= new unformatDate();
        const dataHoraFormatada = formatador.FormatDate(dataHora);

        const query = `
        UPDATE horario_atendente
        SET ocupado = TRUE
        WHERE atendente_id = ? AND data_hora = ?
      `;
        await connection.execute(query, [funcionarioId, dataHoraFormatada]);
    }

    static async marcarComoLivre(agendamentoId: number, connection: any) {
        const query =`
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
