import Cliente from "models/cliente";
import DatabaseManager from "../config/database";

class ClienteController {

    cliente: typeof Cliente;

    constructor() {
        const databaseManager = DatabaseManager.getInstance();
        this.cliente = require('../model/cliente'); // Ajuste aqui caso precise fazer algo específico com a classe Cliente
    }

    async criarCliente(dados) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `INSERT INTO cliente (nome, telefone, email) VALUES (?, ?, ?)`;

        try {
            const [results] = await connection.execute(query, [dados.nome, dados.telefone, dados.email]);
            return { id: results.insertId, ...dados }; // Retorna o ID do cliente recém-criado
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        } finally {
            connection.end();
        }
    }

    async atualizarCliente(id, dados) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `UPDATE cliente SET nome = ?, telefone = ?, email = ? WHERE id = ?`;

        try {
            const [result] = await connection.execute(query, [dados.nome, dados.telefone, dados.email, id]);
            if (result.affectedRows === 0) {
                throw new Error('Cliente não encontrado');
            }
            return { id, ...dados };
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        } finally {
            connection.end();
        }
    }

    async deletarCliente(id) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `DELETE FROM cliente WHERE id = ?`;

        try {
            const [result] = await connection.execute(query, [id]);
            if (result.affectedRows === 0) {
                throw new Error('Cliente não encontrado');
            }
            return true;
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            throw error;
        } finally {
            connection.end();
        }
    }

    async listarClientes() {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `SELECT * FROM cliente`;

        try {
            const [clientes] = await connection.execute(query);
            return clientes;
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            throw error;
        } finally {
            connection.end();
        }
    }
}

export = ClienteController;
