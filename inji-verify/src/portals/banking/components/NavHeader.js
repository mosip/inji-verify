import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function NavHeader(props) {
  const { i18n, t } = useTranslation("navheader");

  const [selectedLang, setSelectedLang] = useState();
  const [collapsibleBtn, setCollapsibleBtn] = useState(false);
  // fallback language from the environment configuration
  const fallbackLangObj = window._env_.FALLBACK_LANG
    ? decodeURIComponent(window._env_.FALLBACK_LANG)
    : "";

  const fallbackLang =
    fallbackLangObj !== ""
      ? JSON.parse(fallbackLangObj)
      : { label: "English", value: "en" };

  const changeLanguageHandler = (e) => {
    i18n.changeLanguage(e.value);
  };

  // check language in the langOptions,
  // which came through langCnfigService
  // then setting that language as selected one
  const setLanguage = (lng) => {
    let lang = props.langOptions.find((op) => op.value === lng);
    setSelectedLang(lang ?? fallbackLang);
  };

  useEffect(() => {
    if (!props.langOptions || props.langOptions.length === 0) {
      return;
    }

    setLanguage(i18n.language);
    //Gets fired when changeLanguage got called.
    i18n.on("languageChanged", function (lng) {
      setLanguage(lng);
    });
  }, [props.langOptions]);

  var dropdownItemClass =
    "group text-[14px] leading-none flex items-center relative select-none outline-none data-[disabled]:pointer-events-none hover:font-bold cursor-pointer py-2";

  var borderBottomClass = "border-b-[1px]";

  const handleHamburger = () => {
    setCollapsibleBtn(!collapsibleBtn);
  };

  return (
    <nav className="md:px-[3rem] py-2 pl-4 pr-2">
      <div className="flex justify-between">
        <div className="flex">
          {window.screen.availWidth < 768 && (
            <img
              src="assets/images/hamburger.svg"
              className="m-0 my-2 w-5 sm:w-7 mr-2 sm:mr-4 hover:cursor-pointer relative top-[1px]"
              alt="hamburger"
              onClick={handleHamburger}
            />
          )}
          <img
            src="assets/images/logo.svg"
            className="m-auto lg:m-0 my-2 w-40 sm:w-72"
            alt="logo"
          />
        </div>
        <div className="flex">
          {window.screen.availWidth >= 768 && (
            <div className="flex">
              {props.navLinks.map((item) => {
                return (
                  <a
                    className="lg:px-[1.75rem] p-4 font-bold self-center m-auto lg:m-0"
                    href="/"
                  >
                    {t(`${item}`)}
                  </a>
                );
              })}
            </div>
          )}
          <div className="lg:pl-4 py-4 self-center font-bold m-auto lg:m-0 flex">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <span
                  className="inline-flex items-center justify-center bg-white outline-none hover:cursor-pointer"
                  aria-label="Customise options"
                  id="language_selection"
                >
                  <img
                    src="assets/images/globe.svg"
                    alt="globe"
                    className="mx-1 relative bottom-[0.5px]"
                  />
                  <span className="">{selectedLang?.label}</span>
                  <img
                    src="assets/images/chevron_down.svg"
                    alt="chevron down"
                    className="mx-1 relative top-[1px]"
                  />
                </span>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white rounded-md shadow-md will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade px-3 py-2 border border-[#BCBCBC] outline-0 relative top-[-0.5rem]"
                  sideOffset={5}
                >
                  {props.langOptions.map((key, idx) => (
                    <DropdownMenu.Item
                      id={key.value + idx}
                      key={key.value}
                      className={
                        i18n.language === key.value
                          ? props.langOptions.length - 1 !== idx
                            ? `font-bold ${dropdownItemClass} ${borderBottomClass}`
                            : `font-bold ${dropdownItemClass}`
                          : props.langOptions.length - 1 !== idx
                          ? `${dropdownItemClass} ${borderBottomClass}`
                          : `${dropdownItemClass}`
                      }
                      onSelect={() => changeLanguageHandler(key)}
                    >
                      {key.label}
                      <div className="ml-auto">
                        {i18n.language === key.value && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6006A8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check relative top-[1px] checkIcon"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                    </DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Arrow asChild>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 30 10"
                      stroke="#BCBCBC"
                      height={7}
                    >
                      <polygon points="0,0 30,0 15,10" fill="#fff" />
                      <line
                        x1="1"
                        y1="0"
                        x2="29"
                        y2="0"
                        stroke="#fff"
                        stroke-width="1"
                      />
                    </svg>
                  </DropdownMenu.Arrow>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>

      {collapsibleBtn && (
        <div className="block">
          {props.navLinks.map((item) => {
            return (
              <a className="font-bold block my-4" href="">
                {t(`${item}`)}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}
