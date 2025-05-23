import associarHorariosAtendenteDto from "../DTO/associarHorariosAtedentesDto";
import User from "./user";

class Atendente extends User {
    cpf: string;
    email: string;
    telefone: string;
    empresa_id: number;
    atendente_user_id: number;

    constructor(nome: string, email: string, telefone: string, cpf: string, senha: string, empresa_id: number, atendente_user_id: number) {
        super(nome, email, telefone, senha, "ATENDENTE");
        this.cpf = cpf;
        this.empresa_id = empresa_id;
        this.atendente_user_id = atendente_user_id;
    }

    async createAtendente(connection) {
        this.atendente_user_id = await User.cadastrarUser(this.nome, this.email, this.telefone, this.senha, "ATENDENTE", connection);

        const query = `INSERT INTO atendente (cpf, empresa_id, atendente_user_id) VALUES (?, ?, ?)`;
        const values = [this.cpf, this.empresa_id, this.atendente_user_id];

        try {
            const [result] = await connection.execute(query, values);
            return {
                id: result.insertId,
                cpf: this.cpf,
                empresa_id: this.empresa_id,
                atendente_user_id: this.atendente_user_id,
            };
        } catch (error) {
            throw error;
        }
    }



    async delete(id: number, connection: any) {
        const query = `DELETE FROM atendente WHERE id = ?`;
        try {
            await connection.execute(query, [id]);
            return {
                id: id,
                nome: this.nome,
                cpf: this.cpf
            };
        } catch (error) {
            console.error('Erro ao deletar atendente:', error);
            throw error;
        }
    }

    static async update(id: number, nome: string, email: string, telefone: string, cpf: string, userId: number, connection: any) {
        try {
            User.updateUser(userId, nome, email, telefone, connection);

            const queryAtendente = `UPDATE atendente SET cpf=? WHERE atendente_user_id=?`;
            await connection.execute(queryAtendente, [cpf, id]);
        } catch (error) {
            console.error("Erro ao atualizar atendente:", error);
            throw error;
        }
    }

    static async getAtendenteById(id: number, connection: any) {
        const [rows] = await connection.execute('SELECT * FROM atendente WHERE id = ?', [id]);
        return rows;
    }

    static async getEmpresa(id: number, connection: any) {
        const query = `SELECT empresa_id FROM atendente WHERE atendente.id=?`
        try {
            const result = await connection.execute(query, [id]);
            return result[0][0];
        } catch (e) {
            throw e;
        }
    }

    static async getIdAtendente(id: number, connection: any) {
        const query = `SELECT id FROM atendente WHERE atendente_user_id = ?`
        try {
            const result = await connection.execute(query, [id]);
            return result[0][0].id;
        } catch (e) {
            throw e
        }
    }

    static async getTimesForDate(id: number, date: string, connection: any) {
        const query = `SELECT * FROM horario_atendente WHERE atendente_id=? AND DATE(data_hora) = ? AND ocupado=0`
        try {
            const [result] = await connection.execute(query, [id, date]);
            return result;
        } catch (e) {
            console.error("Erro ao listar horarios disponieis");
            throw e;
        }
    }

    static async listarAtendentes(connection: any) {
        const query = `SELECT * FROM atendente`;
        try {
            const result: any = await connection.execute(query);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar atendentes:', error);
            throw error;
        }
    }

    static async getUserAtendentes(id: number, connection: any) {
        const query = `SELECT *
            FROM user
            WHERE user.id = ?`
            ;
        try {
            const result: any = await connection.execute(query, [id]);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar atendentes:', error);
            throw error;
        }
    }

    static async getInfoUser(id: number, connection: any) {
        const query = `SELECT *
            FROM user
            WHERE user.id = ?`
            ;
        try {
            const result: any = await connection.execute(query, [id]);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar atendentes:', error);
            throw error;
        }
    }

    static async listarAtendentesDoServico(id: number, connection: any) {
        const query = `SELECT *
            FROM atendente
            JOIN atendente_serv ON atendente.id = atendente_serv.atendente_id
            WHERE atendente_serv.serv_id = ?;`
            ;
        try {
            const [result] = await connection.execute(query, [id]);
            return result;
        } catch (error) {
            console.error('Erro ao listar atendentes:', error);
            throw error;
        }
    }

    async Associar(connection: any, servicoId: number, atendenteId: number, empresaId: number) {
        try {
            if (!atendenteId || !servicoId)
                throw new Error("ID do atendente ou serviço não fornecido.");
            const queryAssociacao = `INSERT INTO atendente_serv (atendente_id, serv_id, empresa_id) VALUES (?, ?, ?)`;
            await connection.execute(queryAssociacao, [atendenteId, servicoId, empresaId]);
            return servicoId;
        } catch (error) {
            console.error("Erro ao associar serviço ao atendente:", error);
            throw error;
        }
    }

    async getAllServ(connection: any, atendente_id) {
        const query = `SELECT serv_id FROM atendente_serv WHERE atendente_id = ?`;
        try {
            const [result] = await connection.execute(query, [atendente_id]);
            return result;
        } catch (error) {
            console.error('Erro ao buscar serviços do atendente:', error);
            throw error;
        }
    }

    static async associarHorarioAtendente(connection: any, data: associarHorariosAtendenteDto) {
        const query = `INSERT INTO horario_atendente (atendente_id, data_hora, ocupado) VALUES (?, ?, ?)`;
        try {
            for (const dia in data.horarios) {
                const horariosDia = data.horarios[dia as keyof associarHorariosAtendenteDto['horarios']];
                if (horariosDia) {
                    const entrada = new Date(horariosDia.entrada);
                    const saida = new Date(horariosDia.saida);
                    const intervalo = 30 * 60 * 1000; // 30 minutos em milissegundos
                    for (let hora = entrada; hora < saida; hora = new Date(hora.getTime() + intervalo)) {
                        const dataHora = hora.toISOString().slice(0, 19).replace('T', ' ');
                        await connection.execute(query, [data.idAtendente, dataHora, false]);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao associar horários ao atendente:', error);
            throw error;
        }
    }

    static async deleteExpediente(id: number, connection: any) {
        const query1 = `DELETE FROM expediente WHERE atendente_id = ?`;
        const query2 = `DELETE FROM horario_atendente WHERE atendente_id = ?`;

        try {
            await connection.execute(query1, [id]);
            await connection.execute(query2, [id]);
        } catch (e) {
            throw e;
        }
    }

    static async BuscaUltimoAgendamento(atendente_id: number, connection: any) {
        const query = `
        SELECT i.*
        FROM item i
        JOIN agendamento a ON a.item_id = i.id
        WHERE i.atendente_id = ? AND a.estado!='cancelado'
        ORDER BY i.data_hora DESC
        LIMIT 1;
    `;
        try {
            const [rows] = await connection.execute(query, [atendente_id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (e) {
            console.error("Erro ao buscar último agendamento", e);
            throw e;
        }
    }


    static async DeletaHorarios(atendente_id: number, data: any, connection: any) {
        const query =
            `DELETE FROM horario_atendente
            WHERE atendente_id = ?
            AND data_hora >= ?;`
        try {
            await connection.execute(query, [atendente_id, data]);
        } catch (e) {
            console.error("Erro ao apagar horarios de agendamento");
            throw e;
        }
    }

    static async getExpediente(atendenteId: number, connection: any) {
        const query = `SELECT * FROM expediente WHERE atendente_id = ?`;
        try {
            const [result] = await connection.execute(query, [atendenteId]);
            return result;
        } catch (e) {
            throw e;
        }
    }

    static async ocuparDia(atendenteId: number, data: any, connection:any) {
        const query = `
            UPDATE horario_atendente
            SET ocupado=1
            WHERE atendente_id=? AND DATE(data_hora)=?`;
        try {
            console.log("data e id ", data, atendenteId);
            await connection.execute(query, [atendenteId, data]);
        } catch (e) {
            throw e;
        }
    }

}

export default Atendente;