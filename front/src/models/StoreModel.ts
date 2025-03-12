import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';

@Table({
    tableName: 'storeApps',
    timestamps: true, // Isso automaticamente gerencia 'createdAt' e 'updatedAt'
})

class StoreModel extends Model<StoreModel> {

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    })
    id_store!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    id_usr!: number;

    @Column({
        type: DataType.STRING(2000),
        allowNull: false,
    })
    titulo!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true,
    })
    url_img!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true,
    })
    url_apk!: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: true,
    })
    anotacoes!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}

export { StoreModel }