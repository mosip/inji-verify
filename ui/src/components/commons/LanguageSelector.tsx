import React, { useState } from "react";
import { VscGlobe } from "react-icons/vsc";
import { LanguagesSupported, switchLanguage } from "../../utils/i18n";
import { FaCheck } from "react-icons/fa6";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { storage } from "../../utils/storage";
import { storeLanguage } from "../../redux/features/common/commonSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

interface Language {
  label: string;
  value: string;
}

interface DropdownItem {
  label: string;
  value: string;
}

interface LanguageDropdownItemProps {
  item: Language;
  isSelected: boolean;
  onChange: (item: DropdownItem) => void;
}

const LanguageDropdownItem: React.FC<LanguageDropdownItemProps> = ({
  item,
  isSelected,
  onChange,
}) => {
  return (
    <li
      data-testid={`Language-Selector-DropDown-Item-${item.value}`}
      className={isSelected ? "text-[var(--iv-primary-color)]" : ""}
    >
      <button
        type="button"
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between flex-row"
        onMouseDown={() => onChange(item)}
      >
        {item.label}
        {isSelected && <FaCheck color={"var(--iw-color-languageCheckIcon)"} />}
      </button>
    </li>
  );
};

export const LanguageSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  let language = useAppSelector((state: RootState) => state.common.language);
  language = language ?? window._env_.DEFAULT_LANG;
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (item: DropdownItem) => {
    setIsOpen(false);
    switchLanguage(item.value);
    dispatch(storeLanguage(item.value));
    storage.setItem(storage.SELECTED_LANGUAGE, item.value);
  };

  return (
    <div
      className="flex flex-row lg:justify-center lg:items-center"
      data-testid="LanguageSelector-Outer-Div"
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-expanded={isOpen}
    >
      <VscGlobe
        data-testid="Language-Selector-Icon"
        size={30}
        color="white"
        className="bg-gradient rounded-full"
      />
      <div className="relative inline-block ms-1">
        <button
          type="button"
          className="inline-flex items-center"
          data-testid="Language-Selector-Button"
          onClick={() => setIsOpen((open) => !open)}
        >
          <p data-testid={`Language-Selector-Selected-DropDown-${language}`}>
            {LanguagesSupported.find((lang) => lang.value === language)?.label}
          </p>
          {isOpen ? (
            <RiArrowUpSFill
              size={20}
              color={"var(--iw-color-languageArrowIcon)"}
            />
          ) : (
            <RiArrowDownSFill
              size={20}
              color={"var(--iw-color-languageArrowIcon)"}
            />
          )}
        </button>
        {isOpen && (
          <div className="z-50 absolute right-[-50px] lg:right-0 bg-gradient w-40  mt-3 rounded-md shadow-lg overflow-hidden font-normal border">
            <ul className="py-1 divide-y divide-gray-200">
              {LanguagesSupported.map((item) => (
                <LanguageDropdownItem
                  key={item.value}
                  item={item}
                  isSelected={language === item.value}
                  onChange={handleChange}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
