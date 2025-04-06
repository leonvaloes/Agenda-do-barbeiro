import mysql, { Pool, PoolConnection } from 'mysql2/promise';

class DatabaseManager {
  private static instance: DatabaseManager;
  private pool: Pool;

  private constructor() {
    this.pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'meubanco',
      password: 'rootpassword',
    });
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async getConnection(): Promise<PoolConnection> {
    return await this.pool.getConnection();
  }

  public async execute(query: string, params: any[] = []): Promise<any> {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute(query, params);
      return rows;
    } finally {
      connection.release();
    }
  }

  public async closePool(): Promise<void> {
    await this.pool.end();
    console.log('Conexões do pool fechadas');
  }
}

export default DatabaseManager;
