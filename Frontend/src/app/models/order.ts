import { ProductOrder } from "./product-order";

export interface Order {
    id: number;
    creationTime: string;
    products: ProductOrder[];
    isCompleted: boolean;
}
