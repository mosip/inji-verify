import React from 'react';
import {Box, Grid, Typography, useMediaQuery} from "@mui/material";
import {ReactComponent as VerificationSuccessIcon} from "../../../../assets/verification-success-icon.svg";
import {ReactComponent as VerificationFailedIcon} from "../../../../assets/verification-failed-icon.svg";
import {SetActiveStepFunction} from "../../../../types/function-types";
import {ResultIconContainer, ResultSummaryComponent} from "./styles";

const ResultSummary = ({success, isMobile}: {
    success: boolean,
    isMobile: boolean
}) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <ResultSummaryComponent container gap={1}>
                    <Grid item xs={3} sm={2} md={12}>
                        <ResultIconContainer style={{
                            color: success ? "#4B9D1F": "#CB4242"
                        }}>
                            {success ? <VerificationSuccessIcon/> : <VerificationFailedIcon/>}
                        </ResultIconContainer>
                    </Grid>
                    <Grid item xs={8} sm={9} md={12}>
                        <Typography style={{
                            font: "normal normal bold 20px/24px Inter",
                            margin: "7px auto"
                        }}>
                            Results
                        </Typography>
                        <Typography style={{font: "normal normal normal 16px/20px Inter"}}>
                            {success
                                ? "Congratulations, the given credential is valid!"
                                : "Unfortunately, the given credential is invalid!"}
                        </Typography>
                    </Grid>
                </ResultSummaryComponent>
            </Grid>
        </Grid>
    );
}

export default ResultSummary;
