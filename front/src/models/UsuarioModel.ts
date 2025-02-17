import { Sequelize, DataTypes } from 'sequelize';
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';

@Table({
    tableName: 'usuarios', // Nome da tabela alterado para "usuarios"
    timestamps: true,
})

class UsuarioModel extends Model<UsuarioModel> {
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    })
    id_usr!: number;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
    })
    owner_id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    nome!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        unique: true,
    })
    telefone!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    type_usuario!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

}

export { UsuarioModel }
