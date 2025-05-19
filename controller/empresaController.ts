import DatabaseManager from "../config/database";
import Agendamento from "../models/agendamento";
import Atendente from "../models/atendente";
import Empresa from '../models/empresa';
import HorarioFuncionario from "../models/horariosFuncionario";
import unformatDate from "../type/unformatDate";

class EmpresaController {

    empresa: typeof Empresa;

    constructor() {
        this.empresa = Empresa;
    }

    async criarEmpresa(dados) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const empresaModel = new Empresa(dados.nome, dados.nome_fantasia, dados.email, dados.cnpj, dados.cidade, dados.endereco, dados.estado, dados.telefone, dados.senha, dados.empresa_user_id);
            await empresaModel.create(connection);
            connection.commit();
            return empresaModel;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async atualizarEmpresa(id: number, dados: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();

            const empresaModel = new Empresa("", "", "", "", "", "", "", "", "", 0);
            const empresaExistente = await empresaModel.buscaEmpresa(id, connection);

            if (!empresaExistente.length) {
                return null;
            }
            const empresaAtualizada = await Empresa.update(id, dados, connection);
            connection.commit();
            return empresaAtualizada;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async deletarEmpresa(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const empresaModel = new Empresa("", "", "", "", "", "", "", "", "", 0);
            const empresaExistente = await empresaModel.buscaEmpresa(id, connection);
            if (!empresaExistente.length) {
                return null;
            }
            const empresaExcluida = await Empresa.delete(id, connection);
            connection.commit();
            return empresaExcluida;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async buscarEmpresa(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const empresaModel = new Empresa("", "", "", "", "", "", "", "", "", 0);
            const empresaExistente = await empresaModel.buscaEmpresa(id, connection);
            if (!empresaExistente.length) {
                return null;
            }
            return empresaExistente;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async getEmpresaByUserId(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const result = await Empresa.getUserById(id, connection);
            if (!result.length) {
                throw new Error("Empresa não encontrada");
            }
            return result;
        } catch (e) {
            throw e;
        }
    }

    async listarEmpresas() {
        const connection = await DatabaseManager.getInstance().getConnection();
        const query = `SELECT * FROM empresa`;

        try {
            const [empresas] = await connection.execute(query);
            return empresas;
        } catch (error) {
            throw new Error('Erro ao listar empresas');
        } finally {
            connection.release();
        }
    }

    async adicionarFuncionario(cpf: string, empresaId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();

            const empresaModel = new Empresa("", "", "", "", "", "", "", "", "", 0);
            const retorno = empresaModel.adicionaAtendente(connection, cpf, empresaId);
            connection.commit();
            return retorno;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async listarServicoEmpresa(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const servicos = await Empresa.listarServicoEmpresa(id, connection);
            if (servicos)
                return servicos;

            throw new Error("Nenhum atendente encontrado");
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async getFunc(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const funcionarios = await Empresa.getFuncionarios(id, connection);
            const dadosFuncionarios = [];
            if (funcionarios && funcionarios.length > 0) {
                for (const func of funcionarios) {
                    const dados = await Atendente.getUserAtendentes(func.atendente_user_id, connection);
                    dadosFuncionarios.push({
                        ...dados[0],
                        cpf: func.cpf,
                        atendente_id: func.id
                    });
                }
                return dadosFuncionarios;
            }
            throw new Error("Nenhum atendente encontrado");
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async getEmpresaByName(nome: string) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const empresa = await Empresa.getEmpresaByName(nome, connection);
            if (empresa && empresa.length > 0)
                return empresa;
            throw new Error("Nenhuma empresa encontrada");
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }

    }

    async reagendar(itemId: any, novaData: any, atendente_id: number, agendamento_id: number, servicos: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            console.log("nova datinha: ",novaData)
            
            await connection.beginTransaction();
            const tempoServico = servicos.tempo_medio;
            const formatador = new unformatDate();

            // marcar livre antigo agendamento

            let dataAntiga= await Agendamento.getItemByAgendamento(agendamento_id, connection);
            
            dataAntiga = await formatador.FormatDate(dataAntiga);
            console.log("antiga data: ",dataAntiga);
            await HorarioFuncionario.marcarComoLivre(dataAntiga, atendente_id, connection);
            
            let dataEhoraFim = new Date(dataAntiga);
            dataEhoraFim.setMinutes(dataEhoraFim.getMinutes() + tempoServico);
            
            let auxDataHora = new Date(dataAntiga);
            while (auxDataHora < dataEhoraFim) {
                await HorarioFuncionario.marcarComoLivre(auxDataHora, atendente_id, connection);
                auxDataHora.setMinutes(auxDataHora.getMinutes() + 15);
            }

            const result = await Empresa.reagendar(itemId, novaData, connection);


            // marcar ocupado novo agendamento
            novaData = await formatador.unformatDate(novaData);
            await HorarioFuncionario.marcarComoOcupado(atendente_id, novaData, connection);
            
            dataEhoraFim = new Date(novaData);
            dataEhoraFim.setMinutes(dataEhoraFim.getMinutes() + tempoServico);
            auxDataHora = new Date(novaData);
            while (auxDataHora < dataEhoraFim) {
                await HorarioFuncionario.marcarComoOcupado(atendente_id, new Date(auxDataHora), connection);
                auxDataHora.setMinutes(auxDataHora.getMinutes() + 15);
            }
            await connection.commit();

            return result;
        } catch (e) {
            console.log(e);
        }
    }
}

export default EmpresaController;