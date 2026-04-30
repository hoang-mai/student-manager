module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
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
    placeOfBirth: {
      type: DataTypes.STRING(255),
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    cccdNumber: {
      type: DataTypes.STRING(20),
    },
    partyMemberCardNumber: {
      type: DataTypes.STRING(50),
    },
    enrollment: {
      type: DataTypes.INTEGER,
    },
    graduationDate: {
      type: DataTypes.DATE,
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
    currentCpa4: {
      type: DataTypes.DOUBLE,
    },
    currentCpa10: {
      type: DataTypes.DOUBLE,
    },
    familyMember: {
      type: DataTypes.JSONB,
    },
    foreignRelations: {
      type: DataTypes.JSONB,
    },
    classId: {
      type: DataTypes.UUID,
    },
    organizationId: {
      type: DataTypes.UUID,
    },
    universityId: {
      type: DataTypes.UUID,
    },
    educationLevelId: {
      type: DataTypes.UUID,
    },
  }, {
    tableName: 'students',
    timestamps: true,
    underscored: true,
  });

  return Student;
};
