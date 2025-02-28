import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';

@Table({
    tableName: 'categorias',
    timestamps: true, // Isso automaticamente gerencia 'createdAt' e 'updatedAt'
})

class CategoriasModel extends Model<CategoriasModel> {

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
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
    imagemDir!: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}

export { CategoriasModel }