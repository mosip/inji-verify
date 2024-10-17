import React, {HTMLAttributes, ReactElement} from 'react';

type StyledButtonProps = HTMLAttributes<HTMLButtonElement> & {
    fill?: boolean,
    icon?: ReactElement
}

function StyledButton(props: StyledButtonProps) {
    return (
        <button
            {...props}
            className={`inline-flex content-center justify-center border-2 border-primary py-[12px] px-7 ` +
                `rounded-[9999px] hover:bg-primary bg-pageBackGroundColor ` +
                `hover:text-pageBackGroundColor text-primary ${props.className}`}
        >
            {
                props.icon && (
                    <span className="inline-grid mr-1.5">
                        {props.icon}
                    </span>
                )
            }
            <span id={props.id} className="font-bold text-lgNormalTextSize normal-case">
                {props.children}
            </span>
        </button>
    );
}

export default StyledButton;
