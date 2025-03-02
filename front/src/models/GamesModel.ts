import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BeforeCreate, BeforeUpdate, ForeignKey } from 'sequelize-typescript';

@Table({
    tableName: 'games',
    timestamps: true, // Isso automaticamente gerencia 'createdAt' e 'updatedAt'
})

class GamesModel extends Model<GamesModel> {

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    })
    id_game!: number;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
    })
    id_cat!: number;

    @Column({
        type: DataType.STRING(2000),
        allowNull: false,
    })
    titulo!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true,
    })
    descricao!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true,
    })
    urlRoom!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true,
    })
    videoIntoDir!: string;//upload

    @Column({
        type: DataType.STRING(2000),
        allowNull: true,
    })
    urlBanner!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true,
    })
    urlStreamIcon!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}

export { GamesModel }