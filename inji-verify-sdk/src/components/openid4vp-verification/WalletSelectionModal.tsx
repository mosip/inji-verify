import React, { useState, useMemo, useRef, useEffect } from "react";
import { Wallet } from "./OpenID4VPVerification.types";
import { Button } from "../Button/Button";
import { FilterLinesIcon, SearchIcon, TickIcon } from "../../utils/themeUtils";

interface WalletSelectionModalProps {
  isOpen: boolean;
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  onSelect: (wallet: Wallet | null) => void;
  onCancel: () => void;
  onProceed: () => void;
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  isOpen,
  wallets,
  selectedWallet,
  onSelect,
  onCancel,
  onProceed,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div
        className="absolute inset-0 cursor-default"
        onClick={handleCancel}
        role="button"
        aria-label="Close modal"
        tabIndex={-1}
      />

      <div
        className={`absolute bottom-0 left-0 right-0 bg-white w-full max-w-4xl mx-auto rounded-xl shadow-lg p-6 z-50 transition-all duration-300 ${
          isExpanded ? "h-[95vh]" : "lg:bottom-40"
        }`}
        style={{ maxHeight: "95vh", overflowY: "auto" }}
      >
        {/* Handle */}
        <div
          className="w-12 h-1.5 bg-[#404653] rounded-full mx-auto mb-4 cursor-pointer"
          onClick={() => setIsExpanded((prev) => !prev)}
        />
        {/* Search & Sort */}
        <div className="lg:flex justify-between items-start mb-4 gap-4">
          <div className="flex lg:flex-row gap-4">
            <div className="relative w-full lg:w-[200px]">
              <input
                type="text"
                placeholder={"Search Wallets"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchIcon className="absolute left-3 top-3 text-gray-400 text-base" />
            </div>

            <div className="w-[150px] relative flex items-center rounded-lg p-2 cursor-pointer border border-sortByBorder">
              <FilterLinesIcon className="w-5 h-5" />
              <span
                className="text-sortByText font-semibold text-smallTextSize ml-2"
                onClick={() => setShowMenu(!showMenu)}
              >
                {"Sort By"}
              </span>
              {showMenu && (
                <div
                  className={`absolute top-8 z-40 flex flex-col right-px mt-3 rounded-md shadow-lg bg-background overflow-hidden font-normal border border-gray-200`}
                >
                  <button
                    onClick={() => {
                      setIsAscending(true);
                    }}
                    className={`min-w-[100px] h-[44px] w-full text-left px-2 py-2`}
                  >
                    <span
                      className={`flex justify-between px-2 py-2 rounded-md ${
                        isAscending
                          ? "bg-default_theme-gradient opacity-50"
                          : ""
                      }`}
                    >
                      <span className="text-verySmallTextSize text-[#0A0A0A]">
                        A - Z
                      </span>

                      {isAscending && <TickIcon />}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsAscending(false);
                    }}
                    className={`min-w-[100px] h-[44px] w-full text-left px-2 py-2`}
                  >
                    <span
                      className={`flex justify-between px-2 py-2 rounded-md ${
                        !isAscending
                          ? "bg-default_theme-gradient opacity-50"
                          : ""
                      }`}
                    >
                      <span className="text-verySmallTextSize text-[#0A0A0A]">
                        Z - A
                      </span>
                      {!isAscending && <TickIcon />}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* wallet list */}
        <div
          className={`transition-all duration-200 mb-4 min-h-[300px]`}
          style={{
            maxHeight: isExpanded ? "95vh" : undefined,
            overflowY: isExpanded ? "auto" : undefined,
          }}
        >
          <ul
            className={`grid gap-3 ${
              isExpanded ? "max-h-[600px]" : "max-h-[200px]"
            } overflow-y-auto custom-scrollbar pr-1`}
          >
            {filteredWallets.map((wallet, index) => {
              const isSelected = selectedWallet?.name === wallet.name;
              return (
                <li
                  key={index}
                  className={`relative rounded-lg cursor-pointer ${
                    isSelected
                      ? `p-px bg-default_theme-gradient bg-no-repeat rounded-[5px] bg-opacity-95`
                      : `border border-gray-300`
                  }`}
                  onClick={() => handleSelect(wallet)}
                >
                  <div
                    className={`flex items-center justify-between gap-3 p-3 rounded-lg bg-white shadow rounded-md ${
                      isSelected ? "bg-red-50 bg-opacity-95" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md bg-white">
                        <img
                          src={wallet.icon}
                          alt={wallet.name}
                          className="w-8 h-6 object-contain"
                        />
                      </div>
                      <span className="text-sm">{wallet.name}</span>
                    </div>
                    <div>
                      <span className="relative w-5 h-5 flex items-center justify-center">
                        <span
                          className={`absolute inset-0 rounded-full ${
                            isSelected
                              ? `bg-default_theme-gradient -[-1px]`
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
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse lg:flex-row lg:justify-end gap-2 items-center mt-4 absolute bottom-0 w-[90%] mb-4">
          <Button
            title={"Cancel"}
            onClick={handleCancel}
            className="w-full lg:w-[120px] text-smallTextSize lg:text-sm"
            variant="outline"
          />

          <Button
            title={"Proceed"}
            onClick={onProceed}
            disabled={!selectedWallet}
            className="w-full lg:w-[120px] text-smallTextSize lg:text-sm"
            variant="fill"
          />
        </div>
      </div>
    </div>
  );
};

export default WalletSelectionModal;
