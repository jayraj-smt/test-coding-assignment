import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';
import User from './User';

interface GenerationAttributes {
  id: string;
  userId: string;
  prompt: string;
  style: string;
  imageUrl: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

interface GenerationCreationAttributes
  extends Optional<GenerationAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Generation
  extends Model<GenerationAttributes, GenerationCreationAttributes>
  implements GenerationAttributes
{
  public id!: string;
  public userId!: string;
  public prompt!: string;
  public style!: string;
  public imageUrl!: string;
  public status!: 'pending' | 'completed' | 'failed';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Generation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    style: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'completed',
    },
  },
  {
    sequelize,
    tableName: 'generations',
    timestamps: true,
  }
);

User.hasMany(Generation, { foreignKey: 'userId', as: 'generations' });
Generation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Generation;
