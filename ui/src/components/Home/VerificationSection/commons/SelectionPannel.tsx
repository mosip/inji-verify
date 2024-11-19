import * as React from "react";
import { useState } from "react";
import { Button } from "./Button";
import { verifiableClaims } from "../../../../utils/config";
import { useAppDispatch } from "../../../../redux/hooks";

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
    <div className="relative bg-white max-w-[95vw] p-6 rounded-lg shadow-xl">
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
  const [claim, setClaims] = useState("");
  const claimOptions = verifiableClaims;
  const dispatch = useAppDispatch();
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClaim = event.target.value;
    setClaims(selectedClaim);
  };
  const HandelBack = () => {
    handleClose();
    setClaims("");
  };

  return open ? (
    <Modal>
      <Fade>
        <div className="fill-primary">
          <h1 className="font-bold">Credential Selection Pannel</h1>
          <p className="text-">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
          <ul className="w-[300px]">
            {claimOptions.map((option) => (
              <li
                key={option}
                value={option}
                className="flex justify-between"
              >
                <label className="text-normal text-sm" htmlFor={option}>
                  {option}
                </label>
                <input type="checkbox" name={option} id={option} />
              </li>
            ))}
          </ul>
          <div className="col-span-6 flex">
            <Button
              id="verification-back-button"
              className="w-[180px] mx-0 my-1.5 text-lgNormalTextSize inline-flex mr-2"
              onClick={HandelBack}
              title={"Go Back"}
            />
            <Button
              id="camer-access-denied-okay-button"
              title="Generate QR Code"
              onClick={handleClose}
              className="w-[180px] mx-0 my-1.5 text-lgNormalTextSize inline-flex mr-8"
              data-testid="camera-access-denied-okay"
            />
          </div>
        </div>
      </Fade>
    </Modal>
  ) : (
    <></>
  );
};

export default SelectionPannel;
