import { CryptData } from '../utils';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Username is required.',
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First name is required.',
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name is required.',
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'Email address is invalid.'
        },
        notNull: {
          args: true,
          msg: 'Email address cannot be empty.'
        },
        async exists(value) {
          const user = await User.findOne({
            where: {
              email: value
            }
          });

          if (user) {
            throw new Error('User details already exist.');
          }
        }
      },
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [4],
          msg: 'Gender must be at least 4 characters long.'
        },
      }
    },
    birthdate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      }
    },
    city: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3],
          msg: 'City must be at least 3 characters long.'
        },
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3],
          msg: 'State must be at least 3 characters long.'
        },
      }
    },
    zip: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3],
          msg: 'Zip must be at least 3 characters long.'
        },
      }
    },
    country: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3],
          msg: 'Country must be at least 3 characters long.'
        },
      }
    },
    role: {
      type: DataTypes.ENUM(['Super Administrator', 'Admin',
        'Moderator'])
    },
    hasProfile: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSubscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password is required.',
        },
        len: {
          args: [6, 150],
          msg: 'Password must be more than 5 characters'
        }
      }
    },
    profileImage: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'The URL sent is not a valid URL.'
        }
      }
    },
  });

  User.beforeCreate(async user => {
    user.password = await CryptData.encryptData(user.password);
  });

  User.beforeUpdate(async user => {
    user.password = await CryptData.encryptData(user.password);
  });

  //   User.associate = models => {
  //     User.hasMany(models.Dogs, {
  //       foreignKey: 'userId',
  //       onDelete: 'CASCADE'
  //     });
  //   };

  // eslint-disable-next-line func-names
  User.prototype.verifyPassword = async function (clearPassword) {
    const isPasswordCorrect = await CryptData
      .decryptData(clearPassword, this.password);
    return isPasswordCorrect;
  };

  return User;
};
