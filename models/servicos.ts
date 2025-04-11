class Servicos{
    id: number;
    nome: string;
    descricao: string;
    valor: number;
    tempoMedio: number;

    constructor(nome: string, descricao: string, valor: number, tempoMedio: number){
        this.nome = nome;
        this.descricao = descricao;
        this.valor = valor;
        this.tempoMedio = tempoMedio;
    }

    static async create(connection: any, data: Servicos) {
        const query = `INSERT INTO servicos (nome, descricao, valor, tempo_medio) VALUES (?, ?, ?, ?)`;
        try {
            const [result]: any = await connection.execute(query, [data.nome, data.descricao, data.valor, data.tempoMedio]);
            
            if (!result.insertId) {
                throw new Error("Erro ao obter ID do serviço criado");
            }
    
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }
    

    static async getServicoById(id: number, connection: any) {
        const query = `SELECT * FROM servicos WHERE id = ?`;
        try {
            const [rows]: any = await connection.execute(query, [id]);
            return rows.length > 0 ? rows[0] : null; // Retorna o primeiro item ou null
        } catch (error) {
            throw error;
        }
    }
    

    static async listarServicos(connection: any){
        const query = `SELECT * FROM servicos`;
        try {
            const result: any = await connection.execute(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(connection: any, data: Servicos, id:number) {
        const query = `UPDATE servicos SET nome = ?, descricao = ?, valor = ?, tempoMedio = ? WHERE id = ?`;
        try {
            const result = await connection.execute(query, [data.nome, data.descricao, data.valor, data.tempoMedio, data.id]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(connection: any, id: number) {
        const query = `DELETE FROM servicos WHERE id = ?`;
        try {
            const result = await connection.execute(query, [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    

}

export default Servicos;
