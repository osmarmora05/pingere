/**
 * Toolbox state.
 * @class ToolboxController
 */

export default class ToolboxController {
  #toolbox;
  #state;
  #lastColorPencilId;

  /**
   * @param {object} State - The state.
   * @param {object} toolbox - The toolbox.
   * @param {HTMLElement} toolbox.tools.$pencilBtn - The pencil button.
   * @param {HTMLElement} toolbox.tools.$eraserBtn - The eraser button.
   * @param {HTMLElement} toolbox.tools.$rainbowBtn - The rainbow button.
   * @param {HTMLElement} toolbox.tools.$paintOnHoverBtn - The paintOnHover button.
   * @param {HTMLElement} toolbox.tools.$gridBtn - The grid(toogle lines of grid) button.
   * @param {HTMLElement} toolbox.tools.$deleteBtn - The delete button.
   * @param {HTMLElement} toolbox.tools.$printBtn - The print button.
   * @param {HTMLElement} toolbox.tools.$helpBtn - The help button.
   * @param {HTMLDListElement} toolbox.colors.$largeColoredBtns - The node list of large colored buttons.
   * @param {HTMLDListElement} toolbox.colors.$coloredBtns - The node list of small colored buttons.
   * @param {HTMLElement} toolbox.colors.$colorPickerBtn - The color picker button.
   */
  constructor(state, toolbox) {
    this.#toolbox = toolbox;
    this.#state = state;
    this.#lastColorPencilId = this.#state.getProperty("colorId");
    this.#initState();
  }

  /**
   * Initializes the selection of the toolbox elements.
   */
  #initState() {
    this.updatePencilSelection();
    this.updatePaintOnHoverSelection();
    this.updateShowGridSelection();
    for (
      let i = 0;
      i < this.#toolbox.colors.$largeColoredBtns.children.length;
      i++
    ) {
      if (
        this.#toolbox.colors.$largeColoredBtns.children[i].id ==
        this.#state.getProperty("colorId")
      ) {
        this.#toolbox.colors.$largeColoredBtns.children[i].classList.add(
          "large-color-button--active",
        );
        this.#toolbox.colors.$largeColoredBtns.children[i].style.border =
          `0.1px solid ${document.querySelector(`#${this.#state.getProperty("colorId")}`).getAttribute("data-color")}`;
        break;
      }
    }
  }

  /**
   * Update whether the pencil button is selected depending of the _state.pencil_.
   */
  updatePencilSelection() {
    this.#updateToolSelecton(
      this.#state.getProperty("pencil"),
      this.#toolbox.tools.$pencilBtn,
    );
  }

  /**
   * Update whether the eraser button is selected depending of the _state.eraser_.
   */
  updateEraserSelection() {
    this.#updateToolSelecton(
      this.#state.getProperty("eraser"),
      this.#toolbox.tools.$eraserBtn,
    );
  }

  /**
   * Update whether the rainbow button is selected depending of the _state.rainbow_.
   */
  updateRainbowSelection() {
    this.#updateToolSelecton(
      this.#state.getProperty("rainbow"),
      this.#toolbox.tools.$rainbowBtn,
    );
  }

  /**
   * Update whether the paintOnHover button is selected depending of the _state.paintOnHover_.
   */
  updatePaintOnHoverSelection() {
    this.#updateToolSelecton(
      this.#state.getProperty("paintOnHover"),
      this.#toolbox.tools.$paintOnHoverBtn,
    );
  }

  /**
   * Update whether the showGrid button is selected depending of the _state.showGrid_.
   */
  updateShowGridSelection() {
    this.#updateToolSelecton(
      this.#state.getProperty("showGrid"),
      this.#toolbox.tools.$gridBtn,
    );
  }

  /**
   * Remove the selection from the color buttons.
   */
  removeActiveSelectionColorButtons() {
    this.#toolbox.colors.$coloredBtns.forEach((btn) => {
      btn.classList.remove(
        "large-color-button--active",
        "small-color-button--active",
      );
      if (btn.getAttribute("id") == "toolbox__color-white") {
        btn.style.border = "";
      }
    });

    this.#toolbox.colors.$colorPickerBtn.classList.remove(
      "color-picker--active",
    );
  }

  /**
   * Activates the color button selection based on the value of _ToolboxController.lastColorPencilId_.
   */
  setActiveSelectionColorButton() {
    this.#toolbox.colors.$coloredBtns.forEach((btn) => {
      if (btn.getAttribute("id") == this.#lastColorPencilId) {
        if (btn.classList.contains("large-color-button")) {
          btn.classList.add("large-color-button--active");
        } else if (btn.classList.contains("small-color-button")) {
          btn.classList.add("small-color-button--active");
        }

        btn.style.border = `0.1px solid ${document.querySelector(`#${this.#lastColorPencilId}`).getAttribute("data-color")}`;
      }
      if (
        this.#toolbox.colors.$colorPickerBtn.getAttribute("id") ==
        this.#lastColorPencilId
      ) {
        this.#toolbox.colors.$colorPickerBtn.classList.add(
          "color-picker--active",
        );
      }
    });
  }

  /**
   * Returns the _ToolboxController.lastColorPencilId_ value.
   * @returns {string} - Id of the last selected color.
   */
  getLastColorPencilId() {
    return this.#lastColorPencilId;
  }

  /**
   * Sets a specific value to a _ToolboxController.lastColorPencilId_ attribute.
   * @param {string} valueLastColorPencilId - Button color Id.
   */
  setLastColorPencilId(valueLastColorPencilId) {
    this.#lastColorPencilId = valueLastColorPencilId;
  }

  /**
   * Toggle adding or removing select-button--active classList depending on the state.
   * @param {boolean} state - State value.
   * @param {HTMLElement} $tool - Toolbox DOM element.
   */
  #updateToolSelecton(state, $tool) {
    if (state) {
      $tool.classList.add("select-button--active");
    } else {
      $tool.classList.remove("select-button--active");
    }
  }
}
