import { addDays } from 'date-fns';
import DatabaseManager from '../config/database';
import associarHorariosAtendenteDto from '../DTO/associarHorariosAtedentesDto';
import Atendente from '../models/atendente';
import HorarioFuncionario from '../models/horariosFuncionario';
import Servico from "../models/servicos";
import User from '../models/user';
import unformatDate from '../type/unformatDate';
import Agendamento from '../models/agendamento';

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
            const novoAtendente = await atendente.createAtendente(connection);
            await connection.commit();
            return novoAtendente;

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
                return dadosAtendentes;
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
            const atendenteId = await Atendente.getIdAtendente(id, connection);
            await Atendente.deleteExpediente(atendenteId, connection);
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
            for (const atendenteId of funcionarios) {
                const idAtendente = await Atendente.getIdAtendente(atendenteId, connection);
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

    static async definirHorario(atendente_id: number, dados: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const funcExiste = await Atendente.getAtendenteById(atendente_id, connection);

            if (!Array.isArray(funcExiste) || funcExiste.length === 0)
                throw new Error("Atendente não encontrado");

            for (const item of dados) {
                const dadosExpediente = {
                    atendente_id,
                    data_hora_entrada: item.entrada,
                    data_hora_intervalo: item.intervalo || null,
                    tempo_intervalo: item.tempo || null,
                    data_hora_saida: item.saida,
                    dias_semana_id: item.dia_semana
                };
                await HorarioFuncionario.createExpediente(connection, dadosExpediente);
            }
            const dataAtual = new Date();
            for (let i = 0; i < 90; i++) {
                const dia = addDays(dataAtual, i);
                const diaSemana = dia.getDay() === 0 ? 1 : dia.getDay() + 1;
                for (const item of dados) {

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
            connection.release();
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

    async getInfoUserByIdUser(atendenteId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const result = await Atendente.getInfoUser(atendenteId, connection);
            return result;
        } catch (e) {
            throw e;
        } finally {
            connection.release();
        }
    }

    async definirHorarioApartirDeData(atendente_id: number, dados: any, dataInicio: Date) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();

            const funcExiste = await Atendente.getAtendenteById(atendente_id, connection);
            if (!Array.isArray(funcExiste) || funcExiste.length === 0)
                throw new Error("Atendente não encontrado");

            let ultimaData = await Atendente.BuscaUltimoAgendamento(funcExiste[0].id, connection);

            const formatador = new unformatDate();
            ultimaData = formatador.unformatDate(ultimaData.data_hora);

            await Atendente.DeletaHorarios(funcExiste[0].id, ultimaData, connection);
            for (const item of dados) {
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

            for (let i = 0; i < 90; i++) {
                const dia = addDays(dataInicio, i);
                const diaSemana = dia.getDay() === 0 ? 1 : dia.getDay() + 1;

                for (const item of dados) {
                    if (parseInt(item.dia_semana) === diaSemana && item.entrada !== '00:00') {
                        const dadosDia = {
                            atendente_id,
                            data_hora_entrada: item.entrada,
                            data_hora_almoco: item.intervalo || null,
                            tempo_almoco: item.tempo || null,
                            data_hora_saida: item.saida,
                            dias_semana_id: item.dia_semana
                        };
                        await HorarioFuncionario.gerarHorariosDiarios(connection, dadosDia, dia);
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

    async getExpediente(atendenteId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const result = await Atendente.getExpediente(atendenteId, connection);
            return result;
        } catch (e) {
            throw e;
        } finally {
            connection.release();
        }
    }


    static async atualizarExpediente(atendente_id: number, expediente: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const atendente = Atendente.getAtendenteById(atendente_id, connection);
            if (!atendente)
                throw new Error("Atendente não existe");

            await Atendente.deleteExpediente(atendente_id, connection);

            for (const item of expediente) {
                const dadosExpediente = {
                    atendente_id,
                    data_hora_entrada: item.entrada,
                    data_hora_intervalo: item.intervalo || null,
                    tempo_intervalo: item.tempo || null,
                    data_hora_saida: item.saida,
                    dias_semana_id: item.dia_semana
                };
                await HorarioFuncionario.createExpediente(connection, dadosExpediente);
            }
            const dataAtual = new Date();
            for (let i = 0; i < 90; i++) {
                const dia = addDays(dataAtual, i);
                const diaSemana = dia.getDay() === 0 ? 1 : dia.getDay() + 1;
                for (const item of expediente) {

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
        } catch (e) {
            await connection.rollback();
        } finally {
            connection.release();
        }
    }

    async getRemarcarAgendamentos(atendenteId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const result = await Agendamento.getRemarcarAgendamentos(atendenteId, connection);

            console.log("result: ", result);
            return result;
        } catch (e) {
            throw e;
        } finally {
            connection.release();
        }
    }

    async ocuparDia(atendenteId: number, data: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {

            const agendamentos = await Agendamento.getAgendamentosAtendenteByData(atendenteId, data, connection);
            if (agendamentos.length > 0)
                throw new Error("Existe agendamentos ativos para este dia! ");
            else {
                await Atendente.dayoff(atendenteId, data, connection);
                const result = await Atendente.ocuparDia(atendenteId, data, connection);
                return result;
            }
        } catch (e) {
            throw e;
        } finally {
            connection.release();
        }
    }

    async getDayOff(atendentId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const result = await Atendente.getDaysOff(atendentId, connection);
            return result;
        } catch (e) {
            throw e;
        } finally {
            connection.release();
        }

    }

    async desocuparData(atendenteId: number, data: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const result = await Atendente.desocuparData(atendenteId, data, connection);
            await Atendente.liberarDatas(atendenteId, data, connection);
            return result;
        } catch (e) {
            throw e;
        } finally {
            connection.release();
        }
    }

}

export default AtendenteController;