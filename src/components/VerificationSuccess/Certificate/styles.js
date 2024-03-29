import styled from "@emotion/styled";
import {Grid} from "@mui/material";

export const CertificateContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 24px auto;
`;

export const DisplayPropertiesContainer = styled(Grid)`
    margin: auto;
    padding: 36px 56px;
    border: 1px solid #bbb;
    border-radius: 24px;
    width: 65%;
`;

export const Property = styled(Grid)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 12px auto;
    padding: 0 8px;
`;


