export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'CUSTOMER' | 'FARMER' | 'ADMIN';
    status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: 'CUSTOMER' | 'FARMER';
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    stock: number;
    category: string;
    farmerId: string;
    images: string[];
    isActive: boolean;
    createdAt: string;
}

export interface CartItem {
    productId: Product;
    quantity: number;
    priceAtAddTime: number;
}

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    subtotal: number;
    total: number;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface OrderItem {
    productId: string;
    farmerId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    _id: string;
    orderNumber: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'CREATED' | 'PAYMENT_PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentStatus: string;
    deliveryAddress: Address;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentOrder {
    paymentId: string;
    razorpayOrderId: string;
    razorpayKeyId: string;
    amount: number;
    currency: string;
    orderNumber: string;
}
