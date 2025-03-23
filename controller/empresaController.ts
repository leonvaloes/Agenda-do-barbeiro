import DatabaseManager from "../config/database";
import Empresa from '../models/empresa';

class EmpresaController {

    empresa: typeof Empresa;

    constructor() {
        const databaseManager = DatabaseManager.getInstance();
        this.empresa = require('../model/empresa'); // Ajuste caso precise fazer algo específico com a classe Empresa
    }

    async criarEmpresa(dados) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `INSERT INTO empresa (nome, cnpj, endereco) VALUES (?, ?, ?)`;

        try {
            const [result] = await connection.execute(query, [dados.nome, dados.cnpj, dados.endereco]);
            return { id: result.insertId, ...dados }; // Retorna o ID da empresa recém-criada
        } catch (error) {
            console.error('Erro ao criar empresa:', error);
            throw error;
        } finally {
            connection.end();
        }
    }

    async atualizarEmpresa(id, dados) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `UPDATE empresa SET nome = ?, cnpj = ?, endereco = ? WHERE id = ?`;

        try {
            const [result] = await connection.execute(query, [dados.nome, dados.cnpj, dados.endereco, id]);
            if (result.affectedRows === 0) {
                throw new Error('Empresa não encontrada');
            }
            return { id, ...dados };
        } catch (error) {
            console.error('Erro ao atualizar empresa:', error);
            throw error;
        } finally {
            connection.end();
        }
    }

    async deletarEmpresa(id) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `DELETE FROM empresa WHERE id = ?`;

        try {
            const [result] = await connection.execute(query, [id]);
            if (result.affectedRows === 0) {
                throw new Error('Empresa não encontrada');
            }
            return true;
        } catch (error) {
            console.error('Erro ao deletar empresa:', error);
            throw error;
        } finally {
            connection.end();
        }
    }

    async listarEmpresas() {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `SELECT * FROM empresa`;

        try {
            const [empresas] = await connection.execute(query);
            return empresas;
        } catch (error) {
            console.error('Erro ao listar empresas:', error);
            throw error;
        } finally {
            connection.end();
        }
    }
}

module.exports = EmpresaController;
