
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

export const menuData: MenuCategory[] = [];
