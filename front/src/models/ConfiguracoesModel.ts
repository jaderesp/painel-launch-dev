import { Model, Table, Column, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
    tableName: 'configuracoes',
    timestamps: true,
})
class ConfiguracoesModel extends Model<ConfiguracoesModel> {

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    })
    idConf!: number;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
    })
    id_conta!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "CONTACT"
    })
    type!: string;


    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    horai!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    horaf!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    dia_semana!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    msg_offline!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}


export { ConfiguracoesModel }