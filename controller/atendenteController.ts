import { addDays } from 'date-fns';
import DatabaseManager from '../config/database';
import associarHorariosAtendenteDto from '../DTO/associarHorariosAtedentesDto';
import Atendente from '../models/atendente';
import HorarioFuncionario from '../models/horariosFuncionario';
import Servico from "../models/servicos";


class AtendenteController {
    atendente: typeof Atendente;

    constructor() {
        this.atendente = Atendente;
    }

    async createAtendente(atendenteData: any) { //CERTO
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const atendente = new Atendente(atendenteData.nome, atendenteData.cpf, atendenteData.senha, 0);
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

    async associarHorario(data: associarHorariosAtendenteDto) { //PRECISA FAZER A CRIAÇÃO DE 15 EM 15 MINUTOS
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
            else
                throw new Error("Nenhum atendente encontrado");
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async atualizaAtendente(id: number, dados: any) { // certo
        const connection = await DatabaseManager.getInstance().getConnection();

        try {
            connection.beginTransaction();

            const atendenteModel = new Atendente("", "", "", 0);
            const atendenteExistente = await Atendente.getAtendenteById(id, connection);

            if (atendenteExistente.length && dados.nome != null && dados.cpf != null && dados.senha != null) {
                const atendenteAtualizado = await atendenteModel.update(id, connection, dados);
                connection.commit();
                return atendenteAtualizado;
            }
            return null;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async deletarAtendente(id: number) { // CERTO
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const atendenteModel = new Atendente("", "", "", 0);
            const atendenteExistente = await Atendente.getAtendenteById(id, connection);

            if (!atendenteExistente.length)
                throw new Error("Atendente não encontrado");

            const atendenteExcluido = await atendenteModel.delete(id, connection);
            connection.commit();
            return atendenteExcluido;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async criarServicoEAssociar(data: any, atendenteId: number) { // CERTO
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const AtendenteModel = new Atendente("", "", "", 0);

            const servico = await Servico.create(connection, data);
            await AtendenteModel.Associar(connection, servico, atendenteId);
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
            console.log("ENTRA?", data);

            const funcExiste = await Atendente.getAtendenteById(atendente_id, connection);
            if (!Array.isArray(funcExiste) || funcExiste.length === 0) {
                throw new Error("Atendente não encontrado");
            }

            for (const item of data) {
                const dadosExpediente = {
                    atendente_id,
                    data_hora_entrada: item.entrada,
                    data_hora_saida: item.saida,
                    dias_semana_id: item.dia_semana
                };

                console.log("dadosExpediente: ", dadosExpediente);
                await HorarioFuncionario.createExpediente(connection, dadosExpediente);
            }

            const dataAtual = new Date();
            for (let i = 0; i < 90; i++) {
                const dia = addDays(dataAtual, i);

                const diaSemana = dia.getDay() === 0 ? 1 : dia.getDay()+1;

                for (const item of data) {
                    
                    if (parseInt(item.dia_semana) === diaSemana && item.entrada !== '00:00') {
                        const dados = {
                            atendente_id,
                            data_hora_entrada: item.entrada,
                            data_hora_saida: item.saida,
                            dias_semana_id: item.dia_semana
                        };
                        console.log("DADOS: ", dados);
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

}

export default AtendenteController;
