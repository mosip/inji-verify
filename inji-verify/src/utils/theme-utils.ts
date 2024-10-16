import orangeScanOutline from "../assets/scanner-ouline.svg";
import purpleScanOutline from "../assets/purple-scanner-ouline.svg"

export const ScanOutline = window._env_.DEFAULT_THEME !=="purple_theme" ? orangeScanOutline : purpleScanOutline;
