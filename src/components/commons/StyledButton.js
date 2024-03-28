import React from 'react';

const DefaultProps = {
    background: {
        startColor: '#2cd889',
        endColor: '#4ca07a'
    }
}

function StyledButton({children, onClick, stylingProps}) {
    stylingProps = stylingProps ?? DefaultProps;
    return (
        <button
            onClick={onClick}
            style={{
                background: `transparent linear-gradient(90deg,${stylingProps.background.startColor},${stylingProps.background.endColor}) 0 0 no-repeat padding-box`,
                borderRadius: '4px',
                color: '#fff',
                border: 'none',
                padding: '.75rem 3rem',
                margin: '1rem auto',
                textAlign: "center",
                fontSize: "1rem",
                display: "inline-flex",
                alignItems: "center"
            }}>
            {children}
        </button>
    );
}

export default StyledButton;
