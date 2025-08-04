import "./WalletSelectionModal.css";
import React, { useState, useMemo } from "react";
import { Wallet } from "../openid4vp-verification/OpenID4VPVerification.types";
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
    return filtered.sort((a, b) =>
      isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [wallets, searchTerm, isAscending]);

  const handleSelect = (wallet: Wallet) => {
    onSelect(selectedWallet?.name === wallet.name ? null : wallet);
  };

  if (!isOpen) return null;

  return (
    <div className={"modalOverlay"}>
      <div
        className={"modalBackdrop"}
        onClick={handleCancel}
        role="button"
        aria-label="Close modal"
        tabIndex={-1}
      />

      <div className={`${"modalContent"} ${isExpanded ? "expanded" : ""}`}>
        <div
          className={"handle"}
          onClick={() => setIsExpanded((prev) => !prev)}
        />

        <div className={"headerSection"}>
          <div className={"searchSortContainer"}>
            <div className={"searchWrapper"}>
              <input
                type="text"
                placeholder="Search Wallets"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={"searchInput"}
              />
              <SearchIcon className={"searchIcon"} />
            </div>

            <div className={"sortWrapper"}>
              <FilterLinesIcon className={"sortIcon"} />
              <span
                className={"sortText"}
                onClick={() => setShowMenu(!showMenu)}
              >
                Sort By
              </span>
              {showMenu && (
                <div className={"dropdownMenu"}>
                  <button
                    onClick={() => setIsAscending(true)}
                    className={"dropdownItem"}
                  >
                    <span
                      className={`dropdownContent ${
                        isAscending ? "selected" : ""
                      }`}
                    >
                      <span className="dropdownContentText">A - Z</span>
                      {isAscending && <TickIcon />}
                    </span>
                  </button>
                  <button
                    onClick={() => setIsAscending(false)}
                    className={"dropdownItem"}
                  >
                    <span
                      className={`${"dropdownContent"} ${
                        !isAscending ? "selected" : ""
                      }`}
                    >
                      <span className="dropdownContentText">Z - A</span>
                      {!isAscending && <TickIcon />}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={"walletListWrapper"}>
          <ul className={`walletList ${isExpanded ? "scrollable" : ""}`}>
            {filteredWallets.map((wallet, index) => {
              const isSelected = selectedWallet?.name === wallet.name;
              return (
                <li
                  key={index}
                  className={`${"walletItem"} ${
                    isSelected ? "walletSelectedBorder" : "walletBorder"
                  }`}
                  onClick={() => handleSelect(wallet)}
                >
                  <div
                    className={`${"walletCard"} ${
                      isSelected ? "walletSelectedBg" : ""
                    }`}
                  >
                    <div className={"walletInfo"}>
                      <div className={"walletIconWrapper"}>
                        <img
                          src={wallet.icon}
                          alt={wallet.name}
                          className={"walletIcon"}
                        />
                      </div>
                      <span className={"walletName"}>{wallet.name}</span>
                    </div>
                    <div className={"radioWrapper"}>
                      <span
                        className={`${"radioCircle"} ${
                          isSelected ? "radioSelected" : "radioUnselected"
                        }`}
                      />
                      {isSelected && <span className={"radioInner"} />}
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => handleSelect(wallet)}
                        className={"radioInput"}
                        tabIndex={-1}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={"actionButtons"}>
          <button
            onClick={onProceed}
            disabled={!selectedWallet}
            className={"proceedButton"}
          >
            Proceed
          </button>

          <div className="gradient-border-wrapper">
            <button onClick={handleCancel} className={"cancelButton"}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSelectionModal;
