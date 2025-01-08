import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { claims } from "../../../../types/data-types";
import { RootState } from "../../../../redux/store";
import { useTranslation } from "react-i18next";
import { isRTL } from "../../../../utils/i18n";
import { verifiableClaims } from "../../../../utils/config";
import {
  getVpRequest,
  resetVpRequest,
  setSelectedClaims,
} from "../../../../redux/features/verify/vpVerificationState";
import { storage } from "../../../../utils/storage";
import { Button } from "./Button";
import { FilterLinesIcon, SearchIcon } from "../../../../utils/theme-utils";
import { useVerifyFlowSelector } from "../../../../redux/features/verification/verification.selector";

function SelectionPanelContent() {
  const { t } = useTranslation("Verify");
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const dispatch = useAppDispatch();
  let language = useAppSelector((state: RootState) => state.common.language);
  language = language ?? window._env_.DEFAULT_LANG;
  const rtl = isRTL(language);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const selectedClaims = useVerifyFlowSelector((state) => state.selectedClaims)||[];

  const filteredClaims = verifiableClaims
    .filter((claim) => claim.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.essential && !b.essential) return -1;
      if (!a.essential && b.essential) return 1;
      return isAscending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

  const toggleClaimSelection = (claim: claims) => {
    if (selectedClaims.includes(claim)) {
      dispatch(
        setSelectedClaims(
         { selectedClaims: selectedClaims.filter((c: claims) => claim.name !== c.name)}
        )
      );
    } else {
      dispatch(setSelectedClaims({selectedClaims : [...selectedClaims, claim]}));
    }
  };

  const HandelBack = () => {
    setSearch("");
    dispatch(resetVpRequest());
  };

  const HandelGenerateQr = () => {
    setSearch("");
    dispatch(getVpRequest({ selectedClaims }));
  };

  useEffect(() => {
    const essentialClaims = selectedClaims;
    essentialClaims.forEach((claim: claims) =>
      storage.setItem(storage.ESSENTIAL_CLAIM, claim)
    );
  }, []);
  return (
    <div className="fill-primary grid gap-6 p-3 lg:p-0">
      <div className="hidden lg:block text-center sm:text-left">
        <h1 className="font-bold text-smallTextSize lg:text-lg sm:text-xl text-selectorPanelTitle">
          {t("selectorTitle")}
        </h1>
        <p className="text-smallTextSize lg:text-sm text-selectorPanelSubTitle">
          {t("selectorSubTitle")}
        </p>
      </div>

      <div className="flex justify-around gap-1 lg:gap-4">
        <div className="w-[200px] lg:w-[483px] h-[44px] flex items-center border-[2px] border-searchBorder rounded-lg p-2">
          <SearchIcon />
          <input
            type="text"
            className="ml-2 outline-none w-full text-smallTextSize lg:text-sm placeholder:text-[8px] lg:placeholder:text-sm"
            placeholder={t("searchPlaceholder")}
            onChange={handleSearchChange}
          />
        </div>
        <div
          onClick={() => setShowMenu(!showMenu)}
          className="lg:w-[106px] h-[44px] relative flex items-center rounded-lg p-2 cursor-pointer border border-sortByBorder"
        >
          <FilterLinesIcon />
          <span className="text-sortByText font-semibold text-smallTextSize ml-2">
            {t("sortBy")}
          </span>
          {showMenu && (
            <div
              className={`absolute top-8 z-40 flex flex-col ${
                rtl ? "left-1 lg:left-0" : "right-px"
              } mt-3 rounded-md shadow-lg bg-background overflow-hidden font-normal border border-gray-200`}
            >
              <button
                onClick={() => setIsAscending(true)}
                className="w-[106px] h-[44px] text-sortByText w-full text-left text-verySmallTextSize px-4 py-2 hover:bg-gray-100"
              >
                {t("sortAtoZ")}
              </button>
              <div className="w-full border-t-[2px] border-sortByBorder" />
              <button
                onClick={() => setIsAscending(false)}
                className="w-[106px] h-[44px] text-sortByText w-full text-left text-verySmallTextSize px-4 py-2 hover:bg-gray-100"
              >
                {t("sortZtoA")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-smallTextSize lg:text-sm font-bold text-gray-700 mb-2">
          {t("listHeader")}
        </h2>
        {filteredClaims.length > 0 ? (
          <ul className="grid gap-4 max-h-[100px] lg:max-h-[250px] overflow-y-auto custom-scrollbar pr-4">
            {filteredClaims.map((claim, index) => {
              const isSelectedClaim = selectedClaims.includes(claim)
              return (
                <li
                  key={index}
                  className={`grid mb-2 ${
                    isSelectedClaim
                      ? `bg-${window._env_.DEFAULT_THEME}-gradient bg-no-repeat rounded-[5px] p-px bg-opacity-95`
                      : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-between w-full p-2 lg:p-4 shadow rounded-md ${
                      isSelectedClaim ? `bg-red-50 bg-opacity-95` : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={claim.logo}
                        alt={claim.type}
                        className="w-10 h-10 rounded"
                      />
                      <span className="truncate text-smallTextSize lg:text-sm">
                        {claim.name}
                      </span>
                    </div>
                    <label
                      htmlFor={claim.name}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={claim.name}
                        name="claims"
                        className="hidden peer"
                        checked={isSelectedClaim}
                        onChange={() => toggleClaimSelection(claim)}
                      />
                      <div
                        className={`w-5 h-5 ${
                          isSelectedClaim
                            ? ` bg-${window._env_.DEFAULT_THEME}-gradient`
                            : "border-2 border-gray-300 bg-white"
                        } rounded-sm flex items-center justify-center p-px`}
                      >
                        <span
                          className={`${
                            isSelectedClaim ? "block" : "hidden"
                          } text-white font-bold`}
                        >
                          ✓
                        </span>
                      </div>
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-gray-500 text-sm text-center py-4">
            {t("noVcsFound")}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:flex lg:justify-end gap-2">
        <Button
          id="verification-back-button"
          className="w-full lg:w-[147px] text-smallTextSize lg:text-sm"
          onClick={HandelBack}
          title={t("goBack")}
        />
        <Button
          id="camera-access-denied-okay-button"
          title={t("generateQrCodeBtn")}
          onClick={HandelGenerateQr}
          className="w-full lg:w-[147px] text-smallTextSize lg:text-sm"
          disabled={selectedClaims.length <= 0}
          fill
        />
      </div>
    </div>
  );
}

export default SelectionPanelContent;
