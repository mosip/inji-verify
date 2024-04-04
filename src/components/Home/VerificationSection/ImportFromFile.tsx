import {scanFilesForQr} from "../../../utils/qr-utils";
import {QrScanResult} from "../../../types/types";

export const ImportFromFile = ({setScanResult}: {setScanResult: (result: QrScanResult) => void}) => {
    return (
        <div style={{margin: "12px auto", display: "grid", placeContent: "center"}}>
            <label htmlFor={"upload-qr"} style={{font: 'normal normal normal 16px/21px Inter'}}>Upload your certificate</label><br/>
            <input
                type="file"
                id="upload-qr"
                name="upload-qr"
                accept=".png, .jpeg, .jpg, .pdf"
                style={{
                    margin: "8px auto"
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
            <canvas id="canvas" style={{"display": "none"}}></canvas>
        </div>);
}
