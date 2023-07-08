const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const UserSocialLogins = sequelize.define('UserSocialLogins', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        authorized: {
            type: DataTypes.DATE,
            allowNull: true
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: true
        },
        providerUserId: {
            type: DataTypes.STRING,
        },
        revoked: {
            type: DataTypes.STRING,
            allowNull: true
        },
        providerOrganizationId: {
            type: DataTypes.STRING,
            allowNull: true
        },

    }, {
        scopes: {}
    });

    return UserSocialLogins;

};
