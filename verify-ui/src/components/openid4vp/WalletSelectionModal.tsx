import React, { useState, useMemo } from "react";
import { Wallet } from "./SameDeviceVPFlowProps.types";
import { Button } from "../Home/VerificationSection/commons/Button";
import { SearchOutlined } from "@ant-design/icons";

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

  const handleCancel = () => {
    onCancel();
    onSelect(null);
  };

  const filteredWallets = useMemo(() => {
    return wallets.filter((wallet) =>
      wallet.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [wallets, searchTerm]);

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
        <div className="lg:flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              Wallet Selection Panel
            </h2>
            <p className="text-gray-500 mb-4">
              Please select a wallet to proceed with Verifiable Presentation.
            </p>
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchOutlined className="absolute left-3 top-3 text-gray-400 text-base" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="loader border-4 border-t-4 border-blue-600 border-t-transparent rounded-full w-12 h-12 animate-spin" />
          </div>
        ) : (
          <ul className="grid gap-4 max-h-[120px] lg:max-h-[250px] pr-4">
            {filteredWallets.map((wallet, index) => (
              <li
                key={index}
                className={`grid mb-2 p-px ${
                  selectedWallet?.name === wallet.name
                    ? `bg-${window._env_.DEFAULT_THEME}-gradient bg-no-repeat rounded-[5px] bg-opacity-95`
                    : ""
                }`}
                onClick={() => handleSelect(wallet)}
              >
                <div
                  className={`flex items-center justify-between w-full p-2 lg:p-4 shadow rounded-md ${
                    selectedWallet?.name === wallet.name
                      ? `bg-white bg-opacity-95`
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-white border-2 border-[#D8D8D8] rounded-md">
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className="w-8 h-6 rounded"
                      />
                    </div>

                    <span className="text-smallTextSize lg:text-sm">
                      {wallet.name}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col-reverse lg:flex-row lg:justify-end gap-4 items-center">
          <Button
            title={"Cancel"}
            onClick={handleCancel}
            className="w-full lg:w-[120px] text-smallTextSize lg:text-sm"
          />

          <Button
            title={"Proceed"}
            onClick={onProceed}
            disabled={proceedDisabled || !selectedWallet}
            className="w-full lg:w-[120px] text-smallTextSize lg:text-sm"
            fill
          />
        </div>
      </div>
    </div>
  );
};

export default WalletSelectionModal;
