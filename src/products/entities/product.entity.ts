export class Product {

    id: number;
    
    name: string;
    
    description: string;
    
    price: number;
    
    stock: number;
    
    image: string;
    
    created_at: Date;
    
    updated_at: Date;
    
    deleted_at: Date;
    
    constructor(partial: Partial<Product>) {
        Object.assign(this, partial);
    }
}
