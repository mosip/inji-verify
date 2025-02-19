import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import NavHeader from "../components/NavHeader";
import Loading from "../components/Loading";
import Result from "../components/Result";
import Stepper from "@keyvaluesystems/react-stepper";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const Application = (props) => {
  const navLinks = ["home", "help"];
  const [isChild, setChild] = useState(0);
  const location = useLocation();
  const { t } = useTranslation("application");
  const user = location.state || {};

  const loanSteps = [
    {
      stepLabel: t("details"),
      stepDescription: t("details_description"),
      isCompleted: isChild === 0,
    },
    {
      stepLabel: t("eligible_check"),
      stepDescription: t("eligible_check_description"),
      isCompleted: isChild === 1,
    },
    {
      stepLabel: t("result"),
      stepDescription: t("result_description"),
      isCompleted: isChild === 2,
    },
  ];

  return (
    <div>
      {/* <NavHeader langOptions={props.langOptions} navLinks={navLinks} /> */}
      <div className="lg:flex block">
        <div className="lg:w-[30%] bg-[#53389E] text-white flex w-full">
          <div className="self-center m-auto">
            <Stepper
              steps={loanSteps}
              labelPosition="right"
              showDescriptionsForAllSteps
              currentStepIndex={isChild}
              orientation={window.screen.availWidth >= 1024 ? "vertical": "horizontal"}
              renderNode={(step, stepIndex) => {
                if(stepIndex < isChild) {
                  return (
                    <div key={stepIndex}>
                      <img src="assets/images/check.svg" className="fill-[#fff]" alt="check"/>
                    </div>
                  );
                }
                else if (stepIndex === isChild) {
                  return (
                    <div key={stepIndex}>
                      <img src="assets/images/dot.svg" className="border-[3px] rounded-[25px] shadow-lg" alt="active_dot"/>
                    </div>
                  );
                } 
                else {
                  return (
                    <div key={stepIndex}>
                      <img src="assets/images/dot.svg" alt="dot"/>
                    </div>
                  );
                }
              }}
            />
          </div>
        </div>
        <div className="lg:w-[70%] bg-[#F9F5FF] lg:p-[3rem] w-full p-6">
          {isChild === 0 && <Form child={(value) => setChild(value)} userInfo={user}/>}
          {isChild === 1 && <Loading child={(value) => setChild(value)} />}
          {isChild === 2 && <Result langOptions={props.langOptions}/>}
        </div>
      </div>
    </div>
  );
};

export default Application;
