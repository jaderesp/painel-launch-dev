// src/models/Conta.ts
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';

@Table({
    tableName: 'contas',
    timestamps: true, // Isso automaticamente gerencia 'createdAt' e 'updatedAt'
})

class ContaModel extends Model<ContaModel> {

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    })
    id_conta!: number;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
    })
    id_owner!: number;

    @Column({
        type: DataType.STRING(2000),
        allowNull: false,
    })
    token!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}

export default ContaModel