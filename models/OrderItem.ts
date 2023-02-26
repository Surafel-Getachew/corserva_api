import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Default,
  ForeignKey,
  BelongsToMany,
  BeforeDestroy
} from 'sequelize-typescript'
import Item from './Item'
import Order from './Order'

@Table
class OrderItem extends Model {
  @ForeignKey(() => Item)
  @Column
    itemId: number

  @ForeignKey(() => Order)
  @Column
    orderId: number

  @Column
    quantity: number

  @UpdatedAt
    updatedOn: Date

  @DeletedAt
    deletionDate: Date
}

export default OrderItem
