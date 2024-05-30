import { useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./LanguageSwitcher.css";
import { DropdownIcon, TickIcon } from "../common/icon";

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
  const [isOpen, setIsOpen] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  // Function to handle language change
  const changeLanguage = (lng: string) => {
    setCurrentLanguage(lng);
  };

  const toggleBtn = (event : any) => {
    // event.preventDefault();
    setIsOpen(!isOpen);
  }

   
  // Function to handle clicks outside the div element
  const handleClickOutside = (event: MouseEvent) => {
      if(divRef.current != null)
      {
          // Check if the clicked target is outside the div element
          if (divRef.current && !divRef.current.contains(event.target as Node)) {
                setIsOpen(false); // Close the div
          }
      }
    
};

  // Add and remove event listener for clicks on the document
  useEffect(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
          document.removeEventListener('click', handleClickOutside);
      };
  }, []);

  return (
    <>
      {/* Dropdown component for language selection */}
      <div aria-label="Language Selector" ref={divRef}>
        {/* Dropdown toggle button */}
        <div id="language-dropdown" className="custom-toggle"
         aria-label="Language Menu" onClick={toggleBtn} >
          {/* Display current selected language */}
          {currentLanguage.toUpperCase() }
          <DropdownIcon className="pb-1 ps-1"/>
        </div>
        
      </div>
        {/* Dropdown menu */}
        { isOpen && <div
          
          className="custom-menu mt-4"
          role="menu"
          aria-labelledby="language-dropdown"
        >
          {/* Language options */}
          <div role="none">
            {/* Default option */}
            <div
              className="custom-item-first-child"
              role="menuitem"
              aria-disabled="true"
              tabIndex={-1} // Prevent tab focus on disabled items
            >
              <div className="custom-item-label pb-2">Please select a language:</div>
            </div>
          </div>

          {/* Map through available languages */}
          {LANGUAGE &&
            LANGUAGE.map((lang) => (
              <div
                onClick={() => {changeLanguage(lang.key); setIsOpen(!isOpen)}}
                className="custom-item d-flex w-100 align-items-center"
                role="menuitem"
                aria-label={lang.value}
                aria-current={currentLanguage === lang.key ? "true" : undefined}
                tabIndex={0} // Allow keyboard focus
                key={lang.key}
              >
                {/* Display language name */}
                <span>{lang.value}</span>

                {/* Display tick icon if current language is selected */}
                {currentLanguage === lang.key && (
                  <TickIcon className="tick-icon " />
                )}
              </div>
            ))}
        </div>
        }
     
    </>
  );
};

export default LanguageSwitcher;
