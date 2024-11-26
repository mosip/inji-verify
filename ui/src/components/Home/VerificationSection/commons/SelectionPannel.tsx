import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { verifiableClaims } from "../../../../utils/config";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { FilterLinesIcon, SearchIcon } from "../../../../utils/theme-utils";
import {
  getVpRequest,
  resetVpRequest,
} from "../../../../redux/features/verify/verifyState";
import { isRTL } from "../../../../utils/i18n";
import { RootState } from "../../../../redux/store";
import { useTranslation } from "react-i18next";

const Modal = ({ children }: any) => (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white max-w-[95vw] p-6 rounded-lg shadow-xl">
        {children}
      </div>
    </div>
  </div>
);

const Fade = ({ children }: any) => (
  <div
    x-show="isOpen"
    className="fixed inset-0 flex items-center justify-center"
  >
    <div className="fixed inset-0 transition-opacity">
      <div className="absolute inset-0 bg-black opacity-30"></div>
    </div>
    <div className="relative bg-white max-w-[95vw] p-6 rounded-lg shadow-xl min-h-[90vh]">
      {children}
    </div>
  </div>
);

const SelectionPannel = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation("Verify");
  const [search, setSearch] = useState("");
  const [showMenu, setshowMenu] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  let language = useAppSelector((state: RootState) => state.common.language);
  language = language ?? window._env_.DEFAULT_LANG;
  const rtl = isRTL(language);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredClaims = verifiableClaims
    .filter((claim) => claim.type.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      // Prioritize essential claims
      if (a.essential && !b.essential) return -1;
      if (!a.essential && b.essential) return 1;
      // Sort alphabetically by 'type'
      return isAscending
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    });

  const toggleClaimSelection = (type: string) => {
    setSelectedClaims([type]);
  };

  const HandelBack = () => {
    handleClose();
    setSearch("");
    setSelectedClaims([]);
    dispatch(resetVpRequest());
  };

  const HandelGenerateQr = () => {
    handleClose();
    setSearch("");
    setSelectedClaims([]);
    dispatch(getVpRequest({ selectedClaims }));
  };

  useEffect(() => {
    const essentialClaims = verifiableClaims
      .filter((claim) => claim.essential)
      .map((claim) => claim.type);
    setSelectedClaims([essentialClaims[0]]);
  }, []);

  return (
    <Modal>
      <Fade>
        <div className="fill-primary">
          <h1 className="font-bold text-lg sm:text-xl text-center sm:text-left text-selectorPannelTitle">
            {t("selectorTitle")}
          </h1>
          <p className="text-sm sm:text-base text-center sm:text-left text-selectorPannelSubTitle">
            {t("selectorSubTitle")}
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-center border-t-[1px] border-b-[1px] border-selectorBorder my-2 p-2">
            <div className="flex items-center border-[2px] border-searchBorder rounded-lg p-2 my-4 w-full sm:w-3/4">
              <SearchIcon />
              <input
                type="text"
                className="ml-3 outline-none w-full"
                placeholder={t("searchPlaceholder")}
                id="searchInput"
                onChange={handleSearchChange}
              />
            </div>
            <div
              onClick={() => setshowMenu(!showMenu)}
              className="flex items-center w-[106px] p-2 border-[2px] border-sortByBorder rounded-md"
            >
              <FilterLinesIcon />
              <span className="text-sortByText text-sm ml-2">Sort By</span>
              {showMenu && (
                <div
                  className={`absolute w-[106px] z-40 flex flex-col ${
                    rtl ? "left-1 lg:left-0" : "lg:top-[150px] lg:right-[30px]"
                  } mt-3 rounded-md shadow-lg bg-background overflow-hidden font-normal border border-gray-200`}
                >
                  <button
                    onClick={() => setIsAscending(true)}
                    className="text-sortByText text-sm pt-1 pb-1 space-x-1"
                  >
                    {t("sortAtoZ")}
                  </button>
                  <div className="w-full border-t-[2px] border-sortByBorder" />
                  <button
                    onClick={() => setIsAscending(false)}
                    className="text-sortByText text-sm pt-1 pb-1 space-x-1"
                  >
                    {t("sortZtoA")}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="border-b-[1px] border-selectorBorder pb-3">
            <h1 className="font-bold text-base sm:text-lg">
              {t("listHeader")}
            </h1>
            {filteredClaims.length > 0 ? (
              <ul className="w-full min-h-[300px] max-h-[300px] overflow-y-auto">
                {filteredClaims.map((claim, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-white shadow mt-5 w-full"
                  >
                    <div className="flex items-center">
                      <img
                        src={claim.logo}
                        alt={claim.type}
                        width="40"
                        height="40"
                        className="rounded"
                      />
                      <label
                        htmlFor={claim.type}
                        className="text-sm ml-3 truncate"
                      >
                        {claim.type}
                      </label>
                    </div>
                    <label
                      htmlFor={claim.type}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        id={claim.type}
                        name="claims"
                        className="hidden peer"
                        checked={selectedClaims.includes(claim.type)}
                        onChange={() => toggleClaimSelection(claim.type)}
                      />
                      <div className="w-3 h-3 rounded-full bg-gradient peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-[#52AE32]"></div>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm mt-4 min-h-[284px] flex items-center justify-center">
                No Claims found.
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end mt-2 gap-2">
            <Button
              id="verification-back-button"
              className="w-full sm:w-[180px] text-lgNormalTextSize inline-flex sm:mr-2"
              onClick={HandelBack}
              title={t("goBack")}
            />
            <Button
              id="camera-access-denied-okay-button"
              title={t("generateQrCodeBtn")}
              onClick={HandelGenerateQr}
              className="w-full sm:w-[180px] text-lgNormalTextSize inline-flex"
              data-testid="camera-access-denied-okay"
              disabled={selectedClaims.length <= 0}
              fill
            />
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default SelectionPannel;
