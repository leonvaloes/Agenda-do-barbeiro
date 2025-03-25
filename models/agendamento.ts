class Agendamento{
    id:number;
    clienteId:number;
    itemId:number;

    constructor(clienteId:number, itemId:number){
        this.clienteId = clienteId;
        this.itemId = itemId;
    }

 //Inserir Agendamento
 static create(clienteId: number, itemId: number, connection:any) {
     const query = `INSERT INTO agendamento (clienteId, itemId) VALUES (?, ?)`;
     connection.query(query, [clienteId, itemId], (err, results) => {
         if (err) {
             console.error('Erro ao criar agendamento:', err);
             return;
         }
         console.log('Agendamento criado com sucesso');
     });
 }

  //Buscar Agendamento por ID
 static getById(id: number, callback: Function, connection:any) {
     const query = `SELECT * FROM agendamento WHERE id = ?`;
     connection.query(query, [id], (err, results) => {
         if (err) {
             console.error('Erro ao buscar agendamento por ID:', err);
             return callback(err);
         }
         if (results.length === 0) {
             console.log('Agendamento não encontrado');
             return callback(null, null);
         }
         console.log('Agendamento encontrado');
         callback(null, results[0]);
     });
 }

  //Atualizar Agendamento
 static update(id: number, clienteId: number, itemId: number, callback: Function, connection:any) {
     const query = `UPDATE agendamento SET clienteId = ?, itemId = ? WHERE id = ?`;
     connection.query(query, [clienteId, itemId, id], (err, results) => {
         if (err) {
             console.error('Erro ao atualizar agendamento:', err);
             return callback(err);
         }
         console.log('Agendamento atualizado com sucesso');
         callback(null, results);
     });
 }

  //Deletar Agendamento
 static delete(id: number, callback: Function, connection:any) {
     const query = `DELETE FROM agendamento WHERE id = ?`;
     connection.query(query, [id], (err, results) => {
         if (err) {
             console.error('Erro ao deletar agendamento:', err);
             return callback(err);
         }
         console.log('Agendamento deletado com sucesso');
         callback(null, results);
     });
 }
}

export default Agendamento;