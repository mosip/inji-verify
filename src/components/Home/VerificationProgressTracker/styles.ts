import {Box} from "@mui/material";
import styled from "@emotion/styled";

export const VerificationProgressTrackerContainer = styled(Box)`
    background: #FAFBFD 0 0 no-repeat padding-box;
    padding: 0 76px;
    margin-top: 0;
    height: 100vh;
    max-height: 100vh;
    overflow-y: scroll;
    @media (max-width: 600px) {
        max-height: 430px;
    }
`;
