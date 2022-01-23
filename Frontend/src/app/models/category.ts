import { Product } from ".";

export interface Category {
    id: number;
    name: string;
    description: string;
    products?: Product[];
}