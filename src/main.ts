import "./style.css";
import type { State } from "./types";

interface Ingredient {
  id: string;
  name: string;
  filename: string | { top: string; bottom: string };
  scale: number;
}

type IngredientType = "bread" | "filling";

class SandwichBuilder {
  private titleDisplay: HTMLHeadingElement;
  private titleEdit: HTMLInputElement;
  private authorDisplay: HTMLElement;
  private authorEdit: HTMLInputElement;
  private stateSnapshot: string;

  private breadIngredients: Ingredient[] = [
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
  ].sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  private fillingIngredients: Ingredient[] = [
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
      scale: 0
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
      scale: 0
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
  ].sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  private fillingLayers: { index: number; type: IngredientType }[] = [];
  private previewElement: HTMLDivElement;
  private ingredientsList: HTMLUListElement;
  private loadingElement: HTMLDivElement;
  private editButton: HTMLButtonElement;

  constructor(urlPath: string) {
    this.previewElement = document.querySelector(
      "#sandwich-preview"
    ) as HTMLDivElement;
    this.ingredientsList = document.querySelector(
      "#ingredients-list"
    ) as HTMLUListElement;
    this.authorDisplay = document.querySelector("#author") as HTMLElement;
    this.authorEdit = document.querySelector(
      ".author-edit"
    ) as HTMLInputElement;
    this.titleEdit = document.querySelector(".title-edit") as HTMLInputElement;
    this.loadingElement = document.querySelector(
      "#loading-screen"
    ) as HTMLDivElement;
    this.titleDisplay = document.querySelector(
      ".title-display"
    ) as HTMLHeadingElement;
    this.editButton = document.querySelector(
      ".edit-button"
    ) as HTMLButtonElement;

    const isRootPath = urlPath === "/";

    this.stateSnapshot = "";

    // Add initial bread layers
    this.fillingLayers = isRootPath
      ? [
          { index: 0, type: "bread" },
          { index: 0, type: "bread" }
        ]
      : [];

    // Add buttons
    const addButton = document.querySelector(".add-layer") as HTMLButtonElement;

    addButton.addEventListener("click", () => {
      this.addLayer();
      this.updateSandwich();
    });

    const resetButton = document.querySelector(
      ".reset-button"
    ) as HTMLButtonElement;
    resetButton.addEventListener("click", () => {
      // Keep only the bread layers
      this.fillingLayers = this.fillingLayers.filter(
        (layer) => layer.type === "bread"
      );
      this.updateSandwich();
    });

    this.editButton.addEventListener("click", () => {
      const isEditMode = this.toggleEditMode();

      if (!isEditMode) {
        this.save();
      }
    });

    this.updateSandwich();

    // Handle navigation buttons
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!target.matches(".nav-button")) return;

      const layerElement = target.closest(".layer-wrapper") as HTMLElement;
      if (!layerElement) return;

      const layerIndex = parseInt(layerElement.dataset.index || "0", 10);
      const direction = target.classList.contains("prev") ? -1 : 1;

      this.cycleIngredient(layerIndex, direction);
    });

    if (urlPath === "/") {
      this.toggleEditMode();
      this.setLoadingState(true);
    } else {
      this.loadState(urlPath);
    }
  }

  private setLoadingState(isLoaded: boolean) {
    this.loadingElement.classList.toggle("hidden", isLoaded);
  }

  private serializeState() {
    const bread = this.breadIngredients[this.fillingLayers[0].index].id;
    const fillings = this.fillingLayers
      .filter((layer) => layer.type === "filling")
      .map((layer) => this.fillingIngredients[layer.index].id);

    return JSON.stringify({
      title: this.titleDisplay.textContent,
      author: this.authorEdit.value.trim(),
      bread,
      fillings
    });
  }

  private async save() {
    const newState = this.serializeState();
    if (newState === this.stateSnapshot) {
      console.log("State has not changed, skipping backend call");

      return;
    }

    try {
      console.log("Saving state...");

      const response = await fetch("/sandwich", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: newState
      });

      if (response.ok) {
        const state = await response.json();

        console.log("State saved successfully!");

        window.history.pushState({}, "", `/${state.slug}`);

        alert(
          "Yummy! Use the unique link in the address bar to share your creation with the world."
        );
      }
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  }

  private async loadState(urlPath: string) {
    const slug = urlPath.slice(1);

    try {
      const response = await fetch(`/sandwich/${slug}`);

      if (response.ok) {
        const state = await response.json();

        this.setState(state);
        this.setLoadingState(true);
      }
    } catch {}
  }

  public toggleEditMode(): boolean {
    const isEditMode = document.body.classList.toggle("edit-mode");

    this.editButton.textContent = isEditMode ? "Save" : "Edit";

    if (isEditMode) {
      this.stateSnapshot = this.serializeState();
    } else {
      // Save the title and tagline when exiting edit mode
      if (this.titleEdit.value.trim()) {
        this.titleDisplay.textContent = this.titleEdit.value;
      }

      if (this.authorEdit.value.trim()) {
        this.authorDisplay.textContent = this.authorEdit.value;
      }
    }

    return isEditMode;
  }

  private addLayer(): void {
    let type: IngredientType = "filling";
    let ingredients: Ingredient[] = this.fillingIngredients;

    let index = Math.floor(Math.random() * ingredients.length);

    if (this.fillingLayers.length < 2) {
      type = "bread";
      ingredients = this.breadIngredients;
    }

    this.fillingLayers.splice(1, 0, { index, type });

    // Add with animation
    requestAnimationFrame(() => {
      this.updateSandwich();
    });
  }

  private cycleIngredient(layerIndex: number, direction: number): void {
    const layer = this.fillingLayers[layerIndex];
    if (!layer) return;

    const isBread = layer.type === "bread";
    const ingredients = isBread
      ? this.breadIngredients
      : this.fillingIngredients;
    const newIndex =
      (layer.index + direction + ingredients.length) % ingredients.length;

    layer.index = newIndex;

    if (isBread && this.fillingLayers.length > 1) {
      const oppositeLayer =
        this.fillingLayers[this.fillingLayers.length - 1 - layerIndex];

      oppositeLayer.index = newIndex;
    }

    this.updateSandwich();
  }

  private addIngredientToList(name: string, href?: string) {
    const li = document.createElement("li");

    if (href) {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = name;
      li.appendChild(a);
    } else {
      li.textContent = name;
    }

    this.ingredientsList.appendChild(li);
  }

  public setState(state: State): void {
    const titleDisplay = document.querySelector(
      ".title-display"
    ) as HTMLHeadingElement;
    const titleEdit = document.querySelector(".title-edit") as HTMLInputElement;
    const authorDisplay = document.querySelector(
      ".author-display"
    ) as HTMLParagraphElement;
    const authorEdit = document.querySelector(
      ".author-edit"
    ) as HTMLInputElement;

    titleDisplay.textContent = state.title;
    titleEdit.value = state.title;
    authorDisplay.innerHTML = `${state.author}<span class="author-prefix">'s sand<span class="wish">wish</span></span>`;
    authorEdit.value = state.author;

    this.fillingLayers = [];

    const breadIndex =
      this.breadIngredients.findIndex(
        (element) => element.id === state.bread
      ) || 0;

    this.fillingLayers.push({ index: breadIndex, type: "bread" });

    state.fillings.forEach((filling) => {
      const index = this.fillingIngredients.findIndex(
        (ing) => ing.id === filling
      );

      if (!index) {
        return;
      }

      this.fillingLayers.push({ index, type: "filling" });
    });

    this.fillingLayers.push({ index: breadIndex, type: "bread" });

    this.updateSandwich();
  }

  private updateSandwich(): void {
    this.previewElement.innerHTML = "";
    this.ingredientsList.innerHTML = "";

    const quantities: Record<string, number> = {};
    const ingredientNames = new Set<string>();

    // Create and position ingredient images
    this.fillingLayers.forEach((layer, index) => {
      const ingredients =
        layer.type === "bread"
          ? this.breadIngredients
          : this.fillingIngredients;

      const ingredient = ingredients[layer.index];

      // Create wrapper for layer (includes navigation)
      const wrapper = document.createElement("div");
      wrapper.className = "layer-wrapper";

      wrapper.dataset.index = index.toString();
      wrapper.style.zIndex = (10_000 - index).toString();

      // Create select dropdown
      const select = document.createElement("select");
      select.className = "ingredient-select";

      // Add None option for non-bread layers
      if (layer.type !== "bread") {
        const noneOption = document.createElement("option");
        noneOption.value = "-1";
        noneOption.textContent = "None";
        select.appendChild(noneOption);
      }

      const availableIngredients =
        layer.type === "bread"
          ? this.breadIngredients
          : this.fillingIngredients;

      availableIngredients.forEach((ing, i) => {
        const option = document.createElement("option");
        option.value = i.toString();
        option.selected = i === layer.index;

        option.textContent = ing.name;

        select.appendChild(option);
      });

      select.addEventListener("change", (e) => {
        e.stopPropagation();
        const newIndex = parseInt((e.target as HTMLSelectElement).value);

        if (newIndex === -1) {
          // Remove layer when None is selected
          if (layer.type !== "bread") {
            this.fillingLayers.splice(index, 1);
            this.updateSandwich();
            return;
          }
        } else {
          this.fillingLayers[index].index = newIndex;

          if (layer.type === "bread" && this.fillingLayers.length > 1) {
            // Keep bread pairs in sync
            const oppositeLayer =
              this.fillingLayers[this.fillingLayers.length - 1 - index];
            oppositeLayer.index = newIndex;
          }

          this.updateSandwich();
        }
      });

      // Create remove button (only for non-bread layers)
      const removeButton = document.createElement("button");
      removeButton.className = "nav-button remove";
      removeButton.innerHTML = "&minus;";
      removeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (layer.type !== "bread") {
          this.fillingLayers.splice(index, 1);
          this.updateSandwich();
        }
      });

      // Create image element
      const img = document.createElement("img");

      let filename = ingredient.filename;

      if (typeof filename !== "string") {
        filename = index === 0 ? filename.top : filename.bottom;
      }

      img.src = `/${layer.type}/${filename}`;
      img.alt = ingredient.name;
      img.style.width = `${(ingredient.scale || 1) * 600}px`;
      img.style.height = "auto";

      wrapper.appendChild(img);
      wrapper.appendChild(select);
      this.previewElement.appendChild(wrapper);

      if (index !== 0 && !ingredientNames.has(ingredient.name)) {
        quantities[ingredient.name] = (quantities[ingredient.name] ?? 0) + 1;
      }
    });

    Object.keys(quantities)
      .sort()
      .forEach((name) => {
        const text =
          quantities[name] > 1 ? `${quantities[name]}x ${name}` : name;

        this.addIngredientToList(text);
      });
  }
}

// Initialize the application
window.addEventListener("load", async () => {
  new SandwichBuilder(window.location.pathname);

  // Help tooltip functionality
  const helpButton = document.querySelector(
    ".help-button"
  ) as HTMLButtonElement;
  const helpTooltip = document.querySelector(".help-tooltip") as HTMLDivElement;

  helpButton.addEventListener("click", (event) => {
    event.stopPropagation();
    helpTooltip.classList.toggle("active");
  });

  helpTooltip.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    helpTooltip.classList.remove("active");
  });
});
