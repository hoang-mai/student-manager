module.exports = (sequelize, DataTypes) => {
  const Commander = sequelize.define('Commander', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    commanderId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING(100),
    },
    gender: {
      type: DataTypes.STRING(20),
    },
    birthday: {
      type: DataTypes.DATE,
    },
    placeOfBirth: {
      type: DataTypes.STRING(255),
    },
    hometown: {
      type: DataTypes.STRING(255),
    },
    ethnicity: {
      type: DataTypes.STRING(50),
    },
    religion: {
      type: DataTypes.STRING(50),
    },
    currentAddress: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
    },
    cccd: {
      type: DataTypes.STRING(20),
    },
    partyMemberCardNumber: {
      type: DataTypes.STRING(50),
    },
    startWork: {
      type: DataTypes.INTEGER,
    },
    organization: {
      type: DataTypes.STRING(255),
    },
    unit: {
      type: DataTypes.STRING(255),
    },
    rank: {
      type: DataTypes.STRING(50),
    },
    positionGovernment: {
      type: DataTypes.STRING(100),
    },
    positionParty: {
      type: DataTypes.STRING(100),
    },
    fullPartyMember: {
      type: DataTypes.DATE,
    },
    probationaryPartyMember: {
      type: DataTypes.DATE,
    },
    dateOfEnlistment: {
      type: DataTypes.DATE,
    },
    avatar: {
      type: DataTypes.STRING(255),
    },
  }, {
    tableName: 'commanders',
    timestamps: true,
    underscored: true,
  });

  return Commander;
};
