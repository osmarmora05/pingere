import { generateRandomColorHex } from "./utils.js";
import ToolboxController from "./ToolboxController.js";

export default class Drawable {
  #state;
  #$drawable;
  #toolbox;
  #statusBar;
  #toolboxController;
  #changeCellColorHandler;
  #sliderDefaultValue;
  #sliderValue = 0;
  #lastSliderValue = this.#sliderDefaultValue;

  /**
   * @param {object} State - The state.
   * @param {object} toolbox - The toolbox.
   * @param {HTMLElement} $drawable - The drawable component.
   * @param {object} statusBar - The statusBar.
   */
  constructor(state, drawable, toolbox, statusBar) {
    this.#state = state;
    this.#$drawable = drawable;
    this.#toolbox = toolbox;
    this.#statusBar = statusBar;
    this.#toolboxController = new ToolboxController(this.#state, this.#toolbox);
    this.#sliderDefaultValue = this.#state.getProperty("gridSize");
    this.#createGrid(this.#state.getProperty("gridSize"));
    this.#initCookies();
    this.#initState();
    this.#initGridSizeOnSlider();

    this.#changeCellColorHandler = (e) => this.#changeCellColor(e);

    this.#$drawable.addEventListener(
      this.#state.getProperty("paintOnHover") ? "mouseover" : "click",
      this.#changeCellColorHandler,
    );

    this.#toolbox.tools.$pencilBtn.addEventListener("click", () =>
      this.#paintCell(),
    );
    this.#toolbox.tools.$eraserBtn.addEventListener("click", () =>
      this.#eraserCell(),
    );
    this.#toolbox.tools.$rainbowBtn.addEventListener("click", () =>
      this.#rainbowCell(),
    );
    this.#toolbox.tools.$paintOnHoverBtn.addEventListener("click", () =>
      this.#togglePaintOnHover(),
    );

    this.#toolbox.tools.$gridBtn.addEventListener("click", () =>
      this.#toggleLinesGrid(),
    );

    this.#toolbox.tools.$deleteBtn.addEventListener("click", () =>
      this.#clearGrid(),
    );
    this.#toolbox.tools.$printBtn.addEventListener("click", () =>
      this.#printDrawable(),
    );

    this.#toolbox.colors.$coloredBtns.forEach((colorBtn) => {
      colorBtn.addEventListener("click", (e) => this.#selectColor(e));
    });

    this.#toolbox.colors.$colorPickerBtn.addEventListener("input", () =>
      this.#selectColorPicker(),
    );
    this.#toolbox.tools.$helpBtn.addEventListener("click", () =>
      this.#startTour(),
    );

    this.#statusBar.$slider.addEventListener("input", () =>
      this.#handlerSlider(),
    );
    this.#statusBar.$slider.addEventListener("mouseover", () => {
      this.#sliderValue = this.#statusBar.$slider.value;
    });
    this.#statusBar.$resetBtn.addEventListener("click", () => this.#reset());

    document.addEventListener("keydown", (e) => this.#setKeyboardShortcuts(e));
  }

  /**
   * Initializes the selection of toolbox elements and _Drawable.#$drawable_ behavior.
   */
  #initState() {
    if (this.#state.getProperty("showGrid")) {
      this.#toolboxController.updateShowGridSelection();
      this.#paintGridLines(true);
    } else {
      this.#toolboxController.updateShowGridSelection();
      this.#paintGridLines(false);
    }

    this.#toolboxController.updatePaintOnHoverSelection();
  }

  /**
   * Initializes cookies to determine whether or not to show the tour.
   */
  async #initCookies() {
    const cookie = await cookieStore.get("tour");

    if (!cookie) {
      await cookieStore.set("tour", "true");
      this.#startTour();
    }
  }

  /**
   * Initializes the slider component with the value of _state.gridLines_
   */
  #initGridSizeOnSlider() {
    this.#statusBar.$sliderTooltip.textContent = `${this.#sliderDefaultValue}x${this.#sliderDefaultValue}`;
    this.#statusBar.$slider.value = this.#sliderDefaultValue;
  }

  /**
   * Add rows with their corresponding cells within the drawable.
   * @param {number} gridSize - Drawable grid size.
   */
  #createGrid(gridSize) {
    const drawableHeight = this.#$drawable.clientHeight;

    // Create rows
    for (let i = 1; i <= gridSize; i++) {
      const row = document.createElement("div");
      row.classList.add("drawable__drawing-row");
      row.style.background = "#fff";

      // Create cell
      for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement("div");
        cell.classList.add("drawable__drawing-cell");
        cell.style.height = `${drawableHeight / parseInt(gridSize)}px`;
        cell.style.border = "0.1px solid #000";
        // Add cell to row
        row.appendChild(cell);
      }
      // Add a row with its cells to the drawable
      this.#$drawable.appendChild(row);
    }
  }

  /**
   * Add color to a cell.
   * @param {EventTarget} e - EventTarget of the drawable when the cursor is over it or when clicking on it.
   */
  #changeCellColor(e) {
    if (e.target.classList.contains("drawable__drawing-cell")) {
      const color = this.#state.getProperty("rainbow")
        ? generateRandomColorHex()
        : document
            .querySelector(`#${this.#state.getProperty("colorId")}`)
            .getAttribute("data-color");
      e.target.style.backgroundColor = color;
    }
  }

  /**
   * Sets pencil as the active tool and refreshes the toolbox UI.
   */
  #paintCell() {
    this.#state.setProperty("pencil", true);
    this.#state.setProperty("eraser", false);
    this.#state.setProperty("rainbow", false);

    this.#state.setProperty(
      "colorId",
      this.#toolboxController.getLastColorPencilId(),
    );

    this.#toolboxController.updatePencilSelection();
    this.#toolboxController.updateEraserSelection();
    this.#toolboxController.updateRainbowSelection();
    this.#toolboxController.setActiveSelectionColorButton();
  }

  /**
   * Sets eraser as the active tool and refreshes the toolbox UI.
   */
  #eraserCell() {
    this.#state.setProperty("eraser", true);
    this.#state.setProperty("pencil", false);
    this.#state.setProperty("rainbow", false);

    this.#state.setProperty(
      "colorId",
      this.#toolbox.tools.$eraserBtn.getAttribute("id"),
    );
    this.#toolboxController.updatePencilSelection();
    this.#toolboxController.updateEraserSelection();
    this.#toolboxController.updateRainbowSelection();
    this.#toolboxController.removeActiveSelectionColorButtons();
  }

  /**
   * Sets rainbow as the active tool and refreshes the toolbox UI.
   */
  #rainbowCell() {
    this.#state.setProperty("eraser", false);
    this.#state.setProperty("pencil", false);
    this.#state.setProperty("rainbow", true);

    this.#toolboxController.updatePencilSelection();
    this.#toolboxController.updateEraserSelection();
    this.#toolboxController.updateRainbowSelection();
    this.#toolboxController.removeActiveSelectionColorButtons();
  }

  /**
   * Toggles between painting on hover or on click, and updates events and UI.
   */
  #togglePaintOnHover() {
    this.#state.setProperty(
      "paintOnHover",
      !this.#state.getProperty("paintOnHover"),
    );

    this.#$drawable.removeEventListener(
      "mouseover",
      this.#changeCellColorHandler,
    );
    this.#$drawable.removeEventListener("click", this.#changeCellColorHandler);

    if (this.#state.getProperty("paintOnHover")) {
      this.#toolboxController.updatePaintOnHoverSelection();
      this.#$drawable.addEventListener(
        "mouseover",
        this.#changeCellColorHandler,
      );
    } else {
      this.#toolboxController.updatePaintOnHoverSelection();
      this.#$drawable.addEventListener("click", this.#changeCellColorHandler);
    }
  }

  /**
   * Toggles the grid lines visibility and updates the UI accordingly.
   */
  #toggleLinesGrid() {
    this.#state.setProperty("showGrid", !this.#state.getProperty("showGrid"));

    if (this.#state.getProperty("showGrid")) {
      this.#toolboxController.updateShowGridSelection();
      this.#paintGridLines(true);
    } else {
      this.#toolboxController.updateShowGridSelection();
      this.#paintGridLines(false);
    }
  }

  /**
   * Draws or removes grid lines on the cells based on the provided value.
   * @param {boolean} paint - Flag to draw or delete grid lines.
   */
  #paintGridLines(paint = true) {
    for (let i = 0; i < this.#$drawable.children.length; i++) {
      const currentRow = this.#$drawable.children[i];
      for (let j = 0; j < currentRow.children.length; j++) {
        if (paint) {
          currentRow.children[j].style.border = "0.1px solid #000";
        } else {
          currentRow.children[j].style.border = "";
        }
      }
    }
  }

  /**
   * Removes all cells from the grid.
   */
  #deleteGrid() {
    this.#$drawable.innerHTML = "";
  }

  /**
   * Clears the grid and recreates it based on the current state.
   */
  #clearGrid() {
    this.#deleteGrid();

    if (this.#state.getProperty("showGrid")) {
      this.#createGrid(this.#state.getProperty("gridSize"));
    } else {
      this.#createGrid(this.#state.getProperty("gridSize"));
      this.#paintGridLines(false);
    }
  }

  /**
   * Generates a PDF of the contents of the drawable area and saves it as _pingere.pdf_.
   */
  #printDrawable() {
    const printDoc = new jsPDF("p", "pt", "a4");

    const pageWidth = printDoc.internal.pageSize.width;
    const pageHeight = printDoc.internal.pageSize.height;

    const drawableWidth = this.#$drawable.offsetWidth;
    const drawableHeight = this.#$drawable.offsetHeight;

    console.log(drawableWidth);
    console.log(drawableHeight);

    const centerX = (pageWidth - drawableWidth) / 2;
    const centerY = (pageHeight - drawableHeight) / 2;
    printDoc.addHTML(this.#$drawable, centerX, centerY, function () {
      printDoc.save("pingere.pdf");
    });
  }

  /**
   * Select a color and update the state and ui based on the button pressed.
   * @param {EventTarget} e - EventTarget of the of the _Drawable.#toolbox.colors.$coloredBtns_ element
   */
  #selectColor(e) {
    if (this.#state.getProperty("state") || this.#state.getProperty("rainbow"))
      return;
    this.#toolboxController.removeActiveSelectionColorButtons();

    if (e.currentTarget.classList.contains("large-color-button")) {
      e.currentTarget.classList.add("large-color-button--active");
    } else if (e.currentTarget.classList.contains("small-color-button")) {
      e.currentTarget.classList.add("small-color-button--active");
    }
    const lastColorPencilId = e.currentTarget.getAttribute("id");
    this.#toolboxController.setLastColorPencilId(lastColorPencilId);
    e.currentTarget.style.border = `0.1px solid ${document.querySelector(`#${lastColorPencilId}`).getAttribute("data-color")}`;
    this.#state.setProperty("colorId", lastColorPencilId);
  }

  /**
   * Select the color of the picker and update the state and ui.
   */
  #selectColorPicker() {
    if (this.#state.getProperty("state") || this.#state.getProperty("rainbow"))
      return;

    this.#toolboxController.removeActiveSelectionColorButtons();
    this.#toolbox.colors.$colorPickerBtn.setAttribute(
      "data-color",
      `${this.#toolbox.colors.$colorPickerBtn.value}`,
    );
    this.#toolbox.colors.$colorPickerBtn.classList.add("color-picker--active");
    const lastColorPencilId =
      this.#toolbox.colors.$colorPickerBtn.getAttribute("id");
    this.#toolboxController.setLastColorPencilId(lastColorPencilId);
    this.#state.setProperty("colorId", lastColorPencilId);
  }

  /**
   * Start an interactive tour that guides the user through the tools.
   */
  #startTour() {
    const driver = window.driver.js.driver;

    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#toolbox__pencil-btn",
          popover: declarePopoverContent(
            "Tools",
            "Pencil",
            "drawing",
            `The pencil tool colors
the grid cells with
the color you choose.`,
          ),
        },
        {
          element: "#toolbox__eraser-btn",
          popover: declarePopoverContent(
            "Tools",
            "Eraser",
            "eraser",
            `The eraser tool removes 
color from the cell you select.`,
          ),
        },
        {
          element: "#toolbox__rainbow-btn",
          popover: declarePopoverContent(
            "Tools",
            "Rainbow",
            "rainbow",
            `The rainbow tool paints
a grid cell in a random color.`,
          ),
        },
        {
          element: "#toolbox__pencil-hover-btn",
          popover: declarePopoverContent(
            "Tools",
            "Toggle Paint With Hover",
            "toggle-paint-with-hover",
            `The Toggle Paint With Hover Tool,
when enabled, paints the grid cell as you hover overt it.
When, disabled, the cell is painted as you click.`,
          ),
        },
        {
          element: "#toolbox__grid-btn",
          popover: declarePopoverContent(
            "Tools",
            "Toggle Lines Grid",
            "toggle-lines-grid",
            `The Toggle Grid Lines tool
shows or hides the grid lines.`,
          ),
        },
        {
          element: ".toolbox__colors",
          popover: declarePopoverContent(
            "Colors",
            "",
            "colors",
            `In the color section
you can select a color and
use it to paint a cell in the grid`,
          ),
        },
        {
          element: ".footer__slider-container",
          popover: declarePopoverContent(
            "Resize",
            "",
            "resize",
            `With this slider, you can change the size of the grid.`,
            "top",
            "start",
          ),
        },
      ],
    });

    driverObj.drive();

    /**
     * Creates content for a popover.
     * @param {string} title - The popover title.
     * @param {string} [subtitle] - The popover subtitle (optional).
     * @param {string} imgName - The image file name (without extension).
     * @param {string} description - The popover description.
     * @param {string} [side="top"] - The position of the popover (default is "top").
     * @param {string} [align="center"] - The alignment of the popover (default is "center").
     * @returns {Object} The popover content object.
     */
    function declarePopoverContent(
      title,
      subtitle,
      imgName,
      description,
      side = "top",
      align = "center",
    ) {
      const subtitleHtml = subtitle ? `<h3>${subtitle}</h3>` : "";
      return {
        title: title,
        description: `<img src="./src/assets/img/${imgName}.svg" style="width: 270px"/>${subtitleHtml}<p>${description}</p>`,
        side: side,
        align: align,
      };
    }
  }

  /**
   * Increases the grid size to a new specified size, adding rows and cells as needed.
   * @param {number} gridSize - Drawable grid size.
   */
  #increaseGrid(gridSize) {
    const currentRows = this.#$drawable.children.length;
    const newRowsCount = gridSize - currentRows;
    const newCellHeight = `${this.#$drawable.clientHeight / gridSize}px`;

    // Add new rows to existing cells
    for (let i = 0; i < currentRows; i++) {
      const row = this.#$drawable.children[i];
      // Create cell
      while (row.children.length < gridSize) {
        const newCell = document.createElement("div");
        newCell.classList.add("drawable__drawing-cell");
        // Add cell to row
        row.appendChild(newCell);
      }
      // Adjust cell size
      for (let j = 0; j < row.children.length; j++) {
        row.children[j].style.height = newCellHeight;
      }
    }

    // Create new rows
    for (let i = 0; i < newRowsCount; i++) {
      const newRow = document.createElement("div");
      newRow.classList.add("drawable__drawing-row");
      newRow.style.background = "#fff";
      for (let j = 0; j < gridSize; j++) {
        // Create new cell
        const newCell = document.createElement("div");
        newCell.classList.add("drawable__drawing-cell");
        newCell.style.height = newCellHeight;
        // Add cell to row
        newRow.appendChild(newCell);
      }
      // Add new row to the drawable
      this.#$drawable.appendChild(newRow);
    }

    // Draw or not draw grid lines in cells based on the state value
    if (this.#state.getProperty("showGrid")) {
      this.#paintGridLines(true);
    } else {
      this.#paintGridLines(false);
    }
  }

  /**
   * Decreases the grid size to a new specified size, removing rows and cells as needed.
   * @param {number} gridSize - Drawable grid size.
   */
  #decreaseGrid(gridSize) {
    const newCellHeight = `${this.#$drawable.clientHeight / gridSize}px`;
    // Delete rows
    for (let i = this.#$drawable.children.length - 1; i >= gridSize; i--) {
      this.#$drawable.removeChild(this.#$drawable.children[i]);
    }
    // Go through each row
    for (let i = 0; i < this.#$drawable.children.length; i++) {
      const currentRow = this.#$drawable.children[i];
      // Remove cell
      for (let j = currentRow.children.length - 1; j >= gridSize; j--) {
        currentRow.removeChild(currentRow.children[j]);
      }
      // Adjust cell size
      for (let j = 0; j < currentRow.children.length; j++) {
        currentRow.children[j].style.height = newCellHeight;
      }
    }
  }

  /**
   * Handles the slider event, updates the grid size value, and shows/hides the _Drawable.#toolbox.tools.$resetBtn_.
   */
  #handlerSlider() {
    this.#sliderValue = parseInt(this.#statusBar.$slider.value);
    this.#statusBar.$sliderTooltip.textContent = `${this.#sliderValue}x${this.#sliderValue}`;

    if (this.#sliderValue != this.#sliderDefaultValue) {
      this.#statusBar.$resetBtn.style.display = "flex";
    } else {
      this.#statusBar.$resetBtn.style.display = "none";
    }

    if (this.#lastSliderValue > this.#sliderValue) {
      this.#decreaseGrid(this.#sliderValue);
    } else if (this.#lastSliderValue < this.#sliderValue) {
      this.#increaseGrid(this.#sliderValue);
    }

    this.#lastSliderValue = this.#sliderValue;
  }

  /**
   * Resets the grid size to the value of _Drawable.#lastSliderValue_ and updates the ui.
   */
  #reset() {
    this.#sliderValue = this.#sliderDefaultValue;

    if (this.#lastSliderValue > this.#sliderDefaultValue) {
      this.#decreaseGrid(this.#sliderDefaultValue);
    } else if (this.#lastSliderValue < this.#sliderDefaultValue) {
      this.#increaseGrid(this.#sliderDefaultValue);
    }

    this.#statusBar.$slider.value = this.#sliderDefaultValue;
    this.#statusBar.$sliderTooltip.textContent = `${this.#sliderDefaultValue}x${this.#sliderDefaultValue}`;
    this.#statusBar.$resetBtn.style.display = "none";

    this.#lastSliderValue = this.#sliderDefaultValue;
  }

  /**
   * Set keyboard shortcuts for tools.
   * @param {EventTarget} e - EventTarget of the of the _Document_ element
   */
  #setKeyboardShortcuts(e) {
    if (e.key == "p" || e.key == "P") {
      this.#paintCell();
    } else if (e.key == " " || e.key == "Spacebar") {
      this.#eraserCell();
    } else if (e.key == "h" || e.key == "H") {
      this.#togglePaintOnHover();
    } else if (e.key == "g" || e.key == "G") {
      this.#toggleLinesGrid();
    }
  }
}
