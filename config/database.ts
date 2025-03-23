// src/config/database.ts

import mysql from 'mysql2';

class DatabaseManager {
  private static instance: DatabaseManager;
  private connection;

  private constructor() {
    // Cria a conexão com o banco de dados
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'meubanco',
      password:'rootpassword'
    });
  }

  // Método para pegar a instância do DatabaseManager
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  // Método para pegar a conexão
  public getConnection() {
    return this.connection;
  }

  // Método para executar uma consulta SQL
  public execute(query: string, params: any[] = []) {
    return new Promise<any[]>((resolve, reject) => {
      this.connection.execute(query, params, (err, rows) => {
        if (err) {
          reject(err); // Se houver erro, rejeita a promise
        } else {
          resolve(rows); // Se sucesso, resolve com os dados
        }
      });
    });
  }

  // Método para fechar a conexão
  public closeConnection() {
    this.connection.end((err) => {
      if (err) {
        console.error('Erro ao fechar a conexão:', err);
      } else {
        console.log('Conexão fechada com sucesso');
      }
    });
  }
}

export default DatabaseManager;
