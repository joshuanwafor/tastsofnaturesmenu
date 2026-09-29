export interface MenuItem {
  name: string;
  price: number;
  description?: string;
  note?: string; // small caps line under the name: bottle size, origin, base
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface CourseOption {
  name: string;
  description: string;
}

// Signature Dining is the only experience booked and paid for online.
export const SIGNATURE_DINING = {
  name: 'Signature Dining for Two',
  price: 150000,
  guestsPerPackage: 2,
};

export const signatureCourses: Record<'starters' | 'mains' | 'desserts', CourseOption[]> = {
  starters: [
    { name: 'Savory Gold', description: 'Roasted plantain, seasoned beef, cheese & herbs.' },
    { name: 'Velvety Crisps & Yogurt Dip', description: 'House-seasoned crisps with creamy herb yogurt dip.' },
  ],
  mains: [
    { name: 'Velvety Ribeye & Mash', description: 'Ribeye, creamy mash, seasonal vegetables & house jus.' },
    { name: 'Honey-Glazed Salmon', description: 'Glazed salmon, velvety mash & seasonal vegetables.' },
    { name: 'The Artisan Chop', description: 'Grilled lamb chop, creamy mash, seasonal vegetables & mint jus.' },
    { name: 'Cajun Alfredo', description: 'Cajun grilled prawns, fettuccine pasta, alfredo sauce & parmesan.' },
    { name: 'Herb-Roasted Chicken', description: 'Herb-roasted chicken, creamy mash, seasonal vegetables & house gravy.' },
    { name: 'Lamo Signature Salad', description: 'Crispy chicken, fresh fruits, greens, parmesan & creamy house dressing.' },
  ],
  desserts: [
    { name: 'Citrus Parfait', description: 'Layers of citrus cream, vanilla crumble, fresh berries & citrus gel.' },
    { name: 'Warm Berry Compote', description: 'Warm mixed berries with vanilla cream & almond crumble.' },
    {
      name: 'Spiced Apple & Mint Cream Cake',
      description:
        'Soft cake layered with silky cream, served with cinnamon-spiced apple compote & fresh mint. Available with a sweet red wine infusion on request.',
    },
  ],
};

export function countSignaturePackages(items: { name: string; quantity: number }[]): number {
  return items
    .filter((item) => item.name === SIGNATURE_DINING.name)
    .reduce((count, item) => count + item.quantity, 0);
}

// Walk-in, beverage and cigar menus are view only — ordered in person.
export const walkInMenu: MenuSection[] = [
  {
    title: 'Starters',
    items: [
      { name: 'Velvety Crisps & Yogurt Dip', price: 20000, description: 'House-seasoned crisps with creamy herb yogurt dip.' },
      { name: 'Golden Cream Pops', price: 20000, description: 'Golden bites with a creamy cheese centre, served on popsicle sticks.' },
      { name: 'Golden Gathering', price: 25000, description: 'Shrimp rolls, sausage puffs, vegetable samosas & house dip.' },
    ],
  },
  {
    title: 'Mains',
    items: [
      { name: 'Bature Beer Curated Pairing', price: 22500, description: 'Bature craft beer paired with flame-grilled beef skewers, peppers, signature accompaniment & house sauce.' },
      { name: 'Chicken Roulade & Golden Croquette', price: 30000, description: 'Stuffed chicken roulade, crispy potato croquette & creamy herb sauce.' },
      { name: 'Charred Mushroom & Plantain Rice', price: 30000, description: 'Fragrant rice, charred mushrooms, caramelised plantain & roasted vegetables.' },
      { name: 'Smokey Glazed Chicken Herb Rice', price: 30000, description: 'Char-grilled chicken, fragrant herb rice, rich pepper sauce & toasted sesame.' },
      { name: 'Herb Chicken Linguine', price: 35000, description: 'Grilled chicken, linguine, sautéed peppers & creamy herb sauce.' },
      { name: 'Grilled Beef & Mash', price: 40000, description: 'Grilled beef, creamy mashed potatoes, seasonal vegetables & pepper sauce.' },
      { name: 'Char-Grilled Fish', price: 40000, description: 'Char-grilled fish, herb potatoes, seasonal vegetables & lemon cream sauce.' },
      { name: 'Creamy Ember Harvest', price: 45000, description: 'Fire-seared beef, golden potatoes, garden peppers & creamy house sauce.' },
    ],
  },
  {
    title: 'Dessert',
    items: [
      { name: 'Fruity Parfait', price: 20000, description: 'Creamy yogurt, fresh seasonal fruit & crunchy granola.' },
    ],
  },
];

export const beverageCollection: MenuSection[] = [
  {
    title: 'Cocktails',
    items: [
      { name: 'Aperol Bloom', price: 30000 },
      { name: 'Noir Royale', price: 25000 },
      { name: 'Aurora Peach', price: 30000 },
      { name: 'Cosmopolitan', price: 25000 },
      { name: 'Solare', price: 25000 },
      { name: 'Black Arrow', price: 20000, note: 'Bature Black Gold Stout cocktail' },
    ],
  },
  {
    title: 'Mocktails',
    items: [
      { name: 'Celeste Kiwi', price: 20000 },
      { name: 'Passion Tropique', price: 25000 },
      { name: 'Verdant Sparks', price: 20000 },
      { name: 'Virgin Sangria', price: 20000 },
    ],
  },
  {
    title: 'Premium Water',
    items: [
      { name: 'Voss Still', price: 15000, note: '800ml' },
      { name: 'Voss Sparkling', price: 15000, note: '800ml' },
      { name: 'Voss Still', price: 10000, note: '500ml' },
      { name: 'Voss Lemon', price: 15000, note: '500ml' },
      { name: 'Evian Water', price: 15000, note: '800ml' },
    ],
  },
  {
    title: 'Beer',
    items: [
      { name: 'Bature Founders Pale Ale', price: 5500 },
      { name: 'Bature Black Gold Stout', price: 6000 },
    ],
  },
];

export const cigarCollection: MenuItem[] = [
  { name: 'Rocky Patel Number 6 Corona', price: 35000, note: 'Honduras' },
  { name: 'Esteban Carreras Nicaragua', price: 30000, note: 'Nicaragua' },
  { name: 'Rocky Patel Edge Corojo', price: 30000, note: 'Honduras' },
  { name: 'Punch Royal Coronation', price: 50000, note: 'Cuba' },
  { name: 'Hiram & Solomon Traveling Man Gran Toro', price: 55000, note: 'Nicaragua' },
];
