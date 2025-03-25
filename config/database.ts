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

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public getConnection() {
    return this.connection;
  }

  public execute(query: string, params: any[] = []) {
    return new Promise<any[]>((resolve, reject) => {
      this.connection.execute(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows); 
        }
      });
    });
  }

  public closeConnection() {
    this.connection.end((err) => {
      if (err) {
        console.error('Erro ao fechar a conexão:', err);
      } else {
        console.log('Conexão fechada com sucesso');
      }
    });
  }


  public commitTransaction() {
    return new Promise<void>((resolve, reject) => {
      this.connection.commit((err) => {
        if (err) {
          reject(err); // Se houver erro no commit
        } else {
          resolve(); // Sucesso no commit
        }
      });
    });
  }

  // Método para desfazer a transação (rollback)
  public rollbackTransaction() {
    return new Promise<void>((resolve, reject) => {
      this.connection.rollback(() => {
        resolve();
      });
    });
  }


  public beginTransaction() {
    return new Promise<void>((resolve, reject) => {
      this.connection.beginTransaction((err) => {
        if (err) {
          reject(err); // Se houver erro ao iniciar a transação
        } else {
          resolve(); // Sucesso ao iniciar a transação
        }
      });
    });
  }


}

export default DatabaseManager;
