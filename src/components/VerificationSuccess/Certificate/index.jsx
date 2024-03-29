import React from 'react';
import StyledButton from "../../commons/StyledButton.js";
import {Grid} from "@mui/material";
import {convertToTitleCase, getDisplayValue} from "../../../utils/misc.js";
import PropTypes from "prop-types";
import {CertificateContainer, DisplayPropertiesContainer, Property} from "./styles.js";
import {DISPLAY_TEXT, SUPPORTED_LANGUAGE} from "../../../utils/config.js";

function Certificate({vc, onBackPress}) {
    return (
        <CertificateContainer>
            <img style={{margin: "12px auto"}}
                 width="50px" height="50px"
                src="https://cdn-icons-png.freepik.com/512/5610/5610944.png" alt="verified icon"/>
            <p style={{margin: "8px auto", fontWeight: 500, fontSize: "32px"}}>
                {DISPLAY_TEXT[SUPPORTED_LANGUAGE].certificateVerified}
            </p>
            <p style={{margin: "24px auto", fontWeight: 500, fontSize: "24px"}}>
                {DISPLAY_TEXT[SUPPORTED_LANGUAGE].certificateFor}{convertToTitleCase(vc.credentialSubject.type)}
            </p>
            <DisplayPropertiesContainer container>
                {
                    Object.keys(vc.credentialSubject)
                        .filter(key => key?.toLowerCase() !== "id" && key.toLowerCase() !== "type")
                        .map(key => {
                        return (
                            <Property item container xs={12} md={6} key={key}>
                                <Grid item xs={12}>{convertToTitleCase(key)}</Grid>
                                <Grid item xs={12} style={{fontWeight: 500, marginTop: "8px"}}>{getDisplayValue(vc.credentialSubject[key])}</Grid>
                            </Property>
                        )
                    })
                }
            </DisplayPropertiesContainer>
            <div style={{margin: "24px auto"}}>
                <StyledButton onClick={onBackPress}>
                    {DISPLAY_TEXT[SUPPORTED_LANGUAGE].verifyAnotherCertificate}
                </StyledButton>
            </div>
        </CertificateContainer>
    );
}

Certificate.propTypes = {
    vc: PropTypes.object.isRequired,
    onBackPress: PropTypes.func.isRequired
}

export default Certificate;
