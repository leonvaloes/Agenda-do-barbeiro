import associarHorariosAtendenteDto from "../DTO/associarHorariosAtedentesDto";
import User from "./user";

class Atendente extends User {
    cpf: string;
    atendente_user_id: number;

    constructor(nome: string, cpf: string, senha: string, atendente_user_id: number) {
        super(nome, senha);
        this.cpf = cpf;
        this.atendente_user_id = atendente_user_id;
    }

    async createAtendente(connection: any) {
        this.atendente_user_id = await User.cadastrarUser(this.nome, this.senha, connection);
        const query = `INSERT INTO atendente (cpf, atendente_user_id) VALUES ( ?, ?)`;
        const values = [this.cpf, this.atendente_user_id];
        try {
            const result = await connection.execute(query, values);
            return { id: result[0].insertId, ...result[0] };
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

    async update(id: number, connection: any, data: any) {
        const query = `UPDATE atendente SET nome = ?, cpf = ?, senha = ? WHERE id = ?`;
        try {
            await connection.execute(query, [data.nome, data.cpf, data.senha, id]);
            return { id, ...data };
        } catch (error) {
            console.error('Erro ao atualizar atendente:', error);
            throw error;
        }
    }

    static async getAtendenteById(id: number, connection: any) {
        const [rows] = await connection.execute('SELECT * FROM atendente WHERE id = ?', [id]);
        return rows;
    }

    static async getEmpresa(id:number, connection:any){
        const query=`SELECT empresa_id FROM atendente WHERE atendente.id=?`
        try{
            console.log("id: ",id);
            const result= await connection.execute(query,[id]);
            console.log("result: ",result[0][0]);
            return result[0][0];
        }catch(e){
            throw e;
        }
    }

    static async getTimesForDate(id: number, date: string, connection: any) {
        const query = `SELECT * FROM horario_atendente WHERE atendente_id=? AND DATE(data_hora) = ? AND ocupado=0`
        try {
            const [result] = await connection.execute(query, [id, date]);
            console.log(result);
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

    static async getUserAtendentes(id:number, connection:any){
        const query = `SELECT *
            FROM user
            WHERE user.id = ?`
        ;
        try {
            const result: any = await connection.execute(query,[id]);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar atendentes:', error);
            throw error;
        }
    }

    static async listarAtendentesDoServico(id:number, connection: any) {
        const query = `SELECT *
            FROM atendente
            JOIN atendente_serv ON atendente.id = atendente_serv.atendente_id
            WHERE atendente_serv.serv_id = ?;`
        ;
        try {
            const result: any = await connection.execute(query,[id]);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar atendentes:', error);
            throw error;
        }
    }

    static async listarServicoAtendente(id:number, connection: any) {
        const query = `SELECT *
            FROM servicos
            JOIN atendente_serv ON servicos.id = atendente_serv.serv_id
            WHERE atendente_serv.atendente_id = ?;`
        ;
        try {
            const result: any = await connection.execute(query,[id]);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar servicos:', error);
            throw error;
        }
    }

    async Associar(connection: any, servicoId: number, atendenteId: number, empresaId:number) {
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
}

export default Atendente;