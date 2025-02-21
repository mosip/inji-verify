import React, {
  HTMLAttributes,
  ReactElement,
  ButtonHTMLAttributes,
} from "react";

type ButtonProps = HTMLAttributes<HTMLButtonElement> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    title: String;
    icon?: ReactElement;
    fill?: boolean;
    disabled?: boolean;
  };

export const Button = (props: ButtonProps) => {
  return (
    <div
      className={`${
        props.disabled ? "bg-disabledButtonBg" : `bg-${window._env_.DEFAULT_THEME}-gradient`
      } p-px bg-no-repeat rounded-[5px] ${props.className}`}
    >
      <button
        {...props}
        className={`group ${
          props.disabled
            ? "bg-disabledButtonBg"
            : props.fill
            ? `bg-${window._env_.DEFAULT_THEME}-gradient`
            : `bg-white hover:bg-${window._env_.DEFAULT_THEME}-gradient`
        } h-[40px] w-full rounded-[5px] flex items-center justify-center`}
      >
        {props.icon && <span className="mr-1.5">{props.icon}</span>}
        <span
          id={props.id}
          className={`font-bold px-3 ${
            props.disabled
              ? "text-white"
              : props.fill
              ? "text-white"
              : `bg-${window._env_.DEFAULT_THEME}-gradient bg-clip-text text-transparent group-hover:text-white`
          } normal-case`}
        >
          {props.title}
        </span>
      </button>
    </div>
  );
};
