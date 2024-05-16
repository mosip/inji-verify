import React, {useEffect, useState} from 'react';
import {Box, Divider, Grid, Typography} from '@mui/material';
import {convertToTitleCase, fetchWellknownProperties, getDisplayValue} from "../../../../utils/misc";
import StyledButton from "../commons/StyledButton";
import {SAMPLE_VERIFIABLE_CREDENTIAL} from "../../../../utils/samples";
import {SetActiveStepFunction} from "../../../../types/function-types";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {VerificationSteps} from "../../../../utils/config";
import {VcDisplay, VcProperty, VcPropertyKey, VcPropertyValue, VcVerificationFailedContainer} from "./styles";
import {constructWellKnownUrlFromDid} from "../../../../utils/did-utils";
import Loader from "../../../commons/Loader";


const DisplayVc = ({loadingWellKnown, credentialDisplayProperties, vc}: {credentialDisplayProperties: any, loadingWellKnown: boolean, vc: any}) => {
    return loadingWellKnown ?
        (<Box style={{width: "100%", margin: 4}}>
            <Loader style={{marginTop: 20}}/>
            <Box style={{padding: "8px 0px", width: "100%", textAlign: "center", fontWeight: 500, fontSize: 15}}>
                <p>Rendering the credential...</p>
            </Box>
        </Box>)
        : (<>
            {
                Object.keys(credentialDisplayProperties ?? vc.credentialSubject)
                    .filter(key => key !== "id" && key !== "type")
                    .map((key, index) => (
                        <VcProperty item xs={12} lg={6} key={key}>
                            <VcPropertyKey>
                                {credentialDisplayProperties ? credentialDisplayProperties[key].display[0].name : convertToTitleCase(key)}
                            </VcPropertyKey>
                            <VcPropertyValue>
                                {getDisplayValue(vc.credentialSubject[key])}
                            </VcPropertyValue>
                        </VcProperty>
                    ))
            }
        </>)
}

function VcDisplayCard({vc, setActiveStep}: {vc: any, setActiveStep: SetActiveStepFunction}) {
    const [wellKnownProperties, setWellKnownProperties] = useState<any>();
    const [loadingWellKnown, setLoadingWellKnown] = useState(true);

    useEffect(() => {
        fetchWellknownProperties(constructWellKnownUrlFromDid(vc?.issuer))
            .then(response => {
                setWellKnownProperties(response);
            })
            .catch(error => {
                setWellKnownProperties(null);
            })
            .finally(() => {setLoadingWellKnown(false)})
    }, []);

    const credentialDetails = wellKnownProperties?.credentials_supported ? wellKnownProperties?.credentials_supported[0] : null;
    const credentialDisplayProperties: any = credentialDetails?.credential_definition?.credentialSubject;

    return (
        <Box style={{paddingBottom: 60}}>
            <VcDisplay container>
                {
                    credentialDisplayProperties && vc && (
                        <>
                            <Box style={{padding: "10px 4px", width: "100%", textAlign: "center"}}
                                className={`justify-start py-2.5 px-1 xs:col-end-13 w-[100%] text-center`}
                            >
                                <img style={{margin: "4px auto"}}
                                     width={100}
                                     src={credentialDetails?.display[0].logo.url}
                                     alt={credentialDetails?.display[0].logo.alt_text}
                                />
                                <Typography style={{fontWeight: 600, fontSize: 15, margin: "4px auto"}} className="font-medium text-[14px] mx-auto my-1">
                                    {credentialDetails?.display[0].name}
                                </Typography>
                            </Box>
                            <Divider style={{width: "100%"}}/>
                        </>
                    )
                }
                {
                    vc ? (<DisplayVc credentialDisplayProperties={credentialDisplayProperties} loadingWellKnown={loadingWellKnown} vc={vc}/>)
                        : (
                            <VcVerificationFailedContainer>
                                <DescriptionOutlinedIcon fontSize={"inherit"} color={"inherit"}/>
                            </VcVerificationFailedContainer>
                        )
                }
                {
                    credentialDisplayProperties && vc && (
                        <>
                            <Divider style={{width: "100%"}}/>
                            <Typography style={{fontSize: 12, textAlign: "right", width: "100%", padding: "10px 5px"}} className="text-[12px] text-right w-[100%] pr-3">
                                Issued by <b>{wellKnownProperties.credential_issuer}</b>
                            </Typography>
                        </>
                    )
                }
            </VcDisplay>
            <Box style={{
                display: 'grid',
                placeContent: 'center'
            }}>
                <StyledButton style={{margin: "24px auto"}} onClick={() => {
                    setActiveStep(VerificationSteps.ScanQrCodePrompt)
                }}>
                    Verify QR Code
                </StyledButton>
            </Box>
        </Box>
    );
}

export default VcDisplayCard;
