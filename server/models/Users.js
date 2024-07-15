module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        }
    })
    return Users
}