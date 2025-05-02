const { secret, expiresIn } = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');

class AuthModel {

    static async gerarToken(id: number, nome: string, role: string){
        const payload = {
            id: id,
            nome: nome,
            role: role
        };

        const token = jwt.sign(payload, secret, { expiresIn });

        return token;

    }

    static async verificarToken(token) {
      try {
        const decoded = jwt.verify(token, secret);
        return decoded;
      } catch (error) {
        throw new Error('Token inválido ou expirado');
      }
    }
  
    static async decodificarToken(token) {
      try {
        const decoded = jwt.decode(token);
        return decoded;
      } catch (error) {
        throw new Error('Erro ao decodificar token');
      }
    }
}
  
export default AuthModel;