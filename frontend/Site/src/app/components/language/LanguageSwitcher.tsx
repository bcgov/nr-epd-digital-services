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
      <Dropdown className="justify-content-end " aria-label="Language Selector">
        {/* Dropdown toggle button */}
        <Dropdown.Toggle
          id="language-dropdown"
          variant=""
          className="custom-toggle"
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
            >
              <div className="custom-item-label">Please select a language:</div>
            </Dropdown.Item>
          </div>

          {/* Map through available languages */}
          {LANGUAGE &&
            LANGUAGE.map((lang) => (
              <Dropdown.Item
                onClick={() => changeLanguage(lang.key)}
                className="custom-item"
                role="menuitem"
                aria-label={lang.value}
                aria-current={currentLanguage === lang.key ? "true" : undefined}
              >
                {/* Display language name */}
                <span>{lang.value}</span>

                {/* Display tick icon if current language is selected */}
                {currentLanguage === lang.key && (
                  <TickIcon className="tick-icon" />
                )}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default LanguageSwitcher;
