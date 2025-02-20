import React, {HTMLAttributes, ReactElement} from 'react';

type StyledButtonProps = HTMLAttributes<HTMLButtonElement> & {
    fill?: boolean,
    icon?: ReactElement
}

function StyledButton(props: StyledButtonProps) {
    return (
        <button
            {...props}
            className={`inline-flex content-center justify-center border-2 border-[#7F56D9] py-[12px] px-7 ` +
                `rounded-[9999px] hover:bg-[#7F56D9] bg-[#FFFFFF] ` +
                `hover:text-[#FFFFFF] text-[#7F56D9] ${props.className}`}
        >
            {
                props.icon && (
                    <span className="inline-grid mr-1.5">
                        {props.icon}
                    </span>
                )
            }
            <span id={props.id} className="font-bold text-[16px] normal-case">
                {props.children}
            </span>
        </button>
    );
}

export default StyledButton;
