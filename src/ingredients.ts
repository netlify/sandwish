export interface Ingredient {
  id: string;
  name: string;
  filename: string | { top: string; bottom: string };
  scale: number;
}

export type IngredientType = "bread" | "filling";

export const breads: Ingredient[] = [
  {
    id: "bread-bagel-plain",
    name: "Bagel",
    filename: {
      top: "bread-bagel-top.png",
      bottom: "bread-bagel-bottom.png"
    },
    scale: 0.7091
  },
  {
    id: "bread-bolo-caco",
    name: "Bolo do caco",
    filename: "bread-bolo-caco.png",
    scale: 0.7766
  },
  {
    id: "bread-brioche",
    name: "Brioche",
    filename: {
      top: "bread-brioche-top.png",
      bottom: "bread-brioche-bottom.png"
    },
    scale: 0.7891
  },
  {
    id: "bread-ciabatta",
    name: "Ciabatta",
    filename: "bread-ciabatta.png",
    scale: 0.6783
  },
  {
    id: "bread-flatbread",
    name: "Flatbread",
    filename: "bread-flatbread.png",
    scale: 0.7408
  },
  {
    id: "bread-naan",
    name: "Naan",
    filename: "bread-naan.png",
    scale: 0.775
  },
  {
    id: "bread-pita",
    name: "Pita",
    filename: "bread-pita.png",
    scale: 0.7975
  },
  {
    id: "bread-rye",
    name: "Rye",
    filename: "bread-rye.png",
    scale: 0.7391
  },
  {
    id: "bread-rye-toasted",
    name: "Rye (Toasted)",
    filename: "bread-rye-toasted.png",
    scale: 0.8016
  },
  {
    id: "bread-sourdough",
    name: "Sourdough",
    filename: "bread-sourdough.png",
    scale: 0.7733
  },
  {
    id: "bread-white",
    name: "White bread",
    filename: "bread-white.png",
    scale: 0.7058
  },
  {
    id: "bread-white-toasted",
    name: "White bread (Toasted)",
    filename: "bread-white-toasted.png",
    scale: 0.7725
  },
  {
    id: "bread-whole-wheat",
    name: "Whole wheat",
    filename: "bread-whole-wheat.png",
    scale: 0.6516
  },
  {
    id: "bread-whole-wheat-toasted",
    name: "Whole wheat (Toasted)",
    filename: "bread-whole-wheat-toasted.png",
    scale: 0.8058
  }
];

export const fillings: Ingredient[] = [
  {
    id: "apple",
    name: "Apple",
    filename: "apple.png",
    scale: 0.7141
  },
  {
    id: "arugula",
    name: "Arugula",
    filename: "arugula.png",
    scale: 0.7375
  },
  {
    id: "basil",
    name: "Basil",
    filename: "basil.png",
    scale: 0.6333
  },
  {
    id: "avocado",
    name: "Avocado",
    filename: "avocado.png",
    scale: 0.6783
  },
  {
    id: "bacon",
    name: "Bacon",
    filename: "bacon.png",
    scale: 0.7575
  },
  {
    id: "banana",
    name: "Banana",
    filename: "banana.png",
    scale: 0.6725
  },
  {
    id: "beans",
    name: "Beans",
    filename: "beans.png",
    scale: 0.78
  },
  {
    id: "pickle",
    name: "Pickles",
    filename: "pickle.png",
    scale: 0.6891
  },
  {
    id: "pickled-red-cabbage",
    name: "Pickled red cabbage",
    filename: "pickled-red-cabbage.png",
    scale: 0.7783
  },
  {
    id: "pineapple",
    name: "Pineapple",
    filename: "pineapple.png",
    scale: 0.6783
  },
  {
    id: "prosciutto",
    name: "Prosciutto",
    filename: "prosciutto.png",
    scale: 0.6925
  },
  {
    id: "pulled-pork",
    name: "Pulled pork",
    filename: "pulled-pork.png",
    scale: 0.6966
  },
  {
    id: "roastbeef",
    name: "Roast beef",
    filename: "roastbeef.png",
    scale: 0.6866
  },
  {
    id: "salami",
    name: "Salami",
    filename: "salami.png",
    scale: 0.6616
  },
  {
    id: "sausage",
    name: "Sausage",
    filename: "sausage.png",
    scale: 0.7541
  },
  {
    id: "seitan",
    name: "Seitan",
    filename: "seitan.png",
    scale: 0.7066
  },
  {
    id: "smoked-salmon",
    name: "Smoked salmon",
    filename: "smoked-salmon.png",
    scale: 0.7541
  },
  {
    id: "spinach",
    name: "Spinach",
    filename: "spinach.png",
    scale: 0.7066
  },
  {
    id: "sun-dried-tomato",
    name: "Tomato (Sun-dried)",
    filename: "sun-dried-tomato.png",
    scale: 0.6966
  },
  {
    id: "tomato",
    name: "Tomato",
    filename: "tomato.png",
    scale: 0.7141
  },
  {
    id: "tahini",
    name: "Tahini",
    filename: "tahini.png",
    scale: 0.7541
  },
  {
    id: "tofu",
    name: "Tofu",
    filename: "tofu.png",
    scale: 0.7141
  },
  {
    id: "tuna-salad",
    name: "Tuna salad",
    filename: "tuna-salad.png",
    scale: 0.7141
  },
  {
    id: "turkey",
    name: "Turkey",
    filename: "turkey.png",
    scale: 0.7141
  },
  {
    id: "tzatziki",
    name: "Tzatziki",
    filename: "tzatziki.png",
    scale: 0.7541
  },
  {
    id: "zucchini",
    name: "Zucchini",
    filename: "zucchini.png",
    scale: 0.6683
  },
  {
    id: "bell-pepper",
    name: "Bell pepper",
    filename: "bell-pepper.png",
    scale: 0.6258
  },
  {
    id: "blueberry-jam",
    name: "Jam (Blueberry)",
    filename: "blueberry-jam.png",
    scale: 0.795
  },
  {
    id: "butter",
    name: "Butter",
    filename: "butter.png",
    scale: 0.7891
  },
  {
    id: "calamari",
    name: "Calamari",
    filename: "calamari.png",
    scale: 0.6658
  },
  {
    id: "caramelized-onion",
    name: "Onion (Caramelized)",
    filename: "caramelized-onion.png",
    scale: 0.6658
  },
  {
    id: "carrot",
    name: "Carrot",
    filename: "carrot.png",
    scale: 0.75
  },
  {
    id: "cheese-cheddar",
    name: "Cheese (Cheddar)",
    filename: "cheese-cheddar.png",
    scale: 0.7375
  },
  {
    id: "cheese-cream",
    name: "Cheese (Cream)",
    filename: "cheese-cream.png",
    scale: 0.7433
  },
  {
    id: "cheese-mozzarella",
    name: "Cheese (Mozzarella)",
    filename: "cheese-mozzarella.png",
    scale: 0.7758
  },
  {
    id: "cheese-mozzarella-slice",
    name: "Cheese (Mozzarella slice)",
    filename: "cheese-mozzarella-slice.png",
    scale: 0.6716
  },
  {
    id: "cheese-pepper-jack",
    name: "Cheese (Pepper jack)",
    filename: "cheese-pepper-jack.png",
    scale: 0.7158
  },
  {
    id: "cheese-provolone",
    name: "Provolone",
    filename: "cheese-provolone.png",
    scale: 0.6833
  },
  {
    id: "cheese-swiss",
    name: "Cheese (Swiss)",
    filename: "cheese-swiss.png",
    scale: 0.7975
  },
  {
    id: "chicken-breast",
    name: "Chicken breast",
    filename: "chicken-breast.png",
    scale: 0.7033
  },
  {
    id: "chips",
    name: "Chips",
    filename: "chips.png",
    scale: 0.7141
  },
  {
    id: "chocolate-spread",
    name: "Chocolate spread",
    filename: "chocolate-spread.png",
    scale: 0.7616
  },
  {
    id: "coleslaw",
    name: "Coleslaw",
    filename: "coleslaw.png",
    scale: 0.765
  },
  {
    id: "cucumber",
    name: "Cucumber",
    filename: "cucumber.png",
    scale: 0.6683
  },
  {
    id: "egg-boiled",
    name: "Egg (Boiled)",
    filename: "egg-boiled.png",
    scale: 0.8533
  },
  {
    id: "egg-poached",
    name: "Egg (Poached)",
    filename: "egg-poached.png",
    scale: 0.7316
  },
  {
    id: "egg-salad",
    name: "Egg salad",
    filename: "egg-salad.png",
    scale: 0.69
  },
  {
    id: "eggplant",
    name: "Eggplant",
    filename: "eggplant.png",
    scale: 0.6875
  },
  {
    id: "eggs-scrambled",
    name: "Eggs (Scrambled)",
    filename: "eggs-scrambled.png",
    scale: 0.7225
  },
  {
    id: "fish-fingers",
    name: "Fish fingers",
    filename: "fish-fingers.png",
    scale: 0.745
  },
  {
    id: "guacamole",
    name: "Guacamole",
    filename: "guacamole.png",
    scale: 0.7241
  },
  {
    id: "halloumi",
    name: "Halloumi",
    filename: "halloumi.png",
    scale: 0.7041
  },
  {
    id: "ham",
    name: "Ham",
    filename: "ham.png",
    scale: 0.6658
  },
  {
    id: "hollandaise-sauce",
    name: "Hollandaise sauce",
    filename: "hollandaise-sauce.png",
    scale: 0.7508
  },
  {
    id: "hummus",
    name: "Hummus",
    filename: "hummus.png",
    scale: 0.7425
  },
  {
    id: "jelly",
    name: "Jam (Strawberry)",
    filename: "jelly.png",
    scale: 0.7975
  },
  {
    id: "ketchup",
    name: "Ketchup",
    filename: "ketchup.png",
    scale: 0.7983
  },
  {
    id: "kimchi",
    name: "Kimchi",
    filename: "kimchi.png",
    scale: 0.7266
  },
  {
    id: "lettuce",
    name: "Lettuce",
    filename: "lettuce.png",
    scale: 0.7091
  },
  {
    id: "lobster-meat",
    name: "Lobster meat",
    filename: "lobster-meat.png",
    scale: 0.7533
  },
  {
    id: "mayo",
    name: "Mayonnaise",
    filename: "mayo.png",
    scale: 0.8158
  },
  {
    id: "meatballs",
    name: "Meatballs",
    filename: "meatballs.png",
    scale: 0.6883
  },
  {
    id: "mortadella",
    name: "Mortadella",
    filename: "mortadella.png",
    scale: 0.7841
  },
  {
    id: "mushrooms",
    name: "Mushrooms",
    filename: "mushrooms.png",
    scale: 0.7516
  },
  {
    id: "mustard",
    name: "Mustard",
    filename: "mustard.png",
    scale: 0.8058
  },
  {
    id: "onion",
    name: "Onion",
    filename: "onion.png",
    scale: 0.74
  },
  {
    id: "patty-beef",
    name: "Patty (Beef)",
    filename: "patty-beef.png",
    scale: 0.73
  },
  {
    id: "pork-chop",
    name: "Pork chop",
    filename: "pork-chop.png",
    scale: 0.695
  },
  {
    id: "patty-salmon",
    name: "Patty (Salmon)",
    filename: "patty-salmon.png",
    scale: 0.73
  },
  {
    id: "pastrami",
    name: "Pastrami",
    filename: "pastrami.png",
    scale: 0.7841
  },
  {
    id: "patty-blackbean",
    name: "Patty (Black bean)",
    filename: "patty-blackbean.png",
    scale: 0.7258
  },
  {
    id: "patty-chicken",
    name: "Patty (Chicken)",
    filename: "patty-chicken.png",
    scale: 0.6391
  },
  {
    id: "peanut-butter",
    name: "Peanut butter",
    filename: "peanut-butter.png",
    scale: 0.7433
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    filename: "pepperoni.png",
    scale: 0.6325
  }
];

export const MAX_INGREDIENTS_IN_PREVIEW = 12;
