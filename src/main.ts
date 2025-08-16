import "./style.css";
import {
  breads,
  fillings,
  type Ingredient,
  type IngredientType
} from "./ingredients.js";
import type { State } from "./types";

class SandwichBuilder {
  private titleDisplay: HTMLHeadingElement;
  private titleEdit: HTMLInputElement;
  private authorDisplay: HTMLElement;
  private authorEdit: HTMLInputElement;
  private stateSnapshot: string;
  private titleHasBeenModified: boolean = false;

  private breadIngredients: Ingredient[] = breads.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  private fillingIngredients: Ingredient[] = fillings.sort(function (a, b) {
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

    // Show help tooltip by default on root path
    if (isRootPath) {
      const helpTooltip = document.querySelector(
        ".help-tooltip"
      ) as HTMLDivElement;
      const helpButton = document.querySelector(
        ".help-button"
      ) as HTMLButtonElement;
      helpTooltip.classList.add("active");
      helpButton.textContent = "×";
    }

    this.stateSnapshot = "";

    // Add initial bread layers
    this.fillingLayers = isRootPath
      ? [
          { index: 9, type: "bread" },
          { index: 9, type: "bread" }
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

    // Track when title input is modified by user
    this.titleEdit.addEventListener("input", () => {
      this.titleHasBeenModified = true;
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
    const state = {
      title: this.titleDisplay.textContent,
      author: this.authorEdit.value.trim(),
      bread,
      fillings
    };

    return state;
  }

  private async save() {
    const newState = this.serializeState();
    const stringifiedState = JSON.stringify(newState);

    if (stringifiedState === this.stateSnapshot) {
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
        body: stringifiedState
      });

      if (response.ok) {
        const state = await response.json();

        console.log("State saved successfully!");

        // Update URL
        window.history.pushState({}, "", `/${state.slug}`);

        // Show share tooltip
        if ((window as any).showShareTooltip) {
          (window as any).showShareTooltip();
        }
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
    const isMobile = window.innerWidth <= 900;

    this.editButton.textContent = isEditMode ? "Save" : "New";

    if (isEditMode) {
      // Reset to fresh sandwich when entering edit mode
      this.fillingLayers = [
        { index: 9, type: "bread" },
        { index: 9, type: "bread" }
      ];

      // Reset title and author
      this.titleDisplay.textContent = "The Full Stacker";
      this.titleEdit.value = "The Full Stacker";
      this.authorDisplay.textContent = "Someone";
      this.authorEdit.value = "";

      // Reset title modification tracking
      this.titleHasBeenModified = false;

      // Change URL to root path
      window.history.pushState({}, "", "/");

      this.updateSandwich();
      this.stateSnapshot = JSON.stringify(this.serializeState());
    } else {
      if (isMobile) {
        const title = window.prompt("What is the name of your creation?");
        const author = window.prompt("What is your name?");

        this.titleEdit.value = (title || "").trim();
        this.authorEdit.value = (author || "").trim();
      } else {
        // Check if title has never been modified and prompt for a name
        if (!this.titleHasBeenModified) {
          const title = window.prompt("What is the name of your creation?");
          if (title && title.trim()) {
            this.titleEdit.value = title.trim();
            this.titleHasBeenModified = true;
          }
        }

        if (!this.authorEdit.value.trim()) {
          this.authorEdit.value = (prompt("What is your name?") || "").trim();
        }
      }

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
    this.titleDisplay.textContent = state.title;
    this.titleEdit.value = state.title;
    this.authorDisplay.textContent = state.author || "Someone";
    this.authorEdit.value = state.author || "";

    // Mark title as modified since it's loaded from a saved state
    this.titleHasBeenModified = true;

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
      img.style.width = "600px";
      img.style.height = "auto";

      wrapper.appendChild(img);
      wrapper.appendChild(select);
      this.previewElement.appendChild(wrapper);

      // Add all ingredients to list in order
      this.addIngredientToList(ingredient.name);
    });
  }
}

// Initialize the application
window.addEventListener("load", async () => {
  new SandwichBuilder(window.location.pathname);

  // Loading screen text rotation
  const loadingMessages = [
    "Sourcing the ingredients",
    "Stacking the layers",
    "Plating",
    "Adding the final touches"
  ];

  const loadingTextElement = document.getElementById("loading-text");
  if (loadingTextElement) {
    let currentMessageIndex = 0;

    const rotateMessage = () => {
      currentMessageIndex = (currentMessageIndex + 1) % loadingMessages.length;
      loadingTextElement.textContent = loadingMessages[currentMessageIndex];
    };

    // Start rotating messages every 2 seconds
    const messageInterval = setInterval(rotateMessage, 2000);

    // Stop rotation when loading screen is hidden
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            const target = mutation.target as HTMLElement;
            if (target.classList.contains("hidden")) {
              clearInterval(messageInterval);
              observer.disconnect();
            }
          }
        });
      });

      observer.observe(loadingScreen, { attributes: true });
    }
  }

  // Tooltip management system
  function createTooltipController(
    buttonSelector: string,
    tooltipSelector: string,
    buttonToggleText?: { active: string; inactive: string }
  ) {
    const button = document.querySelector(buttonSelector) as HTMLButtonElement;
    const tooltip = document.querySelector(tooltipSelector) as HTMLDivElement;

    if (!button || !tooltip) return null;

    let isActive = false;

    const show = () => {
      // Hide other tooltips first
      document
        .querySelectorAll(".help-tooltip, .share-tooltip")
        .forEach((el) => {
          if (el !== tooltip) el.classList.remove("active");
        });

      tooltip.classList.add("active");
      isActive = true;
      if (buttonToggleText) {
        button.textContent = buttonToggleText.active;
      }
    };

    const hide = () => {
      tooltip.classList.remove("active");
      isActive = false;
      if (buttonToggleText) {
        button.textContent = buttonToggleText.inactive;
      }
    };

    const toggle = () => {
      if (isActive) {
        hide();
      } else {
        show();
      }
    };

    // Button click handler
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggle();
    });

    // Prevent tooltip from closing when clicked
    tooltip.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    // Global click handler to close tooltip
    const globalClickHandler = () => hide();
    document.addEventListener("click", globalClickHandler);

    return { show, hide, toggle, isActive: () => isActive };
  }

  // Help tooltip functionality
  createTooltipController(".help-button", ".help-tooltip", {
    active: "×",
    inactive: "?"
  });

  // Share tooltip functionality (no button control, only programmatic)
  const shareTooltip = document.querySelector(
    ".share-tooltip"
  ) as HTMLDivElement;
  const helpButton = document.querySelector(
    ".help-button"
  ) as HTMLButtonElement;

  if (shareTooltip && helpButton) {
    // Prevent share tooltip from closing when clicked
    shareTooltip.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    const hideShareTooltip = () => {
      shareTooltip.classList.remove("active");
      // Reset help button to inactive state if no other tooltips are active
      if (!document.querySelector(".help-tooltip.active")) {
        helpButton.textContent = "?";
      }
    };

    // Make share tooltip controller globally accessible
    (window as any).showShareTooltip = () => {
      // Hide other tooltips first
      document
        .querySelectorAll(".help-tooltip, .share-tooltip")
        .forEach((el) => {
          if (el !== shareTooltip) el.classList.remove("active");
        });

      shareTooltip.classList.add("active");
      // Set help button to close state
      helpButton.textContent = "×";

      // Auto-hide after 10 seconds
      setTimeout(() => {
        hideShareTooltip();
      }, 10_000);
    };

    // Global click handler to close share tooltip
    document.addEventListener("click", () => {
      hideShareTooltip();
    });
  }
});
