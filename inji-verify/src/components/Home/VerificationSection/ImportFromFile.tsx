import {scanFilesForQr} from "../../../utils/qr-utils";
import {QrScanResult} from "../../../types/data-types";
import {SetScanResultFunction} from "../../../types/function-types";
import StyledButton from "./commons/StyledButton";

export const ImportFromFile = ({setScanResult}: {setScanResult: SetScanResultFunction}) => {
    return (
        <div style={{margin: "12px auto", display: "grid", placeContent: "center"}}>
            <StyledButton>
                <label htmlFor={"upload-qr"}>
                    Upload your certificate</label>
            </StyledButton>
            <br/>
            <input
                type="file"
                id="upload-qr"
                name="upload-qr"
                accept=".png, .jpeg, .jpg, .pdf"
                style={{
                    margin: "8px auto",
                    display: "none"
                }}
                onChange={e => {
                    const file = e?.target?.files && e?.target?.files[0];
                    if (!file) return;
                    scanFilesForQr(file)
                        .then(scanResult => {
                            setScanResult(scanResult);
                        });
                }}
            />
        </div>);
}
