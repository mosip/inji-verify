import React from "react";
import SomethingWentWrong from "../components/SomethingWentWrong";
import { Logo } from "../utils/theme-utils";
import { Pages } from "../utils/config";

function Offline(props: any) {
  return (
    <div className="py-[46px] px-[15px] lg:px-[80px] bg-pageBackGroundColor bg-no-repeat h-[100%]">
      <a href={Pages.Home}>
        <Logo />
      </a>
      <SomethingWentWrong />
    </div>
  );
}

export default Offline;
