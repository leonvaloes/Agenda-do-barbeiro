import DatabaseManager from "../config/database";
import Servico from '../models/item';

class ServicoController {

    servico: typeof Servico;

    constructor() {
        const databaseManager = DatabaseManager.getInstance();
        this.servico = require('../model/item'); // Ajuste caso precise fazer algo específico com a classe Servico
    }

    async criarServico(dados) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `INSERT INTO servico (nome, descricao, preco) VALUES (?, ?, ?)`;

        try {
            const [result] = await connection.execute(query, [dados.nome, dados.descricao, dados.preco]);
            return { id: result.insertId, ...dados }; // Retorna o ID do serviço recém-criado
        } catch (error) {
            console.error('Erro ao criar serviço:', error);
            throw error;
        } finally {
            connection.end();
        }
    }

    async atualizarServico(id, dados) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `UPDATE servico SET nome = ?, descricao = ?, preco = ? WHERE id = ?`;

        try {
            const [result] = await connection.execute(query, [dados.nome, dados.descricao, dados.preco, id]);
            if (result.affectedRows === 0) {
                throw new Error('Serviço não encontrado');
            }
            return { id, ...dados };
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            throw error;
        } finally {
            connection.end();
        }
    }

    async deletarServico(id) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `DELETE FROM servico WHERE id = ?`;

        try {
            const [result] = await connection.execute(query, [id]);
            if (result.affectedRows === 0) {
                throw new Error('Serviço não encontrado');
            }
            return true;
        } catch (error) {
            console.error('Erro ao deletar serviço:', error);
            throw error;
        } finally {
            connection.end();
        }
    }

    async listarServicos() {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `SELECT * FROM servico`;

        try {
            const [servicos] = await connection.execute(query);
            return servicos;
        } catch (error) {
            console.error('Erro ao listar serviços:', error);
            throw error;
        } finally {
            connection.end();
        }
    }
}

module.exports = ServicoController;
