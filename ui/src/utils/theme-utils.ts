import { ReactComponent as InjiLogo } from "../assets/images/inji-verify.svg";
import orangeScanOutline from "../assets/scanner-outline.svg";
import purpleScanOutline from "../assets/purple-scanner-outline.svg";
import { ReactComponent as TabScanFillIcon } from "../assets/tab-scan-fill.svg";
import { ReactComponent as TabUploadIcon } from "../assets/upload-icon.svg";
import { ReactComponent as QrCodeIcon }  from "../assets/qr-code-icon.svg";
import {ReactComponent as NoCameraIcon} from "../assets/no-photography-icon.svg";

export const Logo = InjiLogo;
export const QrIcon = QrCodeIcon;
export const ScanIcon = TabScanFillIcon;
export const UploadIcon = TabUploadIcon;
export const NoPhotographyIcon = NoCameraIcon;
export const ScanOutline = window._env_.DEFAULT_THEME !== "purple_theme" ? orangeScanOutline : purpleScanOutline;
