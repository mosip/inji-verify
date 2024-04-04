import React from 'react';
import {Box, Typography} from "@mui/material";
import injiLogo from "../../../assets/inji-logo.png";

function Navbar(props: any) {
    // Logo goes here
    return (
        <Box style={{height: "52px", margin: "60px 0"}}>
            <img src={injiLogo}/>
        </Box>
    );
}

export default Navbar;
