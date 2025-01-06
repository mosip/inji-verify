import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { verifiableClaims } from "../../../../utils/config";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { FilterLinesIcon, SearchIcon } from "../../../../utils/theme-utils";
import {
  getVpRequest,
  resetVpRequest,
} from "../../../../redux/features/verify/vpVerificationState";
import { isRTL } from "../../../../utils/i18n";
import { RootState } from "../../../../redux/store";
import { useTranslation } from "react-i18next";
import { storage } from "../../../../utils/storage";
import { claims } from "../../../../types/data-types";

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
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="absolute inset-0 bg-black opacity-30"></div>
    <div className="relative bg-white max-w-[95vw] p-4 sm:p-6 rounded-lg shadow-xl max-h-[95vh]">
      {children}
    </div>
  </div>
);

const SelectionPannel = () => {
  const { t } = useTranslation("Verify");
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [selectedClaims, setSelectedClaims] = useState<claims[]>([]);
  const dispatch = useAppDispatch();
  let language = useAppSelector((state: RootState) => state.common.language);
  language = language ?? window._env_.DEFAULT_LANG;
  const rtl = isRTL(language);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

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
    setSelectedClaims((prev) =>
      prev.includes(claim)
        ? prev.filter((c) => c.name !== claim.name)
        : [...prev, claim]
    );
  };

  const HandelBack = () => {
    setSearch("");
    setSelectedClaims([]);
    dispatch(resetVpRequest());
  };

  const HandelGenerateQr = () => {
    setSearch("");
    setSelectedClaims([]);
    dispatch(getVpRequest({ selectedClaims }));
  };

  useEffect(() => {
    const essentialClaims = verifiableClaims.filter((claim) => claim.essential);
    setSelectedClaims(essentialClaims);
    essentialClaims.forEach((claim) =>
      storage.setItem(storage.ESSENTIAL_CLAIM, claim)
    );
  }, []);

  return (
    <Modal>
      <Fade>
        <div className="fill-primary grid gap-6">
          <div className="text-center sm:text-left">
            <h1 className="font-bold text-smallTextSize lg:text-lg sm:text-xl text-selectorPannelTitle">
              {t("selectorTitle")}
            </h1>
            <p className="text-smallTextSize lg:text-sm text-selectorPannelSubTitle">
              {t("selectorSubTitle")}
            </p>
          </div>

          <div className="lg:flex justify-between gap-4">
            <div className="lg:w-[483px] flex items-center border-[2px] border-searchBorder rounded-lg p-2">
              <SearchIcon />
              <input
                type="text"
                className="ml-2 outline-none w-full text-smallTextSize lg:text-sm"
                placeholder={t("searchPlaceholder")}
                onChange={handleSearchChange}
              />
            </div>
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="w-[106px] lg:h-[44px] relative flex items-center border rounded-lg p-2 cursor-pointer border-sortByBorder mt-1 lg:m-0"
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
            <h2 className="text-smallTextSize lg:text-sm font-bold text-gray-700 mb-2">{t("listHeader")}</h2>
            {filteredClaims.length > 0 ? (
              <ul className="grid gap-4 max-h-[100px] lg:max-h-[250px] overflow-y-auto custom-scrollbar pr-4">
                {filteredClaims.map((claim, index) => {
                  const isSelectedClaim = selectedClaims.includes(claim);
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
                          <span className="truncate text-smallTextSize lg:text-sm">{claim.name}</span>
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
                            checked={selectedClaims.includes(claim)}
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
      </Fade>
    </Modal>
  );
};

export default SelectionPannel;
