import Database from '../config/database.ts';
import createEmpresa from './001_create_empresa.js';
import createAtendente from './002_create_atendente.js';
import createServicos from './004_create_servico.js';
import createAtendenteServ from './005_create_atendente_serv.js';

async function runMigrations() {
    const connection = await Database.getConnection();

    try {
        console.log('Iniciando migrations...');

        await new createEmpresa().up(connection);
        await new createAtendente().up(connection);
        await new createServicos().up(connection);
        await new createAtendenteServ().up(connection);

        console.log('Migrations concluídas!');
    } catch (error) {
        console.error('Erro ao rodar migrations:', error);
    } finally {
        connection.release();
    }
}

runMigrations();
