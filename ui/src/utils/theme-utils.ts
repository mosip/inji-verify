import { ReactComponent as InjiLogo } from "../assets/images/inji-verify.svg";
import orangeScanOutline from "../assets/scanner-outline.svg";
import purpleScanOutline from "../assets/purple-scanner-outline.svg";
import { ReactComponent as GradientScanFillIcon } from "../assets/gradient-scan-icon.svg";
import { ReactComponent as WhiteScanFillIcon} from "../assets/white-scan-icon.svg"
import { ReactComponent as GradientTabUploadIcon } from "../assets/gradient-upload-icon.svg";
import { ReactComponent as WhiteTabUploadIcon } from "../assets/white-upload-icon.svg";
import { ReactComponent as QrCodeIcon }  from "../assets/qr-code-icon.svg";
import {ReactComponent as CameraDeniedIcon} from "../assets/camera-access-denied-icon.svg";

export const Logo = InjiLogo;
export const QrIcon = QrCodeIcon;
export const GradientScanIcon = GradientScanFillIcon;
export const WhiteScanIcon = WhiteScanFillIcon;
export const GradientUploadIcon = GradientTabUploadIcon;
export const WhiteUploadIcon = WhiteTabUploadIcon;
export const CameraAccessDeniedIcon  = CameraDeniedIcon;
export const ScanOutline = window._env_.DEFAULT_THEME !== "purple_theme" ? orangeScanOutline : purpleScanOutline;
