import Database from '../config/database';
import createEmpresa from './001_create_empresa.js';
import createAtendente from './002_create_atendente.js';
import createServicos from './004_create_servico.js';
import createAtendenteServ from './005_create_atendente_serv.js';
import createCliente from './003_create_cliente.js';
import createItem from './007_create_item.js';
import createAgendamento from './006_create_agendamento.js';
import createUser from './013_create_user.js';
import createNotificacao from './011_create_notificacao.js';
import createUserNotificacao from './012_create_user_notificacao.js';

import alterItem from './008_alter_item';
import alterAtendente from './009_alter_atendente';
import alterAgendamento from './010_alter_agendamento';
import alterUserCliente from './016_alter_user_cliente';
import alterUserNotificacao from './014_alter_user_notificacao';
import alterUserAtendente from './015_alter_user_atendente';
import alterUserEmpresa from './017_alter_user_empresa';
import create_expediente from './018_create_expediente';
import create_dias_semana from './019_create_dias_semana';
import alter_expediente from './020_alter_expediente';
import create_horario_atendente from './021_create_horario_atendente';
import alter_horario_atendente from './022_alter_horario_atendente';

class Migrations {
    async up() {
        console.log('Migrations running...');
        try {
            console.log('Attempting to connect to the database...');
            const db = Database.getInstance();
            const connection = await db.getConnection();

            await new createEmpresa().up(connection);
            await new createAtendente().up(connection);
            await new createCliente().up(connection);
            await new createServicos().up(connection);
            await new createAtendenteServ().up(connection);
            await new createAgendamento().up(connection);
            await new createItem().up(connection);
            await new createUser().up(connection);
            await new createNotificacao().up(connection);
            await new createUserNotificacao().up(connection);

            await new alterUserCliente().up(connection);
            await new alterItem().up(connection);
            await new alterAtendente().up(connection);
            await new alterAgendamento().up(connection);
            await new alterUserAtendente().up(connection);
            await new alterUserEmpresa().up(connection);

            await new create_expediente().up(connection);
            await new create_dias_semana().up(connection);
            await new alter_expediente().up(connection);
            await new create_horario_atendente().up(connection);
            await new alter_horario_atendente().up(connection);

            console.log('Migrations finished!');
            connection.release();
        } catch (error) {
            console.error('Error during migrations:', error);
        }
    }

    async down() {
        console.log('Rolling back migrations...');
        try {
            console.log('Attempting to connect to the database...');
            const db = Database.getInstance();
            const connection = await db.getConnection();

            // Ordem inversa de up()
            await new alter_horario_atendente().down(connection);
            await new create_horario_atendente().down(connection);
            await new alter_expediente().down(connection);
            await new create_dias_semana().down(connection);
            await new create_expediente().down(connection);

            await new alterUserEmpresa().down(connection);
            await new alterUserAtendente().down(connection);
            await new alterAgendamento().down(connection);
            await new alterAtendente().down(connection);
            await new alterItem().down(connection);
            await new alterUserCliente().down(connection);

            await new createUserNotificacao().down(connection);
            await new createNotificacao().down(connection);
            await new createUser().down(connection);
            await new createItem().down(connection);
            await new createAgendamento().down(connection);
            await new createAtendenteServ().down(connection);
            await new createServicos().down(connection);
            await new createCliente().down(connection);
            await new createAtendente().down(connection);
            await new createEmpresa().down(connection);

            console.log('Migrations rollback finished!');
            connection.release();
        } catch (error) {
            console.error('Error during rollback:', error);
        }
    }
}

// Executa o comando a partir da linha de comando
const command = process.argv[2];

if (command === 'up') {
    new Migrations().up();
} else if (command === 'down') {
    new Migrations().down();
} else {
    console.log('Please provide a valid command: "up" or "down".');
}
