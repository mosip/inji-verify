import React from 'react';
import {Button, ButtonProps, Typography} from "@mui/material";

function StyledButton(props: ButtonProps) {
    return (
        <Button
            {...props}
            style={{
                background: '#FFFFFF 0% 0% no-repeat padding-box',
                border: '2px solid #FF7F00',
                borderRadius: '9999px',
                opacity: 1,
                padding: '18px 28px',
                ...props.style
            }}
        >
            <span style={{
                font: 'normal normal bold 16px/21px Inter',
                textTransform: 'none'
            }}>
                {props.children}
            </span>
        </Button>
    );
}

export default StyledButton;
