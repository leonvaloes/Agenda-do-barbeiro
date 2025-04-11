import DatabaseManager from '../config/database';
import Agendamento from '../models/agendamento';

class AgendamentoController {

    async avancarEstado(agendamentoId:number){
        const connection = await DatabaseManager.getInstance().getConnection();
        try{
            const agendamento = await Agendamento.getAgendamentoById(agendamentoId, connection);
            if(agendamento){
                console.log(agendamento);
                const agendamento2 = new Agendamento(agendamento[0].cliente_id,agendamento[0].item ,agendamento[0].estado);
                await agendamento2.avancarEstado(agendamentoId, connection);
                return agendamento2;
            }
        }catch(error){
            console.error('Erro ao avançar estado do agendamento:', error);
            throw error;
        }finally{
            connection.release();
        }
   
    }


}

export default AgendamentoController;
