module.exports = (sequelize ,DataTypes) => {
    return sequelize.define('Like', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      postId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Posts',
          key: 'id'
        }
        , onDelete:'CASCADE'
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
        , onDelete:'CASCADE'
      },
      isLike : {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false
      }, {
          classMethods: {
              associate: (models) => {
                models.Like.belongsTo(models.User, 
                  { foreignKey: {
                    allowNull: false
                   
                  }, onDelete:'ON CASCADE',
                }),
                  models.Like.belongsTo(models.Post, 
                    { foreignKey: {
                      allowNull: false,
                         
                    },onDelete:'ON CASCADE',
                  })  
              }
          }
      }
)}
