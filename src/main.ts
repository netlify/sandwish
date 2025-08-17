import "./style.css";
import {
  breads,
  fillings,
  type Ingredient,
  type IngredientType
} from "./ingredients.js";
import type { State } from "./types";

function isMobile() {
  return window.innerWidth <= 900;
}

class SandwichBuilder {
  private titleDisplay: HTMLHeadingElement;
  private titleEdit: HTMLInputElement;
  private authorDisplay: HTMLElement;
  private authorEdit: HTMLInputElement;
  private stateSnapshot: string;
  private titleHasBeenModified: boolean = false;
  private shareButton: HTMLButtonElement;

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
    this.shareButton = document.querySelector(
      ".share-button"
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
    this.fillingLayers = isRootPath ? this.createRandomBreadLayers() : [];

    // Add buttons
    const addButton = document.querySelector(".add-layer") as HTMLButtonElement;

    addButton.addEventListener("click", () => {
      this.addLayer();
      this.updateSandwich();
    });

    this.editButton.addEventListener("click", () => {
      const isEditMode = this.toggleEditMode();

      if (!isEditMode) {
        this.save();
      }
    });

    // Add expand/collapse button functionality
    const expandButton = document.querySelector(
      ".expand-button"
    ) as HTMLButtonElement;
    if (expandButton) {
      expandButton.addEventListener("click", () => {
        const isExpanded = document.body.classList.toggle("expanded");
        expandButton.setAttribute(
          "aria-label",
          isExpanded ? "Collapse layers" : "Expand layers"
        );
      });
    }

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
    } else {
      this.loadState();
    }
  }

  private setLoadingState(isLoaded: boolean) {
    this.loadingElement.classList.toggle("hidden", isLoaded);
  }

  private createRandomBreadLayers() {
    const randomBreadIndex = Math.floor(Math.random() * this.breadIngredients.length);
    return [
      { index: randomBreadIndex, type: "bread" as IngredientType },
      { index: randomBreadIndex, type: "bread" as IngredientType }
    ];
  }

  private resetToDefaults() {
    this.titleDisplay.textContent = "The Sandwish";
    this.titleEdit.value = "The Sandwish";
    this.authorDisplay.textContent = "Anonymous Chef";
    this.authorEdit.value = "";
    this.titleHasBeenModified = false;
  }

  private generateShareData() {
    const titleElement = this.titleDisplay;
    const sandwichTitle = titleElement?.textContent || "My Sandwich";
    
    const ingredientsList = document.querySelectorAll("#ingredients-list li");
    const totalIngredients = ingredientsList.length;
    const fillingCount = Math.max(0, totalIngredients - 2);
    
    return {
      title: sandwichTitle,
      url: window.location.href,
      text: `🧑‍🍳 I have turned ${fillingCount} incredible ingredients into a true culinary masterpiece I called "${sandwichTitle}".\n\n🥪 Come check it out and build your own.\n\n🔗 ${window.location.href}`
    };
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

        // Start pulsing the share button
        if (this.shareButton) {
          this.shareButton.classList.add("pulsing");
        }
      }
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  }

  private loadState() {
    try {
      const sandwichData = (window as any).sandwich;

      if (sandwichData) {
        this.setState(sandwichData);
      }
    } catch {}
  }

  public toggleEditMode(): boolean {
    const isEditMode = document.body.classList.toggle("edit-mode");

    this.editButton.textContent = isEditMode ? "Save" : "New";

    if (isEditMode) {
      // Reset to fresh sandwich when entering edit mode
      this.fillingLayers = this.createRandomBreadLayers();

      // Reset title and author
      this.resetToDefaults();

      // Change URL to root path
      window.history.pushState({}, "", "/");

      this.updateSandwich();
      this.stateSnapshot = JSON.stringify(this.serializeState());
    } else {
      if (isMobile()) {
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
    this.authorDisplay.textContent = state.author || "Anonymous Chef";
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

    // Track loading of visible images
    let totalImages = this.fillingLayers.length; // sandwich ingredient images
    let loadedImages = 0;

    const onImageLoaded = () => {
      loadedImages++;
      if (loadedImages >= totalImages) {
        this.setLoadingState(true);
      }
    };

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

      // Track image loading
      img.addEventListener("load", onImageLoaded);
      img.addEventListener("error", onImageLoaded); // Count errors as loaded to avoid hanging

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

  // Share tooltip functionality - custom implementation for image button
  const shareButton = document.querySelector(
    ".share-button"
  ) as HTMLButtonElement;
  const shareTooltip = document.querySelector(
    ".share-tooltip"
  ) as HTMLDivElement;
  const shareImg = shareButton?.querySelector("img") as HTMLImageElement;

  if (shareButton && shareTooltip && shareImg) {
    let isShareActive = false;

    const showShareTooltip = () => {
      // Hide other tooltips first
      document
        .querySelectorAll(".help-tooltip, .share-tooltip")
        .forEach((el) => {
          if (el !== shareTooltip) el.classList.remove("active");
        });

      shareTooltip.classList.add("active");
      isShareActive = true;
      shareImg.style.display = "none";
      shareButton.textContent = "×";
    };

    const hideShareTooltip = () => {
      shareTooltip.classList.remove("active");
      isShareActive = false;
      shareButton.textContent = "";
      shareButton.appendChild(shareImg);
      shareImg.style.display = "block";
    };

    const renderMessageInTooltip = (message: string) => {
      const tooltipText = shareTooltip.querySelector("p");
      if (tooltipText) {
        tooltipText.innerHTML = `<p>${message}</p>`;
      }

      showShareTooltip();
      setTimeout(hideShareTooltip, 10_000);
    };

    // Button click handler
    shareButton.addEventListener("click", async (event) => {
      event.stopPropagation();

      // Remove pulsing state when clicked
      shareButton.classList.remove("pulsing");

      // Get share data
      const shareData = this.generateShareData();

      if (isMobile()) {
        try {
          if (navigator.share) {
            await navigator.share(shareData);

            return;
          }
        } catch {
          // User cancelled or share failed, don't show tooltip on mobile
          return;
        }
      }

      if (isShareActive) {
        hideShareTooltip();
      } else {
        try {
          await navigator.clipboard.writeText(shareData.text);

          renderMessageInTooltip(
            "Shareable link and text copied to the clipboard"
          );
        } catch (err) {
          // Fallback to regular tooltip if clipboard fails
          showShareTooltip();
        }
      }
    });

    // Prevent tooltip from closing when clicked
    shareTooltip.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    // Global click handler to close tooltip
    document.addEventListener("click", () => {
      if (isShareActive) hideShareTooltip();
    });
  }

  // Make global showShareTooltip function for programmatic use
  if (shareTooltip && shareButton && shareImg) {
    (window as any).showShareTooltip = () => {
      // Hide other tooltips first
      document
        .querySelectorAll(".help-tooltip, .share-tooltip")
        .forEach((el) => {
          if (el !== shareTooltip) el.classList.remove("active");
        });

      shareTooltip.classList.add("active");
      shareImg.style.display = "none";
      shareButton.textContent = "×";

      // Auto-hide after 10 seconds
      setTimeout(() => {
        shareTooltip.classList.remove("active");
        shareButton.textContent = "";
        shareButton.appendChild(shareImg);
        shareImg.style.display = "block";
      }, 10_000);
    };
  }
});
