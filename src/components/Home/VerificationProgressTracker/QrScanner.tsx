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
    console.log("Devicelist: ", deviceList);
    const scannerHook = useContinuousScanner({
        options: {
            deviceId: getVideoDeviceId(deviceList)
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
            if(!!scannerHook.getSettings) {
                console.log(scannerHook.getSettings())
            }
            console.log(scannerHook.loading)
            console.log(scannerHook.scanning)
            let video = videoRef.current;
            navigator.mediaDevices
                .getUserMedia({ video: { width: 300, aspectRatio: 1 } })
                .then(stream => {
                    video.srcObject = stream;
                    /*video.onplay = (event) => {
                        console.log("Trying to start scanning inside the event listener")
                        scannerHook.startScanning();
                        console.log(scannerHook.scanning);
                        console.log(video.srcObject)
                        if(!!scannerHook.getSettings) {
                            console.log(scannerHook.getSettings())
                        }
                    };*/
                    video.play()
                        .then(response => {
                            console.log("Video stream response: ", response)
                            scannerHook.startScanning();
                            console.log(scannerHook.scanning);
                        })
                        .catch(error => console.log("Error while streaming: ", error));
                })
                .catch(err => {
                    console.error("error:", err);
                });
        }
    }, [videoRef]);


    return (
        <video
            ref={videoRef}
            autoPlay={true} playsInline={true}
               style={{
                   height: "90%"
               }}
               muted={true}>

        </video>
    );
}

export default QrScanner;
