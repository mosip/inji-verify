import styled from "@emotion/styled";
import {Box} from "@mui/material";

export const ResultsSummaryContainer = styled(Box)(({success}: { success: boolean }) => (
    {
        height: "340px",
        backgroundColor: success ? "#4B9D1F" : "#CB4242",
        color: "white"
    }
));

export const VcDisplayCardContainer = styled(Box)(({cardPositioning}: {
        cardPositioning: { top?: number, right?: number }
    }) => (
        {
            margin: "auto",
            top: cardPositioning.top ?? 212,
            right: cardPositioning.right ?? 0,
            // position: "absolute"
        }
    )
);
