import React, {useEffect} from 'react';
import {useContinuousScanner, useDeviceList} from '@yudiel/react-qr-scanner';

const getVideoDeviceId = (deviceList: MediaDeviceInfo[]): string => {
    const videoDevices = deviceList?.filter(deviceInfo => deviceInfo.kind === "videoinput");
    if (videoDevices?.length >= 1) {
        console.log("DeviceId: ", videoDevices[0].deviceId);
        return videoDevices[0].deviceId;
    }
    return "";
}

function QrScanner({setVerifying}: any) {
    const videoRef = React.createRef<HTMLVideoElement>();
    const deviceList = useDeviceList();
    console.log("Device list: ", deviceList);
    const scannerHook = useContinuousScanner({
        options: {
            deviceId: getVideoDeviceId(deviceList),
            constraints: {
                aspectRatio: 1
            }
        },
        audio: true,
        onError: (error) => console.log(error?.message),
        onResult: (result) => {
            scannerHook.stopScanning();
            console.log(result);
            setVerifying(true);
        }
    });

    useEffect(() => {
        if (!!(videoRef?.current)) {
            scannerHook.ref = videoRef;
            navigator.mediaDevices
                .getUserMedia({ video: { width: 300 } })
                .then(stream => {
                    if (videoRef?.current) {
                        let video = videoRef.current;
                        video.srcObject = stream;
                        video.play()
                            .then(response => {
                                // console.log("Video stream response: ", response)
                                // scannerHook.startScanning();
                                // console.log(scannerHook.scanning);
                            })
                            .catch(error => console.log("Error while streaming: ", error));
                    }
                })
                .catch(err => {
                    console.error("error:", err);
                });
        }
    }, [videoRef]);

    function getScanningStatus() {
        return {scanning: scannerHook.scanning, loading: scannerHook.loading};
    }

    return (
        <video
            ref={videoRef}
            autoPlay={true} playsInline={true}
               style={{
                   height: "100%",
                   margin: "auto"
               }}
               muted={true}
            onPlay={() => {
                console.log("Trying to start scanning inside the event listener")
                scannerHook.startScanning();
                console.log(scannerHook.loading, scannerHook.scanning);
                console.log(getScanningStatus())
            }}
        >

        </video>
    );
}

export default QrScanner;
