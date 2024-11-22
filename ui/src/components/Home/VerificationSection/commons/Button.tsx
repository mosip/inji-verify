import React, {
  HTMLAttributes,
  ReactElement,
  ButtonHTMLAttributes,
} from "react";

type ButtonProps = HTMLAttributes<HTMLButtonElement> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    title:String;
    icon?: ReactElement;
    disabled?:boolean;
  };

export const Button = (props: ButtonProps) => {
  return (
    <div
      className={`${
        props.disabled ? "bg-disabledButtonBg" : "bg-gradient"
      } p-px bg-no-repeat rounded-[5px] ${props.className}`}
    >
      <button
        {...props}
        className={`group ${
          props.disabled ? "bg-disabledButtonBg" : "bg-white hover:bg-gradient"
        } h-[40px] w-full rounded-[5px] flex items-center justify-center`}
      >
        {props.icon && <span className="mr-1.5">{props.icon}</span>}
        <span
          id={props.id}
          className={`font-bold ${
            props.disabled
              ? "text-white"
              : "bg-gradient bg-clip-text text-transparent group-hover:text-white"
          } normal-case`}
        >
          {props.title}
        </span>
      </button>
    </div>
  );
};
