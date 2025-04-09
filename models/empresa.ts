class Empresa {
    id: number;
    nome: string;
    email: string;
    cnpj: string;
    cidade: string;
    endereco: string;
    estado: string;
    telefone: string;
    senha: string;

    constructor(nome: string, email: string, cnpj: string, cidade: string, endereco: string, estado: string, telefone: string, senha: string) {
        this.nome = nome;
        this.email = email;
        this.cnpj = cnpj;
        this.cidade = cidade;
        this.endereco = endereco;
        this.estado = estado;
        this.telefone = telefone;
        this.senha = senha;
    }

    static async create (data: Empresa, connection:any){
        const query = `INSERT INTO empresa (nome, email, cnpj, cidade, endereco, estado, telefone, senha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [data.nome, data.email, data.cnpj, data.cidade, data.endereco, data.estado, data.telefone, data.senha];
        try {
            const result = await connection.execute(query, values);
            connection.commit();
            return result;
        } catch (error) {
            connection.rollback();
            console.error('Erro ao criar empresa:', error);
            throw error;
        }
    }

    static async delete (id: number, connection:any){
        const query = `DELETE FROM empresa WHERE id = ?`;
        try {
            const result = await connection.execute(query, [id]);
            connection.commit();
            return result;
        } catch (error) {
            connection.rollback();
            console.error('Erro ao deletar empresa:', error);
            throw error;
        }
    }

    static async update (id:number, data: Empresa, connection:any){
        const query = `UPDATE empresa SET nome = ?, email = ?, cnpj = ?, cidade = ?, endereco = ?, estado = ?, telefone = ?, senha = ? WHERE id = ?`;
        try {
            await connection.execute(query, [data.nome, data.email, data.cnpj, data.cidade, data.endereco, data.estado, data.telefone, data.senha, id]);
            connection.commit();
            return {id,...data};
        } catch (error) {
            connection.rollback();
            console.error('Erro ao atualizar empresa:', error);
            throw error;
        }
    }

    async buscaEmpresa(id:number, connection: any) {
        const query = `SELECT * FROM empresa WHERE id = ?`;
        try {
            const result:any= await connection.execute(query, [id]);
            return result[0];
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
            throw error;
        }
    }


    async adicionaAtendente(connection: any, cpf: string, empresaId: number) {
        const queryBusca = `SELECT id FROM atendente WHERE cpf = ?`;
        console.log("cpf: ", cpf);
    
        try {
            const [rows]: any = await connection.execute(queryBusca, [cpf]);
    
            if (rows.length > 0) {
                const atendente = rows[0]; // Primeiro resultado
                console.log("Empresa: ", empresaId);
                
                const queryUpdate = `UPDATE atendente SET empresa_id = ? WHERE cpf = ?`;
                await connection.execute(queryUpdate, [empresaId, cpf]);
                await connection.commit();
                
                return { id: atendente.id, ...atendente };
            } else {
                throw new Error("Atendente não encontrado");
            }
        } catch (error) {
            await connection.rollback();
            console.error("Erro ao buscar atendente:", error);
            throw error;
        }
    }
    
}

export default Empresa;