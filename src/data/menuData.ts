export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isPopular?: boolean;
  isSpicy?: boolean;
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  items: MenuItem[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  subCategories: SubCategory[];
}

export const menuData: Category[] = [
  {
    id: "tiffins",
    name: "Tiffins",
    description: "Traditional South Indian breakfast delights",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
    icon: "🍳",
    subCategories: [
      {
        id: "dosa",
        name: "Dosa",
        description: "Crispy golden crepes with various fillings",
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80",
        items: [
          {
            id: "plain-dosa",
            name: "Plain Dosa",
            description: "Classic crispy dosa served with sambar and chutney",
            price: 60,
            image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80",
            isVeg: true,
            isPopular: true,
          },
          {
            id: "masala-dosa",
            name: "Masala Dosa",
            description: "Crispy dosa filled with spiced potato masala",
            price: 80,
            image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
            isVeg: true,
            isPopular: true,
          },
          {
            id: "mysore-masala-dosa",
            name: "Mysore Masala Dosa",
            description: "Spicy red chutney spread dosa with potato filling",
            price: 90,
            image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80",
            isVeg: true,
            isSpicy: true,
          },
          {
            id: "cheese-dosa",
            name: "Cheese Dosa",
            description: "Dosa topped with melted cheese",
            price: 100,
            image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80",
            isVeg: true,
          },
          {
            id: "paneer-dosa",
            name: "Paneer Dosa",
            description: "Dosa with spiced paneer filling",
            price: 110,
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
            isVeg: true,
          },
          {
            id: "onion-dosa",
            name: "Onion Dosa",
            description: "Crispy dosa with caramelized onions",
            price: 70,
            image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80",
            isVeg: true,
          },
        ],
      },
      {
        id: "idli",
        name: "Idli",
        description: "Soft steamed rice cakes",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
        items: [
          {
            id: "plain-idli",
            name: "Plain Idli (2 pcs)",
            description: "Soft steamed idli with sambar and chutney",
            price: 40,
            image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
            isVeg: true,
            isPopular: true,
          },
          {
            id: "ghee-idli",
            name: "Ghee Idli (2 pcs)",
            description: "Idli drizzled with pure ghee",
            price: 50,
            image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
            isVeg: true,
          },
          {
            id: "sambar-idli",
            name: "Sambar Idli (3 pcs)",
            description: "Idli soaked in flavorful sambar",
            price: 60,
            image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
            isVeg: true,
          },
        ],
      },
      {
        id: "uttapam",
        name: "Uttapam",
        description: "Thick savory pancakes with toppings",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
        items: [
          {
            id: "plain-uttapam",
            name: "Plain Uttapam",
            description: "Thick rice pancake with sambar and chutney",
            price: 60,
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80",
            isVeg: true,
          },
          {
            id: "onion-uttapam",
            name: "Onion Uttapam",
            description: "Uttapam topped with onions",
            price: 70,
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80",
            isVeg: true,
            isPopular: true,
          },
          {
            id: "mixed-uttapam",
            name: "Mixed Vegetable Uttapam",
            description: "Uttapam with assorted vegetables",
            price: 80,
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80",
            isVeg: true,
          },
        ],
      },
    ],
  },
  {
    id: "food",
    name: "Main Course",
    description: "Hearty and fulfilling meals",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    icon: "🍛",
    subCategories: [
      {
        id: "rice",
        name: "Rice Items",
        description: "Aromatic rice preparations",
        image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80",
        items: [
          {
            id: "veg-biryani",
            name: "Veg Biryani",
            description: "Fragrant basmati rice with mixed vegetables",
            price: 150,
            image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
            isVeg: true,
            isPopular: true,
          },
          {
            id: "curd-rice",
            name: "Curd Rice",
            description: "Cooling yogurt rice with tempering",
            price: 80,
            image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
            isVeg: true,
          },
          {
            id: "lemon-rice",
            name: "Lemon Rice",
            description: "Tangy lemon flavored rice",
            price: 90,
            image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
            isVeg: true,
          },
        ],
      },
      {
        id: "thali",
        name: "Thali",
        description: "Complete meal platters",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
        items: [
          {
            id: "south-indian-thali",
            name: "South Indian Thali",
            description: "Rice, sambar, rasam, vegetables, curd, papad",
            price: 180,
            image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
            isVeg: true,
            isPopular: true,
          },
          {
            id: "north-indian-thali",
            name: "North Indian Thali",
            description: "Roti, dal, paneer, vegetables, rice, dessert",
            price: 200,
            image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
            isVeg: true,
          },
        ],
      },
    ],
  },
  {
    id: "snacks",
    name: "Snacks",
    description: "Crispy and delicious bites",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    icon: "🍿",
    subCategories: [
      {
        id: "fried",
        name: "Fried Snacks",
        description: "Golden crispy delights",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
        items: [
          {
            id: "vada",
            name: "Medu Vada (2 pcs)",
            description: "Crispy urad dal fritters",
            price: 50,
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
            isVeg: true,
            isPopular: true,
          },
          {
            id: "samosa",
            name: "Samosa (2 pcs)",
            description: "Crispy pastry with spiced potato filling",
            price: 40,
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
            isVeg: true,
            isPopular: true,
          },
          {
            id: "pakora",
            name: "Mixed Pakora",
            description: "Assorted vegetable fritters",
            price: 60,
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
            isVeg: true,
          },
        ],
      },
      {
        id: "chaat",
        name: "Chaat",
        description: "Tangy street food favorites",
        image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
        items: [
          {
            id: "pani-puri",
            name: "Pani Puri",
            description: "Crispy puris with tangy water",
            price: 50,
            image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
            isVeg: true,
            isPopular: true,
          },
          {
            id: "bhel-puri",
            name: "Bhel Puri",
            description: "Puffed rice with chutneys and vegetables",
            price: 60,
            image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
            isVeg: true,
          },
        ],
      },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Refreshing drinks to complement your meal",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
    icon: "☕",
    subCategories: [
      {
        id: "hot",
        name: "Hot Beverages",
        description: "Warm and comforting drinks",
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
        items: [
          {
            id: "filter-coffee",
            name: "Filter Coffee",
            description: "Traditional South Indian filter coffee",
            price: 40,
            image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
            isVeg: true,
            isPopular: true,
          },
          {
            id: "masala-tea",
            name: "Masala Tea",
            description: "Spiced Indian tea",
            price: 30,
            image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80",
            isVeg: true,
          },
        ],
      },
      {
        id: "cold",
        name: "Cold Beverages",
        description: "Cool and refreshing drinks",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
        items: [
          {
            id: "lassi",
            name: "Sweet Lassi",
            description: "Creamy yogurt drink",
            price: 50,
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
            isVeg: true,
            isPopular: true,
          },
          {
            id: "buttermilk",
            name: "Buttermilk",
            description: "Spiced churned buttermilk",
            price: 30,
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
            isVeg: true,
          },
          {
            id: "mango-lassi",
            name: "Mango Lassi",
            description: "Mango flavored yogurt drink",
            price: 70,
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
            isVeg: true,
          },
        ],
      },
    ],
  },
];

export const restaurantInfo = {
  name: "Spice Garden",
  tagline: "Authentic South Indian Cuisine",
  description: "Experience the rich flavors of South India with our traditional recipes passed down through generations.",
  address: "123 Food Street, Cuisine City",
  phone: "+91 98765 43210",
};
