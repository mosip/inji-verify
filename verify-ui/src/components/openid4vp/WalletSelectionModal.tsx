import React, { useState, useMemo } from "react";
import { Wallet } from "./SameDeviceVPFlowProps.types";
import { Button } from "../Home/VerificationSection/commons/Button";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { FilterLinesIcon } from "../../utils/theme-utils";
import { isRTL } from "../../utils/i18n";
import { useAppSelector } from "../../redux/hooks";

interface WalletSelectionModalProps {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  onSelect: (wallet: Wallet | null) => void;
  onCancel: () => void;
  onProceed: () => void;
  proceedDisabled?: boolean;
  loading?: boolean;
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  wallets,
  selectedWallet,
  onSelect,
  onCancel,
  onProceed,
  proceedDisabled = false,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const { t } = useTranslation("Verify");
  let language = useAppSelector((state) => state.common.language);
  language = language ?? window._env_.DEFAULT_LANG;
  const rtl = isRTL(language);

  const handleCancel = () => {
    onCancel();
    onSelect(null);
  };

  const filteredWallets = useMemo(() => {
    const filtered = wallets.filter((wallet) =>
      wallet.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      return isAscending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  }, [wallets, searchTerm, isAscending]);

  const handleSelect = (wallet: Wallet) => {
    if (selectedWallet?.name === wallet.name) {
      onSelect(null);
    } else {
      onSelect(wallet);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div
        className="absolute inset-0 cursor-default"
        onClick={handleCancel}
        role="button"
        aria-label="Close modal"
        tabIndex={-1}
      />
      <div className="absolute bottom-0 left-0 right-0 lg:bottom-40 bg-white w-full max-w-4xl mx-auto rounded-xl shadow-lg p-6 z-50">
        <div className="lg:flex justify-between items-start mb-4 gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">
              {t("walletSelectorTitle")}
            </h2>
            <p className="text-gray-500 mb-4">
              {t("walletSelectorDescription")}
            </p>
          </div>

          <div className="flex lg:flex-row gap-4">
            <div className="relative w-full lg:w-[200px]">
              <input
                type="text"
                placeholder={t("walletSearchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchOutlined className="absolute left-3 top-3 text-gray-400 text-base" />
            </div>

            <div
              onClick={() => setShowMenu(!showMenu)}
              className="w-[150px] relative flex items-center rounded-lg p-2 cursor-pointer border border-sortByBorder"
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
                    onClick={() => {
                      setIsAscending(true);
                      setShowMenu(false);
                    }}
                    className="w-[106px] h-[44px] text-sortByText w-full text-left text-verySmallTextSize px-4 py-2 hover:bg-gray-100"
                  >
                    {t("sortAtoZ")}
                  </button>
                  <div className="w-full border-t-[2px] border-sortByBorder" />
                  <button
                    onClick={() => {
                      setIsAscending(false);
                      setShowMenu(false);
                    }}
                    className="w-[106px] h-[44px] text-sortByText w-full text-left text-verySmallTextSize px-4 py-2 hover:bg-gray-100"
                  >
                    {t("sortZtoA")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="loader border-4 border-t-4 border-blue-600 border-t-transparent rounded-full w-12 h-12 animate-spin" />
          </div>
        ) : (
          <ul className="grid gap-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
            {filteredWallets.map((wallet, index) => {
              const isSelected = selectedWallet?.name === wallet.name;

              return (
                <li
                  key={index}
                  className={`relative rounded-lg cursor-pointer ${
                    isSelected
                      ? `p-px bg-${window._env_.DEFAULT_THEME}-gradient bg-no-repeat rounded-[5px] bg-opacity-95`
                      : `border border-gray-300`
                  }`}
                  onClick={() => handleSelect(wallet)}
                >
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg bg-white shadow rounded-md ${
                      isSelected ? "bg-red-50 bg-opacity-95" : ""
                    }`}
                  >
                    <span className="relative w-5 h-5 flex items-center justify-center">
                      <span
                        className={`absolute inset-0 rounded-full ${
                          isSelected
                            ? `bg-${window._env_.DEFAULT_THEME}-gradient -[-1px]`
                            : "border-2 border-gray-400 bg-white"
                        }`}
                      />
                      {isSelected && (
                        <span className="w-3 h-3 rounded-full bg-white z-10" />
                      )}
                    </span>

                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => handleSelect(wallet)}
                      className="absolute opacity-0 w-0 h-0"
                      tabIndex={-1}
                    />
                    <div className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md bg-white">
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className="w-8 h-6 object-contain"
                      />
                    </div>
                    <span className="text-sm">{wallet.name}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex flex-col-reverse lg:flex-row lg:justify-end gap-2 items-center mt-4">
          <Button
            title={t("Common:Button.cancel")}
            onClick={handleCancel}
            className="w-full lg:w-[120px] text-smallTextSize lg:text-sm"
            variant="outline"
          />

          <Button
            title={t("Common:Button.proceed")}
            onClick={onProceed}
            disabled={proceedDisabled || !selectedWallet}
            className="w-full lg:w-[120px] text-smallTextSize lg:text-sm"
            variant="fill"
          />
        </div>
      </div>
    </div>
  );
};

export default WalletSelectionModal;
