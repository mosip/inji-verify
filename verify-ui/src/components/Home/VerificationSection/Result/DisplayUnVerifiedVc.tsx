import { convertToId, convertToTitleCase } from "../../../../utils/misc";
import { claim } from "../../../../types/data-types";
import { t } from "i18next";

interface DisplayUnVerifiedVcProps {claim: string;}

function DisplayUnVerifiedVc({ claim }: DisplayUnVerifiedVcProps) {
  return (
    <div
      className={`flex items-center justify-between bg-[#F5F5F5] w-[339px] lg:w-[410px] py-[5px] px-[15px] shadow-lg rounded-[12px] border border-[#C4C4C4]`}
    >
      <div className="flex items-center">
        {/* <img src={claim.logo} alt={claim.logo} className="w-[50px] h-[50px] mr-1" /> */}
        <div
          className={`py-2.5 px-1 xs:col-end-13 lg:col-start-1 lg:col-end-6`}
          key={claim}
        >
          <p
            id={`${convertToId(claim)}-value`}
            className="font-bold text-largeTextSize break-all"
          >
            {convertToTitleCase(claim)}
          </p>
          <div
            className={`rounded-xl w-[79px] bg-[#EFEFEF] border border-[#C4C4C4] mr-2 p-1`}
          >
            <p
              className={`font-normal text-smallTextSize text-center text-[#636363]`}
            >
              {t('Verify:notShared')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayUnVerifiedVc;
