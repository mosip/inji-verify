import {Divider} from "@mui/material";
import React from "react";
import {CopyrightsContainer, CopyrightsContent} from "./styles";

function Copyrights(props: any) {
    return (
        <CopyrightsContainer className="inji-verify-footer-container">
            <Divider style={{width: '40vw'}} className="inji-verify-footer-hr"/>
            <CopyrightsContent >
                2024 © MOSIP - All rights reserved.
            </CopyrightsContent>
        </CopyrightsContainer>
    );
}

export default Copyrights;
