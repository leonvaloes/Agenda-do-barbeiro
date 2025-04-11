import DatabaseManager from "../config/database";
import Empresa from '../models/empresa';

class EmpresaController {

    empresa: typeof Empresa;

    constructor() {
        this.empresa = Empresa;
    }

    async criarEmpresa(dados) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const empresaModel = new Empresa(dados.nome, dados.email, dados.cnpj, dados.cidade, dados.endereco, dados.estado, dados.telefone, dados.senha, dados.empresa_user_id);
            await empresaModel.create(connection);
            connection.commit();
        } catch (error) {
            connection.rollback();
            console.error('Erro ao criar empresa2:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async atualizarEmpresa(id:number, dados:any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();

            const empresaModel = new Empresa("", "", "", "", "", "", "", "", 0);
            const empresaExistente = await empresaModel.buscaEmpresa(id, connection);

            if (!empresaExistente.length) {
                throw new Error("Empresa não encontrada.");
            }
            const empresaAtualizada = await Empresa.update(id, dados, connection);
            connection.commit();
            return empresaAtualizada;
        } catch (error) {
            connection.rollback();
            console.error('Erro ao atualizar empresa:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async deletarEmpresa(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const empresaModel= new Empresa("", "", "", "", "", "", "", "", 0);
            const empresaExistente = await empresaModel.buscaEmpresa(id, connection);
            if (!empresaExistente.length) {
                throw new Error("Empresa não encontrada.");
            }
            const empresaExcluida = await Empresa.delete(id, connection);
            connection.commit();
            return empresaExcluida;
        } catch (error) {
            connection.rollback();
            console.error('Erro ao deletar empresa:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async listarEmpresas() {
        const connection = await DatabaseManager.getInstance().getConnection();
        const query = `SELECT * FROM empresa`;

        try {
            const [empresas] = await connection.execute(query);
            return empresas;
        } catch (error) {
            console.error('Erro ao listar empresas:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async adicionarFuncionario(cpf: string, empresaId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();

            const empresaModel= new Empresa("", "", "", "", "", "","", "", 0);
            empresaModel.adicionaAtendente(connection, cpf, empresaId);
            connection.commit();
        } catch (error) {
            connection.rollback();
            console.error('Erro ao adicionar funcionário:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default EmpresaController;
