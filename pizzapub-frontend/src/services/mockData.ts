export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  badge?: string;
}

export const categories: Category[] = [
  { id: 'pizzas', name: 'Pizzas', icon: '🍕' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'drinks', name: 'Bebidas', icon: '🥤' },
  { id: 'desserts', name: 'Doces', icon: '🍰' },
];

export const products: Product[] = [
  {
    id: 'p1',
    categoryId: 'pizzas',
    name: 'Calabresa Defumada',
    description: 'Molho de tomate pelado, mozzarella fior di latte, fatias de calabresa artesanal e orégano fresco.',
    price: 54.90,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop',
    badge: '🔥 Mais Pedida'
  },
  {
    id: 'p2',
    categoryId: 'pizzas',
    name: 'Margherita DOC',
    description: 'Molho San Marzano, mozzarella fresca, manjericão e azeite extra virgem.',
    price: 49.90,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop' // placeholder
  },
  {
    id: 'p3',
    categoryId: 'pizzas',
    name: 'Pepperoni Especial',
    description: 'Generosas fatias de pepperoni, queijo parmesão ralado e pimenta calabresa.',
    price: 58.90,
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'b1',
    categoryId: 'burgers',
    name: 'Pub Smash Double',
    description: 'Dois blends de 100g, duplo cheddar, bacon crocante, picles e molho especial no pão brioche.',
    price: 38.90,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'd1',
    categoryId: 'drinks',
    name: 'Chopp Artesanal IPA',
    description: 'Copo 500ml de chopp IPA bem gelado.',
    price: 18.00,
    imageUrl: 'https://images.unsplash.com/photo-1657223015486-7785eb3d15ff?q=80&w=500&auto=format&fit=crop'
  }
];
