import * as React from "react";
import { useState } from "react";
import { Button } from "./Button";
import { verifiableClaims } from "../../../../utils/config";
import { useAppDispatch } from "../../../../redux/hooks";
import { SearchIcon } from "../../../../utils/theme-utils";
import { getRequestUri } from "../../../../redux/features/verify/verifyState";

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

const SelectionPannel = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [search, setSearch] = useState("");
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredClaims = verifiableClaims.filter((claim) =>
    claim.type.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedClaims(filteredClaims.map((claim) => claim.type));
    } else {
      setSelectedClaims([]);
    }
  };

  const toggleClaimSelection = (type: string) => {
    setSelectedClaims((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const HandelBack = () => {
    handleClose();
    setSearch("");
    setSelectedClaims([]);
  };

  const HandelGenerateQr = () => {
    handleClose();
    setSearch("");
    setSelectedClaims([]);
    dispatch(getRequestUri());
  };

  return open ? (
    <Modal>
      <Fade>
        <div className="fill-primary">
          <h1 className="font-bold text-lg sm:text-xl text-center sm:text-left">
            Credential Selection Panel
          </h1>
          <p className="text-sm sm:text-base text-center sm:text-left">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-center border-t-[1px] border-b-[1px] border-selectorBorder my-2 p-2">
            <div className="flex items-center border-[2px] border-searchBorder rounded-lg p-2 my-4 w-full sm:w-3/4">
              <SearchIcon />
              <input
                type="text"
                className="ml-3 outline-none w-full"
                placeholder="Find..."
                id="searchInput"
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <label htmlFor="SelectAll" className="text-searchAllText text-sm">
                Select all
              </label>
              <input
                type="checkbox"
                className="ml-3 checkbox"
                id="SelectAll"
                onChange={(e) => toggleSelectAll(e.target.checked)}
                checked={selectedClaims.length === filteredClaims.length}
              />
            </div>
          </div>
          <div className="border-b-[1px] border-selectorBorder pb-3">
            <h1 className="font-bold text-base sm:text-lg">
              Select the credentials you need
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
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={claim.type}
                      checked={selectedClaims.includes(claim.type)}
                      onChange={() => toggleClaimSelection(claim.type)}
                    />
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
              title={"Go Back"}
            />
            <Button
              id="camera-access-denied-okay-button"
              title="Generate QR Code"
              onClick={HandelGenerateQr}
              className="w-full sm:w-[180px] text-lgNormalTextSize inline-flex"
              data-testid="camera-access-denied-okay"
              disabled={selectedClaims.length <= 0}
            />
          </div>
        </div>
      </Fade>
    </Modal>
  ) : null;
};

export default SelectionPannel;
