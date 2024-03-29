import React, {useEffect, useState} from 'react';
import {verify} from "../utils/verification-utils.js";
import VerificationSuccess from "./VerificationSuccess";
import VerificationFailed from "./VerificationFailed";
import { CircularProgress, Grid, Typography} from "@mui/material";

const decompressData = (compressedData) => {
    //TODO: implement this
    let decompressedData = compressedData ?? "{}";
    return decompressedData;
}

const getVcFromQrData = async (qrData) => {
    return JSON.parse(decompressData(qrData?.text));
}

const getVcStatus = (qrData, setVc, setVcStatus, setLoading) => {
    if (!qrData?.text) return null;
    getVcFromQrData(qrData).then(vc => {
        verify(vc)
            .then(response => {
                setVcStatus(response);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error occurred while verifying the VC. Error: ", error);
                setVcStatus({status: "NOK", checks: []});
                setLoading(false);
            })
    }).catch(error => {
        console.error("Error occurred while reading the qr data. Error: ", error);
    });
}

const Loader = () => {
    return (
        <Grid container style={{margin: "32px auto", maxWidth: "200px", justifyContent: "center"}}>
            <Grid item xs={12}>
                <Typography variant="h4">
                    Verifying...
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <CircularProgress style={{fontSize: "32px", margin: "24px auto", justifySelf: "center"}}/>
            </Grid>
        </Grid>
    )
}

function VerificationResult({qrData, back}) {
    const [vcStatus, setVcStatus] = useState({status: "Evaluating", checks: []});
    const [vc, setVc] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getVcStatus(qrData, setVc, setVcStatus, setLoading);
    }, [qrData]);

    return (
        loading ? (<Loader/>)
            :
            (vcStatus?.status === "OK"
                ? (<VerificationSuccess vc={vc} back={back}/>)
                : (<VerificationFailed back={back}/>)
            )
    );
}

export default VerificationResult;
