class Item {
    id: number;
    nome: string;

    constructor(id: number, nome: string) {
        this.id = id;
        this.nome = nome;
    }

    static async getEmpresaUserIdPorItem(id: number, connection: any): Promise<number | null> {
        const query = `
            SELECT u.id as user_id
            FROM item i
            JOIN atendente a ON a.id = i.atendente_id
            JOIN empresa e ON e.id = a.empresa_id
            JOIN user u ON u.id = e.empresa_user_id
            WHERE i.id = ?
        `;
        const [rows]: any = await connection.execute(query, [id]);
        return rows.length > 0 ? rows[0].user_id : null;
    }
    
    static async getServicoIdPorItem(id: number, connection: any): Promise<number | null> {
        const query = `
            SELECT s.id as servico_id
            FROM item i
            JOIN servico s ON s.id = i.servico_id
            WHERE i.id = ?
        `;
        const [rows]: any = await connection.execute(query, [id]);
        return rows.length > 0 ? rows[0].servico_id : null;
    }

    static async getAtendenteUserIdPorItem(itemId: number, connection: any): Promise<number | null> {
        const query = `
          SELECT a.atendente_user_id
          FROM item i
          JOIN atendente a ON a.id = i.atendente_id
          WHERE i.id = ?
        `;
        const [rows]: any = await connection.execute(query, [itemId]);
        return rows.length > 0 ? rows[0].user_id : null;
    }
    
    static async getItemById(id: number, connection: any) {
        const query = `SELECT * FROM item WHERE id = ?`;
        const [rows]: any = await connection.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    
    static async atualizarItem(id: number, atendenteId: number, servicoId: number, dataHora: Date, connection: any) {
        const query = `UPDATE item SET atendente_id = ?, serv_id = ?, data_hora = ? WHERE id = ?`;
        return await connection.execute(query, [atendenteId, servicoId, dataHora, id]);
    }
}

export default Item;