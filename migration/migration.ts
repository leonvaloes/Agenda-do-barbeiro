import Database from '../config/database'; 
import createEmpresa from './001_create_empresa.js';
import createAtendente from './002_create_atendente.js';
import createServicos from './004_create_servico.js';
import createAtendenteServ from './005_create_atendente_serv.js';
import createCliente from './003_create_cliente.js';
import createItem from './007_create_item.js';
import createAgendamento from './006_create_agendamento.js';
class Migrations {
    async up() {
        console.log('Migrations running...');
        let connection;
        try {
            console.log('Attempting to connect to the database...');
            connection = Database.getInstance().getConnection(); 
            await new createEmpresa().up(connection);
            await new createAtendente().up(connection);
            await new createCliente().up(connection);
            await new createServicos().up(connection);
            await new createAtendenteServ().up(connection);
            await new createItem().up(connection);

            //await new createAgendamento().up(connection);
+        

            console.log('Migrations finished!');
        } catch (error) {
            console.error('Error during migrations:', error);
        } finally {
            if (connection) {
                await connection.end(); // Fecha a conexão ao final
                console.log('Connection closed.');
            }
        }
    }

    async down() {
        console.log('Migrations running...');
        let connection;
        try {
            console.log('Attempting to connect to the database...');
            connection = Database.getInstance().getConnection();
            console.log('Connected to the database.');

            console.log('Starting createAtendenteServ migration...');
            await new createAtendenteServ().down(connection);
            console.log('createAtendenteServ migration completed.');

            console.log('Starting createServicos migration...');
            await new createServicos().down(connection);
            console.log('createServicos migration completed.');

            console.log('Starting createAtendente migration...');
            await new createAtendente().down(connection);
            console.log('createAtendente migration completed.');

            console.log('Starting createEmpresa migration...');
            await new createEmpresa().down(connection);
            console.log('createEmpresa migration completed.');

            console.log('Migrations finished!');
        } catch (error) {
            console.error('Error during migrations:', error);
        } finally {
            if (connection) {
                await connection.end(); // Fecha a conexão ao final
                console.log('Connection closed.');
            }
        }
    }
}

// Lógica para escolher entre "up" ou "down"
const command = process.argv[2]; // Pega o comando passado na linha de comando ("up" ou "down")

if (command === 'up') {
    new Migrations().up();
} else if (command === 'down') {
    new Migrations().down();
} else {
    console.log('Please provide a valid command: "up" or "down".');
}
