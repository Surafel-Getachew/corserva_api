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
import OrderItem from './OrderItem'

@Table
class Order extends Model {
  @Column
    deliveryDate: Date

  @BelongsToMany(() => Item, () => OrderItem)
    items: Item[]

  @BeforeDestroy
  static async deleteOrderItemRows (order: Order): Promise<void> {
    await OrderItem.destroy({
      where: {
        orderId: order.id
      }
    })
  }

  @CreatedAt
    creationDate: Date

  @UpdatedAt
    updatedOn: Date

  @DeletedAt
    deletionDate: Date
}

export default Order
