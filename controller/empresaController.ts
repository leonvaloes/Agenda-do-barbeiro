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
            return empresaModel;
        } catch (error) {
            connection.rollback();
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
            const empresaModel= new Empresa("", "", "", "", "", "", "", "", 0);
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

            const empresaModel= new Empresa("", "", "", "", "", "","", "", 0);
            const retorno=empresaModel.adicionaAtendente(connection, cpf, empresaId);
            connection.commit();
            return retorno;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default EmpresaController;
