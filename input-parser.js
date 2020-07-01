import BoardParser from './parsers/board.js';
import TokenParser from './parsers/token.js';
import IconParser from './parsers/icon.js';
import OverlayParser from './parsers/overlay.js';
import ZoomParser from "./parsers/zoom.js";
import BackgroundParser from "./parsers/background.js";
import LineParser from "./parsers/line.js";
import DarkModeParser from "./parsers/dark-mode.js"; 
import GridOpacityParser from "./parsers/grid-opacity.js"; 
import Icon from "./icon.js";
import EffectParser from './parsers/effect-parser.js';

export default class InputParser {
  constructor(pathname = "") {
    let parts = [];
    this.board = { width: 10, height: 10 };
    this.lines = [];
    this.tokens = [];
    this.effects = [];
    this.icons = [];
    this.overlays = [];
    this.options = [];
    this.zoom = 1;
    this.darkMode = false;
    this.gridOpacity = 1;

    // trim off leading /
    if (pathname[0] === "/") parts = pathname.substr(1)
    // trim of trailing /
    if (pathname[pathname.length - 1] === "/") pathname.substr(0, pathname.length - 1);
    parts = pathname.split("/");

    const boardParser = new BoardParser();
    const tokenParser = new TokenParser();
    const iconParser = new IconParser();
    const overlayParser = new OverlayParser();
    const zoomParser = new ZoomParser();
    const backgroundParser = new BackgroundParser();
    const lineParser = new LineParser();
    const darkModeParser = new DarkModeParser();
    const gridOpacityParser = new GridOpacityParser();
    const effectParser = new EffectParser();

    for (const part of parts) {
      let parsed = boardParser.parse(part);
      if (parsed) {
        this.board = parsed;
        continue;
      }

      parsed = tokenParser.parse(part);
      if (parsed) {
        this.tokens.push(parsed);
        continue;
      }

      parsed = overlayParser.parse(part);
      if (parsed) {
        this.overlays.push(parsed);
        continue;
      }

      parsed = iconParser.parse(part);
      if (parsed) {
        this.icons.push({ x: parsed.x, y: parsed.y, item: new Icon(parsed) });
        continue;
      }

      parsed = backgroundParser.parse(part);
      if (parsed) {
        this.background = parsed;
        continue;
      }

      parsed = lineParser.parse(part);
      if (parsed) {
        this.lines = this.lines.concat(parsed);
        continue;
      }

      parsed = effectParser.parse(part);
      if (parsed) {
        this.effects.push(parsed);
        continue;
      }

      /* Because all of the options here can be grouped, we need to parse them
         together and not skip after a successful parse  */

      parsed = zoomParser.parse(part);
      if (parsed) {
        this.zoom = parsed;
      }

      parsed = darkModeParser.parse(part);
      if (parsed) {
        this.darkMode = parsed;
      }

      parsed = gridOpacityParser.parse(part);
      if (null !== parsed) { /* This check is like this because one of the valid returns is 0.0 */
        this.gridOpacity = parsed;
      }

      // Extend by adding more parsers here
    } 
  }
}
