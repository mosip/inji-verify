import {CircularProgress, Grid, Typography} from "@mui/material";
import React from "react";

export const Loader = () => {
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
