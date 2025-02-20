import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Loading = (props) => {
  const { t } = useTranslation("loading");
  useEffect(() => {
    setTimeout(() => {
      props.child(2);
    }, 2000);
  }, []);

  return (
    <div className="rounded-[2rem] bg-white shadow-md">
      <p className="text-center text-[#42307D] text-[2.5rem] font-semibold w-[50%] mx-auto pt-[3rem]">
        {t("background_process")}
      </p>
      <img
        src="assets/gifs/loading.gif"
        alt="loading"
        className="block m-auto h-[350px]"
      />
      <p className="text-center text-[#42307D] font-semibold w-[50%] text-[1.5rem] mx-auto pb-[3rem]">
        {t("please_wait")}
      </p>
    </div>
  );
};

export default Loading;
