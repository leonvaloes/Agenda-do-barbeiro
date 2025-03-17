module.exports = (sequelize, Atendente, Servicos) => {
    const AtendenteServicos = sequelize.define('AtendenteServicos', {}, { timestamps: false });

    Atendente.belongsToMany(Servicos, { through: AtendenteServicos, foreignKey: 'atendenteId' });
    Servicos.belongsToMany(Atendente, { through: AtendenteServicos, foreignKey: 'servicoId' });

    return AtendenteServicos;
};
