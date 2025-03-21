import { GradientUploadIcon, WhiteUploadIcon } from "../../../utils/theme-utils";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useState } from "react";
import { RootState } from "../../../redux/store";
import { isRTL } from "../../../utils/i18n";
import { acceptedFileTypes, handleFileUpload } from "../../../utils/fileUploadUtils";

export const UploadQrCode = ({
  displayMessage,
  className,
}: {
  displayMessage: string;
  className?: string;
}) => {
  const dispatch = useAppDispatch();
  
  const [isHover, setHover] = useState(false)

  const UploadButton =({ displayMessage }: { displayMessage: string })=> {
    const UploadIcon = isHover ? WhiteUploadIcon : GradientUploadIcon;
    const language = useAppSelector((state: RootState) => state.common.language);
    const rtl = isRTL(language);
    
    return (
      <div className={`bg-${window._env_.DEFAULT_THEME}-gradient hover:text-white p-px bg-no-repeat rounded-[5px] w-[350px]`}>
        <label
          htmlFor={"upload-qr"}
          onMouseEnter={()=>setHover(true)}
          onMouseLeave={()=>setHover(false)}
          onTouchStart={()=>setHover(true)}
          className={`group bg-white hover:bg-${window._env_.DEFAULT_THEME}-gradient font-bold h-[40px] rounded-[5px] flex content-center justify-center text-lgNormalTextSize pt-2 cursor-pointer`}
        >
          <span className={`${rtl ? "ml-1.5" : "mr-1.5"}`}>
            <UploadIcon />
          </span>
          <span id="upload-qr-code-button" className={`bg-${window._env_.DEFAULT_THEME}-gradient bg-clip-text text-transparent group-hover:text-white`}>{displayMessage}</span>
        </label>
      </div>
    );
  }

  return (
    <div className={`mx-auto my-1.5 flex content-center justify-center ${className}`} >
      <UploadButton displayMessage={displayMessage} />     
      <br />
      <input
        type="file"
        id="upload-qr"
        name="upload-qr"
        accept={acceptedFileTypes}
        className="mx-auto my-2 hidden h-0"
        onChange={(e) => handleFileUpload(e, dispatch)}
      />
    </div>
  );
};
