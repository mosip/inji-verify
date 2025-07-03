import React from "react";
import { Wallet } from "./SameDeviceVPFlowProps.types";
import { Button } from "../Home/VerificationSection/commons/Button";

interface WalletSelectionModalProps {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  onSelect: (wallet: Wallet | null) => void;
  onCancel: () => void;
  onProceed: () => void;
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  wallets,
  selectedWallet,
  onSelect,
  onCancel,
  onProceed,
}) => {
  const handleCancel = () => {
    onCancel();
    onSelect(null);
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 fill-primary grid gap-6 p-3 lg:p-0 rounded h-[500px]">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-1">Wallet Selection Panel</h2>
        <p className="text-gray-500 mb-6">
          Lorem ipsum dolor sit amet consectetur. Aliquam nisl dignissim
          placerat.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => onSelect(wallet)}
              className={`border p-4 rounded-md flex items-start gap-4 text-left transition hover:shadow-md ${
                selectedWallet?.name === wallet.name
                  ? "border-blue-600"
                  : "border-gray-200"
              }`}
            >
              {wallet.icon && <wallet.icon className="w-10 h-10" />}
              <div>
                <h3 className="text-lg font-medium mb-1">{wallet.name}</h3>
                <p className="text-sm text-gray-600 leading-tight">
                  {wallet.description ||
                    "Lorem ipsum dolor sit amet consectetur. Aliquam nisl dignissim placerat."}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            title={"Cancel"}
            onClick={handleCancel}
            className="w-[120px] text-smallTextSize lg:text-sm"
          />

          <Button
            title={"Proceed"}
            onClick={onProceed}
            disabled={!selectedWallet}
            className="w-[120px] text-smallTextSize lg:text-sm"
            fill
          />
        </div>
      </div>
    </div>
  );
};

export default WalletSelectionModal;
