import React, { useState } from "react";
import { isRTL, LanguagesSupported, switchLanguage } from "../../utils/i18n";
import { storeLanguage } from "../../redux/features/common/commonSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { renderGradientText } from "../../utils/builder";
import { ArrowDown, ArrowUp, Check, GlobeIcon } from "../../utils/theme-utils";

interface DropdownItem {
  label: string;
  value: string;
}

export const LanguageSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  let language = useAppSelector((state: RootState) => state.common.language);
  language = language ?? window._env_.DEFAULT_LANG;
  const rtl = isRTL(language);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (item: DropdownItem) => {
    setIsOpen(false);
    switchLanguage(item.value);
    dispatch(storeLanguage({ language: item.value }));
  };

  return (
    <div
      className="flex flex-row justify-center items-center"
      data-testid="LanguageSelector-Outer-Div"
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
      role="button"
    >
      <GlobeIcon />

      <div className="relative inline-block ms-1">
        <button
          type="button"
          className="inline-flex items-center"
          data-testid="Language-Selector-Button"
          onMouseDown={() => setIsOpen(!isOpen)}
        >
          <p
            data-testid={`Language-Selector-Selected-DropDown-${language}`}
            className="text-md font-bold"
          >
            {LanguagesSupported.find((lang) => lang.value === language)?.label}
          </p>
          {isOpen ? (
            <div className="px-1">
              <ArrowUp />
            </div>
          ) : (
            <div className="px-1">
              <ArrowDown />
            </div>
          )}
        </button>

        {isOpen && (
          <div
            className={`absolute top-10 w-[167px] lg:w-60 z-40 ${
              rtl ? "left-1 lg:left-0" : "right-1 lg:right-0"
            } mt-3 rounded-md shadow-lg bg-background overflow-hidden font-normal border border-gray-200`}
          >
            <ul className="py-1 divide-y divide-gray-200">
              {LanguagesSupported.map((item) => (
                <li
                  key={item.value}
                  data-testid={`Language-Selector-DropDown-Item-${item.value}`}
                >
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between flex-row"
                    onMouseDown={(event) => {
                      event.stopPropagation();
                      handleChange(item);
                    }}
                  >
                    {language === item.value
                      ? renderGradientText(item.label)
                      : item.label}
                    {language === item.value && <Check />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};