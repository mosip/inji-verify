import styled from "@emotion/styled";
import {Grid} from "@mui/material";

export const ScanQrCodeContainer = styled(Grid)`
    text-align: center;
    display: grid;
    place-content: center;
    padding: 78px 104px;
    @media (max-width: 900px) {
        padding: 25px 52px;
    }
`;

export const VerificationBlockContainer = styled(Grid)`
    text-align: center;
    display: grid;
    place-content: center;
    padding: 78px 104px;
    @media (max-width: 900px) {
        padding: 25px 52px;
    }
`;
