import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Default,
  BelongsToMany
} from 'sequelize-typescript'

import Order from './Order'
import OrderItem from './OrderItem'

export enum ItemCategory {
  ELECTRONICS = 'electronics',
  FURNITURE_HOME = 'furniture and home',
  HEALTH_BEAUTY = 'health and beauty',
  AGRICULTURE_FOOD = 'agriculture and food',
  OTHER = 'other',
}
@Table
class Item extends Model {
  @Column
    name: string

  @BelongsToMany(() => Order, () => OrderItem)
    orders: Order[]

  @Column
    count: number

  @Column
    pricePerUnit: number

  @Default(false)
  @Column
    availableForSale: boolean

  @Default(ItemCategory.OTHER)
  @Column({
    type: DataType.ENUM({ values: Object.values(ItemCategory) })
  })
    category: ItemCategory

  @CreatedAt
    creationDate: Date

  @UpdatedAt
    updatedOn: Date

  @DeletedAt
    deletionDate: Date
}

export default Item
