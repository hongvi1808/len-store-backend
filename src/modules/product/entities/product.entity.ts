export class ProductRes {
    id: string;
    stock: number;
    slug: string;
    name: string;
    price: number;
    images: any;
    classify: any;
    description?: string | null
    categoryIds?: string[]
}
