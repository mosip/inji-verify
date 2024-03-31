import React from 'react';
import {Box, Grid, Typography} from "@mui/material";
import GppGoodIcon from '@mui/icons-material/GppGood';

const VerificationSuccess = (props: any) => {
    return (
        <Grid container style={{
            display: "grid",
            placeItems: "center",
            placeContent: "center"
        }}>
            <Grid item xs={12}>
                <GppGoodIcon/>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    Results
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    Congratulations, the given certificate is valid!
                </Typography>
            </Grid>
        </Grid>
    );
}

export default VerificationSuccess;