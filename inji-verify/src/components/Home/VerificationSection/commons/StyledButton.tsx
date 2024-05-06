import React, {HTMLAttributes, ReactElement} from 'react';

type StyledButtonProps = HTMLAttributes<HTMLButtonElement> & {
    fill?: boolean,
    icon?: ReactElement
}

function StyledButton(props: StyledButtonProps) {
    return (
        <button
            {...props}
            className={`inline-flex content-center justify-center border-2 border-[#FF7F00] py-[18px] px-7 ` +
                `rounded-[9999px] ${props.fill ? 'bg-[#FF7F00]' : 'bg-[#FFFFFF]'} ` +
                `${props.fill ? 'text-[#FFFFFF]' : 'text-[#FF7F00]'} ${props.className}`}
        >
            {
                props.icon && (
                    <span style={{display: "inline-grid", marginRight: "6px"}}>
                        {props.icon}
                    </span>
                )
            }
            <span style={{
                font: 'normal normal bold 16px/21px Inter',
                textTransform: 'none'
            }}>
                {props.children}
            </span>
        </button>
    );
}

export default StyledButton;
