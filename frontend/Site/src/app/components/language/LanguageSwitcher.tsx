import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./LanguageSwitcher.css";
import { TickIcon } from "../common/icon";

const LanguageSwitcher = () => {
  // Define available languages
  const LANGUAGE = [
    {
      key: "ar",
      value: "العربية (Arabic)",
    },
    {
      key: "zh-CN",
      value: "简体字 (Chinese - Simplified)",
    },
    {
      key: "en",
      value: "English",
    },
    {
      key: "es",
      value: "Español (Spanish)",
    },
    {
      key: "fr",
      value: "Français (French)",
    },
    {
      key: "it",
      value: "Italiano (Italian)",
    },
    {
      key: "ru",
      value: "Pусский (Russian)",
    },
  ];

  // Initialize current language state with English as default
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // const { i18n } = useTranslation();
  // const currentLanguage = i18n.language || 'en';

  // Function to handle language change
  const changeLanguage = (lng: string) => {
    setCurrentLanguage(lng);
    // i18n.changeLanguage(lng);
  };

  return (
    <>
      {/* Dropdown component for language selection */}
      <Dropdown aria-label="Language Selector">
        {/* Dropdown toggle button */}
        <Dropdown.Toggle
          id="language-dropdown"
          variant=""
          className="custom-toggle  p-sm-0 p-md-2"
          aria-label="Language Menu"
        >
          {/* Display current selected language */}
          {currentLanguage.toUpperCase()}
        </Dropdown.Toggle>

        {/* Dropdown menu */}
        <Dropdown.Menu
          className="custom-menu"
          role="menu"
          aria-labelledby="language-dropdown"
        >
          {/* Language options */}
          <div role="none">
            {/* Default option */}
            <Dropdown.Item
              className="custom-item-first-child"
              disabled
              role="menuitem"
              aria-disabled="true"
              tabIndex={-1} // Prevent tab focus on disabled items
            >
              <div className="custom-item-label pb-2">Please select a language:</div>
            </Dropdown.Item>
          </div>

          {/* Map through available languages */}
          {LANGUAGE &&
            LANGUAGE.map((lang) => (
              <Dropdown.Item
                onClick={() => changeLanguage(lang.key)}
                className="custom-item d-flex w-100 align-items-center"
                role="menuitem"
                aria-label={lang.value}
                aria-current={currentLanguage === lang.key ? "true" : undefined}
                tabIndex={0} // Allow keyboard focus
              >
                {/* Display language name */}
                <span>{lang.value}</span>

                {/* Display tick icon if current language is selected */}
                {currentLanguage === lang.key && (
                  <TickIcon className="tick-icon " />
                )}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default LanguageSwitcher;
