# backend/seed_db.py (standalone)
import random
from sqlalchemy import create_engine, Column, Integer, String, Enum, DECIMAL, Boolean, TIMESTAMP, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from passlib.context import CryptContext

# ==================== CONFIGURATION ====================
# Use your Render PostgreSQL EXTERNAL connection string
DATABASE_URL = "postgresql://queueless_lb7c_user:WLiyTYW8JWcxnuM8fP2WJ1lb6kHH5UXA@dpg-d76ab2vpm1nc7391u2tg-a.oregon-postgres.render.com/queueless_lb7c"

# Create engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def get_password_hash(password):
    return pwd_context.hash(password)

# ==================== MODELS ====================
# We need to define minimal models for seeding
# (or we can import from app.models but that would require the app to be set up)
# For simplicity, we'll define them here. But to avoid duplication, you could import if the app's modules are available.
# However, since we had import errors, we'll define the necessary tables manually.

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum('admin', 'user', name='user_role_enum'), nullable=False)
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

class DiningTable(Base):
    __tablename__ = "tables"
    table_id = Column(Integer, primary_key=True, index=True)
    table_number = Column(Integer, unique=True, nullable=False)

class Menu(Base):
    __tablename__ = "menu"
    item_id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10,2), nullable=False)
    category = Column(String(50), nullable=False)
    image_url = Column(String(255))
    availability = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

# ==================== DATA ====================
def random_price(min_val, max_val):
    return round(random.uniform(min_val, max_val), 2)

# Image map (same as before)
image_map = {
    "Snacks": [
        "/assets/Snacks/maggie.jpg",
        "/assets/Snacks/Masalamaggie.jpg",
        "/assets/Snacks/cheesemaggie.jpg",
        "/assets/Snacks/steamedmomos.jpg",
        "/assets/Snacks/friedmomos.jpg",
        "/assets/Snacks/kurkuremomos.jpg",
        "/assets/Snacks/vadapav.jpg",
        "/assets/Snacks/dabeli.jpg",
        "/assets/Snacks/samosa.jpg",
        "/assets/Snacks/nachos.jpg",
        "/assets/Snacks/frenchfries.jpg",
        "/assets/Snacks/onionrings.jpg",
        "/assets/Snacks/aloofrankie.jpg",
        "/assets/Snacks/schezwanfrankie.jpg",
        "/assets/Snacks/paneerfrankie.jpg",
        "/assets/Snacks/poha.jpg",
        "/assets/Snacks/upma.jpg",
        "/assets/Snacks/dhokla.jpg",
        "/assets/Snacks/redsaucepasta.jpg",
        "/assets/Snacks/whitesaucepasta.jpg",
        "/assets/Snacks/pestopasta.jpg",
        "/assets/Snacks/miniburger.jpg",
        "/assets/Snacks/tacos.jpg",
        "/assets/Snacks/sandwich.jpg",
        "/assets/Snacks/grilledsandwich.jpg",
    ],
    "Meals": [
        "/assets/Meals/Margheritapizza.jpg",
        "/assets/Meals/7cheesepizza.jpg",
        "/assets/Meals/veggiesupremepizza.jpg",
        "/assets/Meals/pepperonipizza.jpg",
        "/assets/Meals/paneertikkapizza.jpg",
        "/assets/Meals/farmhousepizza.jpg",
        "/assets/Meals/alootikkiburger.jpg",
        "/assets/Meals/periperiburger.jpg",
        "/assets/Meals/schezwanburger.jpg",
        "/assets/Meals/mexicanburger.jpg",
        "/assets/Meals/italianburger.jpg",
        "/assets/Meals/cheeseburger.jpg",
        "/assets/Meals/cholebhature.jpg",
        "/assets/Meals/pavbhaji.jpg",
        "/assets/Meals/cholekulche.jpg",
        "/assets/Meals/idlisambhar.jpg",
        "/assets/Meals/uttapam.jpg",
        "/assets/Meals/menduvada.jpg",
        "/assets/Meals/plaindosa.jpg",
        "/assets/Meals/masaladosa.jpg",
        "/assets/Meals/mysoremasaladosa.jpg",
        "/assets/Meals/cheesemasaladosa.jpg",
        "/assets/Meals/ravadosa.jpg",
        "/assets/Meals/bennedosa.jpg",
        "/assets/Meals/alooparatha.jpg",
    ],
    "Beverages": [
        "/assets/Beverages/chai.jpg",
        "/assets/Beverages/masalachai.jpg",
        "/assets/Beverages/greentea.jpg",
        "/assets/Beverages/Blackcoffee.jpg",
        "/assets/Beverages/coffee.jpg",
        "/assets/Beverages/Coldcoffee.jpg",
        "/assets/Beverages/chocolateshake.jpg",
        "/assets/Beverages/strawberryshake.jpg",
        "/assets/Beverages/oreoshake.jpg",
        "/assets/Beverages/brownieshake.jpg",
        "/assets/Beverages/vanillashake.jpg",
        "/assets/Beverages/kitkatshake.jpg",
        "/assets/Beverages/limesoda.jpg",
        "/assets/Beverages/watermelonjuice.jpg",
        "/assets/Beverages/orangejuice.jpg",
        "/assets/Beverages/coke.jpg",
        "/assets/Beverages/dietcoke.jpg",
        "/assets/Beverages/sprite.jpg",
        "/assets/Beverages/fanta.jpg",
        "/assets/Beverages/lemonade.jpg",
        "/assets/Beverages/buttermilk.jpg",
        "/assets/Beverages/lassi.jpg",
        "/assets/Beverages/mangolassi.jpg",
        "/assets/Beverages/roselassi.jpg",
        "/assets/Beverages/hotchocolate.jpg",
        "/assets/Beverages/water.jpg",
    ],
    "Desserts": [
        "/assets/Desserts/chocolatebrownie.jpg",
        "/assets/Desserts/cheesecake.jpg",
        "/assets/Desserts/tiramisu.jpg",
        "/assets/Desserts/pudding.jpg",
        "/assets/Desserts/kulfi.jpg",
        "/assets/Desserts/donut.jpg",
        "/assets/Desserts/vanillaicecream.jpg",
        "/assets/Desserts/chocolateicecream.jpg",
        "/assets/Desserts/chocobrownieicecream.jpg",
        "/assets/Desserts/oreocrunchwaffle.jpg",
        "/assets/Desserts/belgianwaffle.jpg",
        "/assets/Desserts/chocoblastwaffle.jpg",
        "/assets/Desserts/pancakes.jpg",
        "/assets/Desserts/Cupcakes.jpg",
        "/assets/Desserts/browniesundae.jpg",
        "/assets/Desserts/Chocolatepastry.jpg",
        "/assets/Desserts/Chocolatefudge.jpg",
        "/assets/Desserts/Chocolatechippastry.jpg",
    ]
}

def get_image_for_category(category, index):
    images = image_map.get(category, image_map["Snacks"])
    return images[index % len(images)]

# Category lists
snacks = [
    "Maggie", "Masala Maggi", "Cheese Maggi",
    "Steamed Momos", "Fried Momos", "Kurkure Momos",
    "Vadapav", "Dabeli", "Samosa",
    "Nachos", "French Fries", "Onion Rings",
    "Aloo Frankie", "Schezwan Frankie", "Paneer Frankie",
    "Poha", "Upma", "Dhokla",
    "Red Sauce Pasta", "White Sauce Pasta", "Pesto Pasta",
    "Mini Burger", "Tacos", "Sandwich",
    "Grilled Cheese Sandwich"
]

meals = [
    "Margherita Pizza", "7 Cheese Pizza", "Veggie Supreme Pizza",
    "Pepperoni Pizza", "Paneer Tikka Pizza", "Farmhouse Pizza",
    "Aloo Tikki Burger", "Peri Peri Burger", "Schezwan Burger",
    "Mexican Burger", "Italian Burger", "Cheese Burger",
    "Chole Bhature", "Pav Bhaji", "Chole Kulche",
    "Idli Sambhar", "Uttapam", "Mendu Vada",
    "Plain Dosa", "Masala Dosa", "Mysore Masala Dosa",
    "Cheese Masala Dosa", "Rava Dosa", "Benne Dosa",
    "Aloo Paratha"
]

beverages = [
    "Chai", "Masala Chai", "Green Tea",
    "Black Coffee", "Coffee", "Cold Coffee",
    "Chocolate Shake", "Strawberry Shake", "Oreo Shake",
    "Brownie Shake", "Vanilla Shake", "Kitkat Shake",
    "Fresh Lime Soda", "Watermelon Juice", "Orange Juice",
    "Coke", "Diet Coke", "Sprite",
    "Fanta", "Lemonade", "Buttermilk",
    "Lassi", "Mango Lassi", "Rose Lassi",
    "Hot Chocolate", "Mineral Water"
]

desserts = [
    "Chocolate Brownie", "Cheesecake", "Tiramisu",
    "Pudding", "Kulfi", "Donut",
    "Vanilla Ice Cream", "Chocolate Ice Cream", "Choco Brownie Ice Cream",
    "Oreo Crunch Waffle", "Belgian Waffles", "Choco Blast Waffle",
    "Pancakes", "Cupcake", "Brownie Sundae",
    "Chocolate Pastry", "Chocolate Fudge Pastry", "Choco Chip Pastry"
]

menu_items = []

# Snacks
for idx, name in enumerate(snacks):
    menu_items.append({
        "item_name": name,
        "category": "Snacks",
        "price": random_price(50, 250),
        "description": f"Delicious {name.lower()} made fresh.",
        "image_url": get_image_for_category("Snacks", idx),
        "availability": True
    })

# Meals
for idx, name in enumerate(meals):
    menu_items.append({
        "item_name": name,
        "category": "Meals",
        "price": random_price(150, 600),
        "description": f"Hearty {name.lower()} to satisfy your hunger.",
        "image_url": get_image_for_category("Meals", idx),
        "availability": True
    })

# Beverages
for idx, name in enumerate(beverages):
    menu_items.append({
        "item_name": name,
        "category": "Beverages",
        "price": random_price(30, 180),
        "description": f"Refreshing {name.lower()} to quench your thirst.",
        "image_url": get_image_for_category("Beverages", idx),
        "availability": True
    })

# Desserts
for idx, name in enumerate(desserts):
    menu_items.append({
        "item_name": name,
        "category": "Desserts",
        "price": random_price(80, 300),
        "description": f"Sweet {name.lower()} to end your meal perfectly.",
        "image_url": get_image_for_category("Desserts", idx),
        "availability": True
    })

def seed_database():
    print("Connecting to database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Admin user
        existing_admin = db.query(User).filter(User.email == "admin@queueless.com").first()
        if not existing_admin:
            admin = User(
                name="Admin",
                email="admin@queueless.com",
                phone="1234567890",
                password=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin)
            print("Admin user created.")
        else:
            print("Admin user already exists.")

        # 2. Tables 1-25
        existing_tables = db.query(DiningTable).first()
        if not existing_tables:
            for num in range(1, 26):
                table = DiningTable(table_number=num)
                db.add(table)
            print("25 tables created.")
        else:
            print("Tables already exist.")

        # 3. Menu items
        existing_items = db.query(Menu).first()
        if not existing_items:
            for item in menu_items:
                db_item = Menu(**item)
                db.add(db_item)
            print(f"{len(menu_items)} menu items created.")
        else:
            print("Menu items already exist.")

        db.commit()
        print("Seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()