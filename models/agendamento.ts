class Agendamento{
    id:number;
    clienteId:number;
    itemId:number;

    constructor(id:number, clienteId:number, itemId:number){
        this.id = id;
        this.clienteId = clienteId;
        this.itemId = itemId;
    }

// Inserir Agendamento
// static create(clienteId: number, itemId: number, callback: Function) {
//     const query = `INSERT INTO agendamento (clienteId, itemId) VALUES (?, ?)`;
//     connection.query(query, [clienteId, itemId], (err, results) => {
//         if (err) {
//             console.error('Erro ao inserir agendamento:', err);
//             return callback(err);
//         }
//         console.log('Agendamento inserido com sucesso');
//         callback(null, results);
//     });
// }

// // Buscar Agendamento por ID
// static getById(id: number, callback: Function) {
//     const query = `SELECT * FROM agendamento WHERE id = ?`;
//     connection.query(query, [id], (err, results) => {
//         if (err) {
//             console.error('Erro ao buscar agendamento:', err);
//             return callback(err);
//         }
//         callback(null, results[0]); // Retorna o primeiro resultado, já que estamos buscando por ID
//     });
// }

// // Atualizar Agendamento
// static update(id: number, clienteId: number, itemId: number, callback: Function) {
//     const query = `UPDATE agendamento SET clienteId = ?, itemId = ? WHERE id = ?`;
//     connection.query(query, [clienteId, itemId, id], (err, results) => {
//         if (err) {
//             console.error('Erro ao atualizar agendamento:', err);
//             return callback(err);
//         }
//         console.log('Agendamento atualizado com sucesso');
//         callback(null, results);
//     });
// }

// // Deletar Agendamento
// static delete(id: number, callback: Function) {
//     const query = `DELETE FROM agendamento WHERE id = ?`;
//     connection.query(query, [id], (err, results) => {
//         if (err) {
//             console.error('Erro ao deletar agendamento:', err);
//             return callback(err);
//         }
//         console.log('Agendamento deletado com sucesso');
//         callback(null, results);
//     });
// }
}

export default Agendamento;