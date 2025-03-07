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
    id_conf!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'APP' //OPÇÕES: APP/UPDATES

    })
    type!: string;

    @Column({
        type: DataType.STRING(800),
        allowNull: false

    })
    titulo!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: false

    })
    pacote!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true

    })
    versao!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true

    })
    descricao!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true

    })
    url_apk!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}


export { ConfiguracoesModel }