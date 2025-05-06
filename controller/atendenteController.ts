import { addDays } from 'date-fns';
import DatabaseManager from '../config/database';
import associarHorariosAtendenteDto from '../DTO/associarHorariosAtedentesDto';
import Atendente from '../models/atendente';
import HorarioFuncionario from '../models/horariosFuncionario';
import Servico from "../models/servicos";
import User from '../models/user';


class AtendenteController {
    atendente: typeof Atendente;

    constructor() {
        this.atendente = Atendente;
    }

    async createAtendente(atendenteData: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const atendente = new Atendente(atendenteData.nome, atendenteData.email, atendenteData.telefone, atendenteData.cpf, atendenteData.senha, atendenteData.empresa_id, 0);
            await atendente.createAtendente(connection);
            await connection.commit();
            return atendente;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async associarHorario(data: associarHorariosAtendenteDto) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const retorno = Atendente.associarHorarioAtendente(connection, data);
            await connection.commit();
            return retorno;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async listarAtendentes() {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const atendentes = await Atendente.listarAtendentes(connection);
            if (atendentes)
                return atendentes;
            throw new Error("Nenhum atendente encontrado");
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async listarAtendentesDoServico(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const atendentes = await Atendente.listarAtendentesDoServico(id, connection);
            const dadosAtendentes = [];

            if (atendentes && atendentes.length > 0) {
                for (const atendente of atendentes) {
                    const dataAtendente = await Atendente.getUserAtendentes(atendente.atendente_user_id, connection);
                    dadosAtendentes.push(dataAtendente);
                }
                return dadosAtendentes[0];
            }
            throw new Error("Nenhum atendente encontrado");
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async atualizaAtendente(id: number, nome: string, email: string, telefone: string, cpf: string) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();

            const atendenteExistente = await Atendente.getAtendenteById(id, connection);
            if (!atendenteExistente.length)
                throw new Error("Atendente não encontrado");
            const UserId = atendenteExistente[0].atendente_user_id;
            const atendenteModel = new Atendente("", "", "", "", "", 0, 0);
            await Atendente.update(id, nome, email, telefone, cpf, UserId, connection);
            const atendenteAtualizado = await Atendente.getAtendenteById(id, connection); 
            await connection.commit();
            return atendenteAtualizado;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async deletarAtendente(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const atendenteExcluido = await User.delete(id, connection);
            connection.commit();
            return atendenteExcluido;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async criarServicoEAssociar(data: any, funcionarios: []) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const atendenteModel = new Atendente("", "", "", "", "", 0, 0);
            const servico = await Servico.create(connection, data);
            for (const atendenteId of funcionarios) 
                {
                const idAtendente=await Atendente.getIdAtendente(atendenteId,connection);
                const empresaId = await Atendente.getEmpresa(idAtendente, connection);
                if (!empresaId) {
                    throw new Error("É necessário associar o atendente a empresa!");
                }
                await atendenteModel.Associar(connection, servico, idAtendente, empresaId.empresa_id);
            }
            connection.commit();
            return servico.id;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async definirHorario(atendente_id: number, data: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const funcExiste = await Atendente.getAtendenteById(atendente_id, connection);
            if (!Array.isArray(funcExiste) || funcExiste.length === 0)
                throw new Error("Atendente não encontrado");

            for (const item of data) {
                const dadosExpediente = {
                    atendente_id,
                    data_hora_entrada: item.entrada,
                    data_hora_almoco: item.almoco || null,
                    tempo_almoco: item.tempo_almoco || null,
                    data_hora_saida: item.saida,
                    dias_semana_id: item.dia_semana
                };
                await HorarioFuncionario.createExpediente(connection, dadosExpediente);
            }
            const dataAtual = new Date();
            for (let i = 0; i < 90; i++) {
                const dia = addDays(dataAtual, i);
                const diaSemana = dia.getDay() === 0 ? 1 : dia.getDay() + 1;
                for (const item of data) {

                    if (parseInt(item.dia_semana) === diaSemana && item.entrada !== '00:00') {
                        const dados = {
                            atendente_id,
                            data_hora_entrada: item.entrada,
                            data_hora_almoco: item.intervalo || null,
                            tempo_almoco: item.tempo || null,
                            data_hora_saida: item.saida,
                            dias_semana_id: item.dia_semana
                        };
                        await HorarioFuncionario.gerarHorariosDiarios(connection, dados, dia);
                    }
                }
            }
            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getIdAtendente(userId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const result = await Atendente.getIdAtendente(userId, connection);
            return result;
        } catch (e) {
            throw e;
        } finally {

        }
    }

    async getTimeForDate(atendenteId: number, date: string) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const existe = await Atendente.getAtendenteById(atendenteId, connection);
            if (!existe && existe.length <= 0)
                throw new Error("Atendente não encontrado");
            const result = await Atendente.getTimesForDate(atendenteId, date, connection);
            return result;
        } catch (e) {
            console.error("Erro ao buscar data e exibir horarios");
            throw e;
        } finally {
            connection.release();
        }
    }
}

export default AtendenteController;