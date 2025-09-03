export interface Ingredient {
  id: string;
  name: string;
  filename: string | { top: string; bottom: string };
}

export type IngredientType = "bread" | "filling";

export const breads: Ingredient[] = [
  {
    id: "no-bun",
    name: "No bun",
    filename: "",
  },
  {
    id: "bread-bagel-plain",
    name: "Bagel",
    filename: {
      top: "bread-bagel-top.png",
      bottom: "bread-bagel-bottom.png"
    },
  },
  {
    id: "bread-bolo-caco",
    name: "Bolo do caco",
    filename: "bread-bolo-caco.png",
  },
  {
    id: "bread-brioche",
    name: "Brioche",
    filename: {
      top: "bread-brioche-top.png",
      bottom: "bread-brioche-bottom.png"
    },
  },
  {
    id: "bread-ciabatta",
    name: "Ciabatta",
    filename: "bread-ciabatta.png",
  },
  {
    id: "bread-flatbread",
    name: "Flatbread",
    filename: "bread-flatbread.png",
  },
  {
    id: "bread-naan",
    name: "Naan",
    filename: "bread-naan.png",
  },
  {
    id: "bread-pita",
    name: "Pita",
    filename: "bread-pita.png",
  },
  {
    id: "bread-rye",
    name: "Rye",
    filename: "bread-rye.png",
  },
  {
    id: "bread-rye-toasted",
    name: "Rye (Toasted)",
    filename: "bread-rye-toasted.png",
  },
  {
    id: "bread-sourdough",
    name: "Sourdough",
    filename: "bread-sourdough.png",
  },
  {
    id: "bread-white",
    name: "White bread",
    filename: "bread-white.png",
  },
  {
    id: "bread-white-toasted",
    name: "White bread (Toasted)",
    filename: "bread-white-toasted.png",
  },
  {
    id: "bread-whole-wheat",
    name: "Whole wheat",
    filename: "bread-whole-wheat.png",
  },
  {
    id: "bread-whole-wheat-toasted",
    name: "Whole wheat (Toasted)",
    filename: "bread-whole-wheat-toasted.png",
  }
];

export const fillings: Ingredient[] = [
  {
    id: "apple",
    name: "Apple",
    filename: "apple.png",
  },
  {
    id: "arugula",
    name: "Arugula",
    filename: "arugula.png",
  },
  {
    id: "basil",
    name: "Basil",
    filename: "basil.png",
  },
  {
    id: "avocado",
    name: "Avocado",
    filename: "avocado.png",
  },
  {
    id: "bacon",
    name: "Bacon",
    filename: "bacon.png",
  },
  {
    id: "banana",
    name: "Banana",
    filename: "banana.png",
  },
  {
    id: "beans",
    name: "Beans",
    filename: "beans.png",
  },
  {
    id: "pickle",
    name: "Pickles",
    filename: "pickle.png",
  },
  {
    id: "pickled-red-cabbage",
    name: "Pickled red cabbage",
    filename: "pickled-red-cabbage.png",
  },
  {
    id: "pineapple",
    name: "Pineapple",
    filename: "pineapple.png",
  },
  {
    id: "prosciutto",
    name: "Prosciutto",
    filename: "prosciutto.png",
  },
  {
    id: "pulled-pork",
    name: "Pulled pork",
    filename: "pulled-pork.png",
  },
  {
    id: "roastbeef",
    name: "Roast beef",
    filename: "roastbeef.png",
  },
  {
    id: "salami",
    name: "Salami",
    filename: "salami.png",
  },
  {
    id: "sausage",
    name: "Sausage",
    filename: "sausage.png",
  },
  {
    id: "seitan",
    name: "Seitan",
    filename: "seitan.png",
  },
  {
    id: "smoked-salmon",
    name: "Smoked salmon",
    filename: "smoked-salmon.png",
  },
  {
    id: "spinach",
    name: "Spinach",
    filename: "spinach.png",
  },
  {
    id: "sun-dried-tomato",
    name: "Tomato (Sun-dried)",
    filename: "sun-dried-tomato.png",
  },
  {
    id: "tomato",
    name: "Tomato",
    filename: "tomato.png",
  },
  {
    id: "tahini",
    name: "Tahini",
    filename: "tahini.png",
  },
  {
    id: "tofu",
    name: "Tofu",
    filename: "tofu.png",
  },
  {
    id: "tuna-salad",
    name: "Tuna salad",
    filename: "tuna-salad.png",
  },
  {
    id: "turkey",
    name: "Turkey",
    filename: "turkey.png",
  },
  {
    id: "tzatziki",
    name: "Tzatziki",
    filename: "tzatziki.png",
  },
  {
    id: "zucchini",
    name: "Zucchini",
    filename: "zucchini.png",
  },
  {
    id: "bell-pepper",
    name: "Bell pepper",
    filename: "bell-pepper.png",
  },
  {
    id: "blueberry-jam",
    name: "Jam (Blueberry)",
    filename: "blueberry-jam.png",
  },
  {
    id: "butter",
    name: "Butter",
    filename: "butter.png",
  },
  {
    id: "calamari",
    name: "Calamari",
    filename: "calamari.png",
  },
  {
    id: "caramelized-onion",
    name: "Onion (Caramelized)",
    filename: "caramelized-onion.png",
  },
  {
    id: "carrot",
    name: "Carrot",
    filename: "carrot.png",
  },
  {
    id: "cheese-cheddar",
    name: "Cheese (Cheddar)",
    filename: "cheese-cheddar.png",
  },
  {
    id: "cheese-cream",
    name: "Cheese (Cream)",
    filename: "cheese-cream.png",
  },
  {
    id: "cheese-mozzarella",
    name: "Cheese (Mozzarella)",
    filename: "cheese-mozzarella.png",
  },
  {
    id: "cheese-mozzarella-slice",
    name: "Cheese (Mozzarella slice)",
    filename: "cheese-mozzarella-slice.png",
  },
  {
    id: "cheese-pepper-jack",
    name: "Cheese (Pepper jack)",
    filename: "cheese-pepper-jack.png",
  },
  {
    id: "cheese-provolone",
    name: "Provolone",
    filename: "cheese-provolone.png",
  },
  {
    id: "cheese-swiss",
    name: "Cheese (Swiss)",
    filename: "cheese-swiss.png",
  },
  {
    id: "chicken-breast",
    name: "Chicken breast",
    filename: "chicken-breast.png",
  },
  {
    id: "chips",
    name: "Chips",
    filename: "chips.png",
  },
  {
    id: "chocolate-spread",
    name: "Chocolate spread",
    filename: "chocolate-spread.png",
  },
  {
    id: "coleslaw",
    name: "Coleslaw",
    filename: "coleslaw.png",
  },
  {
    id: "cucumber",
    name: "Cucumber",
    filename: "cucumber.png",
  },
  {
    id: "egg-boiled",
    name: "Egg (Boiled)",
    filename: "egg-boiled.png",
  },
  {
    id: "egg-poached",
    name: "Egg (Poached)",
    filename: "egg-poached.png",
  },
  {
    id: "egg-salad",
    name: "Egg salad",
    filename: "egg-salad.png",
  },
  {
    id: "eggplant",
    name: "Eggplant",
    filename: "eggplant.png",
  },
  {
    id: "eggs-scrambled",
    name: "Eggs (Scrambled)",
    filename: "eggs-scrambled.png",
  },
  {
    id: "fish-fingers",
    name: "Fish fingers",
    filename: "fish-fingers.png",
  },
  {
    id: "guacamole",
    name: "Guacamole",
    filename: "guacamole.png",
  },
  {
    id: "halloumi",
    name: "Halloumi",
    filename: "halloumi.png",
  },
  {
    id: "ham",
    name: "Ham",
    filename: "ham.png",
  },
  {
    id: "hollandaise-sauce",
    name: "Hollandaise sauce",
    filename: "hollandaise-sauce.png",
  },
  {
    id: "hummus",
    name: "Hummus",
    filename: "hummus.png",
  },
  {
    id: "jelly",
    name: "Jam (Strawberry)",
    filename: "jelly.png",
  },
  {
    id: "ketchup",
    name: "Ketchup",
    filename: "ketchup.png",
  },
  {
    id: "kimchi",
    name: "Kimchi",
    filename: "kimchi.png",
  },
  {
    id: "lettuce",
    name: "Lettuce",
    filename: "lettuce.png",
  },
  {
    id: "lobster-meat",
    name: "Lobster meat",
    filename: "lobster-meat.png",
  },
  {
    id: "mayo",
    name: "Mayonnaise",
    filename: "mayo.png",
  },
  {
    id: "meatballs",
    name: "Meatballs",
    filename: "meatballs.png",
  },
  {
    id: "mortadella",
    name: "Mortadella",
    filename: "mortadella.png",
  },
  {
    id: "mushrooms",
    name: "Mushrooms",
    filename: "mushrooms.png",
  },
  {
    id: "mustard",
    name: "Mustard",
    filename: "mustard.png",
  },
  {
    id: "onion",
    name: "Onion",
    filename: "onion.png",
  },
  {
    id: "patty-beef",
    name: "Patty (Beef)",
    filename: "patty-beef.png",
  },
  {
    id: "pork-chop",
    name: "Pork chop",
    filename: "pork-chop.png",
  },
  {
    id: "patty-salmon",
    name: "Patty (Salmon)",
    filename: "patty-salmon.png",
  },
  {
    id: "pastrami",
    name: "Pastrami",
    filename: "pastrami.png",
  },
  {
    id: "patty-blackbean",
    name: "Patty (Black bean)",
    filename: "patty-blackbean.png",
  },
  {
    id: "patty-chicken",
    name: "Patty (Chicken)",
    filename: "patty-chicken.png",
  },
  {
    id: "peanut-butter",
    name: "Peanut butter",
    filename: "peanut-butter.png",
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    filename: "pepperoni.png",
  }
];

export const MAX_INGREDIENTS_IN_PREVIEW = 12;
