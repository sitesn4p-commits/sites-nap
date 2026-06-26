export type ProductCondition = "new" | "used" | "refurbished";

export type PaymentMethod = "cod" | "bank_transfer";

export type OrderStatus = "new" | "confirmed" | "packed" | "completed" | "cancelled";

export type ProductSpec = {
  name: string;
  value: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  condition: ProductCondition;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  description: string;
  specs: ProductSpec[];
  featured: boolean;
  active: boolean;
  ratingAverage: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Slider = {
  id: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  href: string;
  desktopImage: string;
  mobileImage: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReviewReply = {
  message: string;
  author: string;
  createdAt: string;
};

export type Review = {
  id: string;
  productId: string;
  productTitle: string;
  name: string;
  whatsapp?: string;
  rating: number;
  title: string;
  comment: string;
  approved: boolean;
  reply?: ReviewReply;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image?: string;
  brand: string;
  stock: number;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CustomerDetails = {
  fullName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  codCharge: number;
  total: number;
  createdAt: string;
  updatedAt: string;
};
