import {Box, Typography} from "@mui/material";
import styled from "@emotion/styled";

export const VerificationProgressTrackerContainer = styled(Box)`
    background: #FAFBFD 0 0 no-repeat padding-box;
    margin-top: 0;
    height: 100vh;
    max-height: 100vh;
    padding: 0 60px 0 76px;
    @media (max-width: 768px) {
        padding: 0 25px;
        height: auto;
    }
`;

export const NavbarContainer = styled(Box)`
    height: 52px;
    margin: 46px 0 60px 0;
    @media (max-width: 768px) {
        margin: 25px 0;
        height: 50px;
    }
`

export const Heading = styled(Typography)`
    margin: 6px 0;
    font: normal normal bold 26px/31px Inter;
    @media (max-width: 768px) {
        font: normal normal 600 24px/28px Inter;
        margin: 0
    }
`

export const Description = styled(Typography)`
    font: normal normal normal 16px/21px Inter;
    margin: 6px 0
`

export const CopyrightsContainer = styled(Box)`
    position: fixed;
    bottom: 0;
    width: 50%;
    display: grid;
    place-content: center;
    background: white;
    @media (max-width: 768px) {
        width: 100%;
        position: static;
        padding-bottom: 60px
    }
`

export const CopyrightsContent = styled(Typography)`
    font: normal normal normal 14px/17px Inter;
    padding: 16px 0;
    color: #707070;
    width: 100%;
    text-align: center;
`