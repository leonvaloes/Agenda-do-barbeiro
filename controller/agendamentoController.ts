import DatabaseManager from '../config/database';
import Agendamento from '../models/agendamento';
import { LogEstadoSistema } from '../models/agendamentoNotificacaoObserver/logEstado';
import { NotificacaoAtendente } from '../models/agendamentoNotificacaoObserver/notificacaoAtendente';
import { NotificacaoCliente } from '../models/agendamentoNotificacaoObserver/notificacaoCliente';
import { NotificacaoEstabelecimento } from '../models/agendamentoNotificacaoObserver/notificacaoEstabelecimento';
import Atendente from '../models/atendente';
import Empresa from '../models/empresa';
import HorarioFuncionario from '../models/horariosFuncionario';
import Item from '../models/item';
import Servicos from '../models/servicos';
import unformatDate from '../type/unformatDate';

class AgendamentoController {

    async avancarEstado(agendamentoId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();

        try {
            const resultado = await Agendamento.getAgendamentoById(agendamentoId, connection);

            if (resultado && resultado.length > 0) {
                const dados = resultado[0];
                const agendamento = new Agendamento(dados.cliente_id, dados.item_id, dados.estado,dados.id);

                // Notifica o cliente
                agendamento.adicionarObservador(new NotificacaoCliente());
                // Log do sistema
                agendamento.adicionarObservador(new LogEstadoSistema());

                // Notifica empresa responsável
                const empresaUserId = await Item.getEmpresaUserIdPorItem(dados.item_id, connection);
                if (empresaUserId) {
                    agendamento.adicionarObservador(new NotificacaoEstabelecimento(empresaUserId));
                }

                // Notifica atendente responsável
                const atendenteUserId = await Item.getAtendenteUserIdPorItem(dados.item_id, connection);
                if (atendenteUserId) {
                    agendamento.adicionarObservador(new NotificacaoAtendente(atendenteUserId));
                }

                await agendamento.avancarEstado(agendamentoId, connection);
                return agendamento;
            } else {
                throw new Error(`Agendamento com ID ${agendamentoId} não encontrado.`);
            }
        } catch (error) {
            console.error('Erro ao avançar estado do agendamento:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async cancelarAgendamento(agendamentoId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();

        try {
            const resultado = await Agendamento.getAgendamentoById(agendamentoId, connection);
            console.log(resultado);
            if (resultado && resultado.length > 0) {
                const dados = resultado[0];
                const agendamento = new Agendamento(dados.cliente_id, dados.item_id, dados.estado, dados.id);

                // Notifica o cliente
                agendamento.adicionarObservador(new NotificacaoCliente());

                // Log do sistema
                agendamento.adicionarObservador(new LogEstadoSistema());

                // Notifica empresa responsável
                const empresaUserId = await Item.getEmpresaUserIdPorItem(dados.item_id, connection);
                if (empresaUserId) {
                    agendamento.adicionarObservador(new NotificacaoEstabelecimento(empresaUserId));
                }
                
                // Notifica atendente responsável
                const atendenteUserId = await Item.getAtendenteUserIdPorItem(dados.item_id, connection);
                if (atendenteUserId) {
                    agendamento.adicionarObservador(new NotificacaoAtendente(atendenteUserId));
                }
                //const dataHora= await HorarioFuncionario.marcarComoLivre(agendamentoId, connection);
                await agendamento.cancelarAgendamento(agendamentoId, connection);
                connection.commit();
                return agendamento;
            } else {
                throw new Error(`Agendamento com ID ${agendamentoId} não encontrado.`);
            }
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAgendamentos(atendenteId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const [existe] = await Atendente.getAtendenteById(atendenteId, connection);
            if (existe.length <= 0)
                throw new Error(`Atendente não encontrado`);
            const agendamentos = await Agendamento.getAgendamentos(atendenteId, connection);
            return agendamentos;
        }catch(e){
            console.error("Erro ao buscar agendamentos", e);
            throw e;
        } finally {
            connection.release();
        }
    }

    static async getProximosAgendamentos(atendenteId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const [existe] = await Atendente.getAtendenteById(atendenteId, connection);
            if (existe.length <= 0)
                throw new Error(`Atendente não encontrado`);
            const agendamentos = await Agendamento.getProximosAgendamentos(atendenteId, connection);
            return agendamentos;
        }catch(e){
            console.error("Erro ao buscar agendamentos", e);
            throw e;
        } finally {
            connection.release();
        }
    }

    static async getAgendamentosDoDia(atendenteId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const [existe] = await Atendente.getAtendenteById(atendenteId, connection);
            if (existe.length <= 0)
                throw new Error(`Atendente não encontrado`);
            const agendamentos = await Agendamento.getAgendamentosDoDia(atendenteId, connection);
            return agendamentos;
        }catch(e){
            console.error("Erro ao buscar agendamentos", e);
            throw e;
        } finally {
            connection.release();
        }
    }
    

    static async getAgendamentosByEmpresa(EmpresaId:number) {
        const connection= await DatabaseManager.getInstance().getConnection();
        try {
            const agendamentos = await Agendamento.getAgendamentosByEmpresa(EmpresaId, connection);
            console.log("agendamentos: ",agendamentos)
            return agendamentos;
        }catch(e){
            console.error("Erro ao buscar agendamentos", e);
            throw e;
        } finally {
            connection.release();
        }
    }   

    static async getAgendamentosByCliente(ClienteId:number) {
        const connection= await DatabaseManager.getInstance().getConnection();
        try {
            const agendamentos = await Agendamento.getAgendamentosByCliente(ClienteId, connection);
            return agendamentos;
        }catch(e){
            console.error("Erro ao buscar agendamentos", e);
            throw e;
        } finally {
            connection.release();
        }
    }   

    static async getAgendamentosDaSemana(empresaId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const agendamentos = await Agendamento.getAgendamentosPorSemanaByEmpresa(empresaId, connection);
            return agendamentos;
        }catch(e){
            console.error("Erro ao buscar agendamentos", e);
            throw e;
        } finally {
            connection.release();
        }
    }
    }   

    static async editAgendamentos(agendamentoId:number, clienteId:number, atendenteId:number, servicoId:number, dataHora:any){
        const connection= await DatabaseManager.getInstance().getConnection();
        try{
            await connection.beginTransaction();
            const resultado = await Agendamento.getAgendamentoById(agendamentoId, connection);
            if(!resultado || resultado.length === 0){
                throw new Error(`Agendamento com ID ${agendamentoId} não encontrado`);
            }
            
            const formatador = new unformatDate();
            dataHora = await formatador.unformatDate(dataHora);
            
            const servico = await Servicos.getServicoById(servicoId, connection);
            if (!servico) {
                throw new Error("Serviço não encontrado");
            }
            
            // Verificar disponibilidade do novo horário
            const horarioValido = await Agendamento.validarDisponibilidade(atendenteId, dataHora, connection);
            if (!horarioValido) {
                throw new Error("Horário indisponível para agendamento.");
            }
            
            // Obter o item atual para liberar o horário antigo
            const dadosAtuais = resultado[0];
            const itemAtual = await Item.getItemById(dadosAtuais.item_id, connection);
            
            // Atualizar o item existente com os novos dados
            await Item.atualizarItem(dadosAtuais.item_id, atendenteId, servicoId, dataHora, connection);
            
            // Atualizar o agendamento
            await Agendamento.atualizarAgendamento(agendamentoId, clienteId, dadosAtuais.item_id, connection);
            
            // Notificar sobre a alteração
            const agendamentoObj = new Agendamento(clienteId, dadosAtuais.item_id, dadosAtuais.estado, agendamentoId);
            agendamentoObj.adicionarObservador(new NotificacaoCliente());
            agendamentoObj.adicionarObservador(new LogEstadoSistema());
            
            // Notifica empresa responsável
            const empresaUserId = await Item.getEmpresaUserIdPorItem(dadosAtuais.item_id, connection);
            if (empresaUserId) {
                agendamentoObj.adicionarObservador(new NotificacaoEstabelecimento(empresaUserId));
            }
            
            // Notifica atendente responsável
            const atendenteUserId = await Item.getAtendenteUserIdPorItem(dadosAtuais.item_id, connection);
            if (atendenteUserId) {
                agendamentoObj.adicionarObservador(new NotificacaoAtendente(atendenteUserId));
            }
            
            // Ocupar o novo horário
            const tempoServico = servico.tempo_medio;
            let dataHoraFim = new Date(dataHora);
            dataHoraFim.setMinutes(dataHoraFim.getMinutes() + tempoServico);
            let auxDataHora = new Date(dataHora);
            while (auxDataHora < dataHoraFim) {
                await HorarioFuncionario.marcarComoOcupado(atendenteId, new Date(auxDataHora), connection);
                auxDataHora.setMinutes(auxDataHora.getMinutes() + 15);
            }
        }
        catch(e){
            console.error("Erro ao buscar agendamentos", e);
            throw e;
        } finally {
            connection.release();
        }
    }
}

export default AgendamentoController;