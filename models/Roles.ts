class Roles {
    id: number;
    nome: string;
    descricao: string;

    constructor(id: number, nome: string, descricao: string) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    static async createRole(nome: string, descricao: string, connection: any) {
        const query = `INSERT INTO roles (nome, descricao) VALUES (?, ?)`;
        try {
            const result: any = await connection.execute(query, [nome, descricao]);
            return result[0].insertId;
        } catch (error) {
            console.error('Erro ao criar role:', error);
            throw error;
        }
    }
    
    static async getRoleByName(nome: string, connection: any) {
        const query = `SELECT * FROM roles WHERE nome = ?`;
        try {
            const [rows] = await connection.execute(query, [nome]);
            return rows;
        } catch (error) {
            console.error('Erro ao buscar role:', error);
            throw error;
        }
    }
    
    static async listarRoles(connection: any) {
        const query = `SELECT * FROM roles`;
        try {
            const result: any = await connection.execute(query);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar roles:', error);
            throw error;
        }
    }
    
    static async getRoleById(id: number, connection: any) {
        const [rows] = await connection.execute('SELECT * FROM roles WHERE id = ?', [id]);
        return rows;
    }
}

export default Roles

