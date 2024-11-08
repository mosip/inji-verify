import React, { HTMLAttributes, ReactElement } from "react";
import { RootState } from "../../../../redux/store";
import { useAppSelector } from "../../../../redux/hooks";
import { isRTL } from "../../../../utils/i18n";

type StyledButtonProps = HTMLAttributes<HTMLButtonElement> & {
  fill?: boolean;
  icon?: ReactElement;
};

function StyledButton(props: StyledButtonProps) {
  const language = useAppSelector((state: RootState) => state.common.language);
  const rtl = isRTL(language);
  return (
    <div
      className={`bg-gradient p-px bg-no-repeat rounded-[5px] ${props.className}`}
    >
      <button
        {...props}
        className={`group bg-white hover:bg-gradient h-[40px] w-full rounded-[5px] flex items-center justify-center`}
      >
        {props.icon && (
          <span className={`${rtl ? "ml-1.5" : "mr-1.5"}`}>{props.icon}</span>
        )}
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
