export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageId: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export const menuData: MenuCategory[] = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    items: [
      {
        id: 'item-1',
        name: 'Bruschetta al Pomodoro',
        description: 'Toasted bread with fresh tomatoes, garlic, basil, and olive oil.',
        price: '$9.50',
        imageId: 'appetizer-1',
      },
      {
        id: 'item-2',
        name: 'Caprese Salad',
        description: 'Fresh mozzarella, ripe tomatoes, and basil, drizzled with balsamic glaze.',
        price: '$12.00',
        imageId: 'appetizer-2',
      },
    ],
  },
  {
    id: 'main-courses',
    name: 'Main Courses',
    items: [
      {
        id: 'item-3',
        name: 'Spaghetti Carbonara',
        description: 'A classic Roman pasta with eggs, Pecorino cheese, pancetta, and black pepper.',
        price: '$18.50',
        imageId: 'main-1',
      },
      {
        id: 'item-4',
        name: 'Margherita Pizza',
        description: 'Simple yet delicious pizza with San Marzano tomatoes, mozzarella, and fresh basil.',
        price: '$16.00',
        imageId: 'main-2',
      },
      {
        id: 'item-5',
        name: 'Grilled Salmon',
        description: 'Perfectly grilled salmon fillet served with roasted asparagus and a lemon-dill sauce.',
        price: '$24.00',
        imageId: 'main-3',
      },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    items: [
      {
        id: 'item-6',
        name: 'Tiramisu',
        description: 'Layers of coffee-soaked ladyfingers and creamy mascarpone.',
        price: '$8.50',
        imageId: 'dessert-1',
      },
      {
        id: 'item-7',
        name: 'Chocolate Lava Cake',
        description: 'Warm, molten chocolate cake served with a scoop of vanilla bean ice cream.',
        price: '$9.00',
        imageId: 'dessert-2',
      },
    ],
  },
  {
    id: 'beverages',
    name: 'Beverages',
    items: [
      {
        id: 'item-8',
        name: 'House Red Wine',
        description: 'A smooth and fruity red wine, perfect with any meal.',
        price: '$8.00/glass',
        imageId: 'beverage-1',
      },
      {
        id: 'item-9',
        name: 'Fresh Iced Tea',
        description: 'Brewed in-house, served with a slice of lemon.',
        price: '$4.00',
        imageId: 'beverage-2',
      },
    ],
  },
];
