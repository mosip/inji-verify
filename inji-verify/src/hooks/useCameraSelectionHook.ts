import {useEffect, useState} from "react";

export const useCameraSelectionHook = () => {
    const [videoInputOptions, setVideoInputOptions] = useState<MediaDeviceInfo[] | undefined>(undefined);
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
            navigator.mediaDevices
                .enumerateDevices()
                .then((devices) => {
                    console.log("Devices: ", devices);
                    setVideoInputOptions(devices.filter(device => device.kind === "videoinput"));
                })
                .catch((err) => {
                    console.error(`${err.name}: ${err.message}`);
                });
        }).catch(error => {
            console.log("Error occurred while getting the media devices")
        })
    }, []);
    return {videoInputOptions: videoInputOptions ?? []};
}