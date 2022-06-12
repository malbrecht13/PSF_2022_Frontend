import { OrderItem } from "./order-item";
import { User } from '@prairiepsalmfarm/users';

export class Order {
  id?: string;
  orderItems?: OrderItem[];
  shippingAddress1?: string;
  shippingAddress2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  status?: string;
  totalPrice?: string;
  user?: any;
  dateOrdered?: string;
}