import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';

@Table({
    tableName: 'installRegs',
    timestamps: true, // Isso automaticamente gerencia 'createdAt' e 'updatedAt'
})

class InstallRegsModel extends Model<InstallRegsModel> {

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    })
    id_inst!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    id_usr!: number;

    @Column({
        type: DataType.STRING(600),
        allowNull: true,
    })
    nome!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true,
    })
    endereco!: string;

    @Column({
        type: DataType.STRING(600),
        allowNull: true,
    })
    email!: string;

    @Column({
        type: DataType.STRING(600),
        allowNull: true,
    })
    telefone!: string;

    @Column({
        type: DataType.STRING(600),
        allowNull: true,
    })
    mac!: string;

    @Column({
        type: DataType.STRING(600),
        allowNull: true,
    })
    ip!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true,
    })
    observacoes!: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    data_expiracao!: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: Date.now,
    })
    data_instalacao!: string;

    @Column({
        type: DataType.STRING(600),
        allowNull: true,
    })
    status!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}

export { InstallRegsModel }