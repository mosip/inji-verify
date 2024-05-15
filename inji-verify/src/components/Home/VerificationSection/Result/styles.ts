import styled from "@emotion/styled";
import {Box, Grid, Typography} from "@mui/material";

export const ResultsSummaryContainer = styled(Box)(({success, isMobile}: { success: boolean, isMobile: boolean }) => (
    {
        height: isMobile ? "auto" : "340px",
        backgroundColor: success ? "#4B9D1F" : "#CB4242",
        color: "white"
    }
));

export const ResultSummaryComponent = styled(Grid)`
    display: flex;
    place-items: center;
    place-content: center;
    padding: 30px;
    text-align: center;
    @media (max-width: 900px) {
        padding: 25px;
        text-align: left;
        place-content: flex-start;
        max-width: 550px;
        margin: auto
    }
    @media (min-width: 600px) {
        place-content: space-around;
    }
`;

export const ResultIconContainer = styled(Box)`
    border-radius: 50%;
    background-color: white;
    height: 68px;
    width: 68px;
    display: grid;
    place-content: center;
    font-size: 24px;
    margin: 7px auto;
    @media (max-width: 900px) {
        height: 30px;
        width: 30px;
        font-size: 24px;
        margin: 4px auto;
    }
`

export const VcDisplayCardContainer = styled(Box)`
    margin: auto;
    top: 212px;
    right: calc((50vw - 400px) / 2);
`;

export const VcDisplay = styled(Grid)`
    width: calc(min(400px, 90vw));
    margin: auto;
    background: white;
    border-radius: 12px;
    padding: 5px 15px;
    box-shadow: 0 3px 15px #0000000F;
    @media (max-width: 900px) {
        margin-top: 25px;
    }
`;

export const VcProperty = styled(Grid)`
    padding: 10px 4px;
`;

export const VcPropertyKey = styled(Typography)`
    font: normal normal normal 11px/14px Inter;
    margin-bottom: 4px
`

export const VcPropertyValue = styled(Typography)`
    font: normal normal 600 12px/15px Inter
`

export const VcVerificationFailedContainer = styled(Box)`
    display: grid;
    place-content: center;
    width: 100%;
    height: 320px;
    color: rgb(0, 0, 0, 0.1);
    font-size: 100px;
`
