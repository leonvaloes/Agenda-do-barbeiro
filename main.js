(async() =>{

    const database=required('./db');
    const Destinatario=require('./Model/Destinatario.js')
    const Notificacao=require('./Model/Notifacacao.js')

    await database.sync();

}) ();
