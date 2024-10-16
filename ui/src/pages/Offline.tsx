import React from "react";
import SomethingWentWrong from "../components/SomethingWentWrong";
import { ReactComponent as Logo } from "../assets/images/inji-verify.svg";
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
