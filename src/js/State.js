/**
 * App state.
 * @class State
 */

export default class State {
  #state;

  /**
   * @param {object} state - The state.
   * @param {boolean} state.paintOnHover - Toggle when Paint On Hover.
   * @param {boolean} state.showGrid - Toggle when the drawable grid is displayed.
   * @param {boolean} state.pencil - Toggle paint mode.
   * @param {boolean} state.eraser - Toggle eraser mode.
   * @param {boolean} state.rainbow - Toggle rainbow mode.
   * @param {string} state.colorId - String of the selected color id.
   * @param {integer} state.gridSize - Grid size
   */
  constructor(state) {
    this.#state = state;
    this.#validateExclusiveTools();
    this.#checkEmptyStringColorid();
    this.#checkEmptyGridSize();
  }

  /**
   * Sets a specific value to a _state_ property.
   * @param {string} propertyName - State property.
   * @param {string|boolean|integer} value - Property value.
   */
  setProperty(propertyName, value) {
    this.#state[propertyName] = value;
  }

  /**
   * Return the value of a specific property
   * @param {string} propertyName - State property.
   * @returns {string|boolean|integer} - Property value.
   */
  getProperty(propertyName) {
    return this.#state[propertyName];
  }

  /**
   * Returns the _state_ object
   * @returns {object} - Object State
   */
  getAllProperties() {
    return { ...this.#state };
  }

  /**
   * Checks if the selection buttons are true or false and that the eraser is true
   */
  #validateExclusiveTools() {
    let count = 0;
    if (this.#state.pencil) count++;
    if (this.#state.rainbow) count++;
    if (this.#state.eraser) count++;

    if (count > 1) {
      throw new Error(
        "Only one tool can be active at a time: pencil, rainbow or eraser",
      );
    }

    if (
      this.#state.pencil == false &&
      this.#state.rainbow == false &&
      this.#state.eraser == false
    ) {
      throw new Error("At least one tool must be true");
    }

    if (this.#state.eraser == true) {
      throw new Error("The eraser cannot be true");
    }
  }

  /**
   * Checks if the _state.colorId_ string is empty.
   */
  #checkEmptyStringColorid() {
    if (this.#state.colorId.length == 0) {
      throw new Error("There must be a color Id");
    }
  }

  /**
   * Checks if the _state.gridSize_ is greater than one.
   */
  #checkEmptyGridSize() {
    if (!this.#state.gridSize >= 1) {
      throw new Error("The grid size must be >=1");
    }
  }
}
