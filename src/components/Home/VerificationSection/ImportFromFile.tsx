import QrReader from "jsqr";

function onImageLoad ({image, setQrData}: any) {
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx?.drawImage(image, 0, 0);
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return;
    const qrData = QrReader(imageData.data, imageData.width, imageData.height);
    setQrData(qrData?.data?.toString());
};

function onFileReaderLoad (e: ProgressEvent<FileReader>, setQrData: any) {
    const image = new Image();
    image.onload = (ev) => onImageLoad({image, setQrData})
    image.src = e?.target?.result?.toString() || "";
};

export const ImportFromFile = ({setQrData}: {setQrData: (qrData?: string) => void}) => {
    return (
        <div style={{margin: "12px auto", display: "grid", placeContent: "center"}}>
            <label htmlFor={"upload-qr"} style={{font: 'normal normal normal 16px/21px Inter'}}>Upload your certificate</label><br/>
            <input
                type="file"
                id="upload-qr"
                name="upload-qr"
                accept=".png, .jpeg"
                style={{
                    margin: "8px auto"
                }}
                onChange={e => {
                    const file = e?.target?.files && e?.target?.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev: ProgressEvent<FileReader>) => onFileReaderLoad(ev, setQrData)
                    reader.readAsDataURL(file);
                    console.log({file, reader})
                }}
            />
            <canvas id="canvas" style={{"display": "none"}}></canvas>
        </div>);
}
