import Drawable from "./Drawable.js";
import State from "./State.js";

const $slider = document.querySelector(".footer__slider");
const $sliderTooltip = document.querySelector(".footer__slider-tooltip > p");
const $drawable = document.querySelector(".drawable__drawing");
const $resetBtn = document.querySelector("#footer__reset-btn");

// Tools
const $pencilBtn = document.querySelector("#toolbox__pencil-btn");
const $eraserBtn = document.querySelector("#toolbox__eraser-btn");
const $rainbowBtn = document.querySelector("#toolbox__rainbow-btn");
const $paintOnHoverBtn = document.querySelector("#toolbox__pencil-hover-btn");
const $gridBtn = document.querySelector("#toolbox__grid-btn");
const $deleteBtn = document.querySelector("#toolbox__delete-btn");
const $printBtn = document.querySelector("#toolbox__print-btn");
const $largeColoredBtns = document.querySelector(".toolbox__colors-large");
const $coloredBtns = document.querySelectorAll(
  ".large-color-button,.small-color-button",
);
const $colorPickerBtn = document.querySelector("#color-picker-tool");
const $helpBtn = document.querySelector("#toolbox__help-btn");

const pingereState = new State({
  paintOnHover: true,
  showGrid: true,
  pencil: true,
  eraser: false,
  rainbow: false,
  colorId: "toolbox__color-black",
  gridSize: 24,
});

const pingereToolbox = {
  tools: {
    $pencilBtn: $pencilBtn,
    $eraserBtn: $eraserBtn,
    $rainbowBtn: $rainbowBtn,
    $paintOnHoverBtn: $paintOnHoverBtn,
    $gridBtn: $gridBtn,
    $deleteBtn: $deleteBtn,
    $printBtn: $printBtn,
    $helpBtn: $helpBtn,
  },
  colors: {
    $largeColoredBtns: $largeColoredBtns,
    $coloredBtns: $coloredBtns,
    $colorPickerBtn: $colorPickerBtn,
  },
  help: {
    $helpBtn: $helpBtn,
  },
};

const pingereStatusBar = {
  $slider: $slider,
  $sliderTooltip: $sliderTooltip,
  $resetBtn: $resetBtn,
};

const myDrawable = new Drawable(
  pingereState,
  $drawable,
  pingereToolbox,
  pingereStatusBar,
);
