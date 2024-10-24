import React, {
  HTMLAttributes,
  ReactElement,
  ButtonHTMLAttributes,
} from "react";

type StyledButtonProps = HTMLAttributes<HTMLButtonElement> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    fill?: boolean;
    icon?: ReactElement;
  };

function StyledButton(props: StyledButtonProps) {
  return props.disabled ? (
    <div
      className={
        `bg-disabledButtonBg p-px bg-no-repeat rounded-[5px]` +
        ` ${props.className}`
      }
    >
      <button
        {...props}
        className={`group bg-disabledButtonBg h-[40px] w-full rounded-[5px] flex items-center justify-center`}
      >
        {props.icon && <span className="mr-1.5">{props.icon}</span>}
        <span id={props.id} className="font-bold text-white normal-case">
          {props.children}
        </span>
      </button>
    </div>
  ) : (
    <div
      className={
        `bg-gradient p-px bg-no-repeat rounded-[5px]` + ` ${props.className}`
      }
    >
      <button
        {...props}
        className={`group bg-white hover:bg-gradient h-[40px] w-full rounded-[5px] flex items-center justify-center`}
      >
        {props.icon && <span className="mr-1.5">{props.icon}</span>}
        <span
          id={props.id}
          className="font-bold bg-gradient bg-clip-text text-transparent group-hover:text-white normal-case"
        >
          {props.children}
        </span>
      </button>
    </div>
  );
}

export default StyledButton;
