import React, { useState, useRef, useCallback } from 'react';
import {
  EmailRecipient,
  MultiRecipientInputProps,
} from './IMultiRecipientInput';
import { v4 } from 'uuid';
import './MultiRecipientInput.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MultiRecipientInput: React.FC<MultiRecipientInputProps> = ({
  label,
  recipients,
  onAddRecipient,
  onRemoveRecipient,
  contactOptions = [],
  filteredContactOptions = [],
  onSearchContacts,
  isLoading = false,
  placeholder = 'Search contacts or type an email...',
  validationError,
  disabled = false,
  ariaLabel,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const existingEmails = recipients.map((r) => r.email.toLowerCase());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setInlineError(null);

    if (value.trim().length > 0 && onSearchContacts) {
      onSearchContacts(value.trim());
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const addCustomEmail = useCallback(
    (email: string) => {
      const trimmed = email.trim();
      if (!trimmed) return;

      if (!EMAIL_REGEX.test(trimmed)) {
        setInlineError('Please enter a valid email address.');
        return;
      }

      if (existingEmails.includes(trimmed.toLowerCase())) {
        setInlineError('This email has already been added.');
        return;
      }

      onAddRecipient({
        id: v4(),
        email: trimmed,
        displayName: trimmed,
        isCustom: true,
      });
      setInputValue('');
      setInlineError(null);
      setShowDropdown(false);
    },
    [existingEmails, onAddRecipient],
  );

  const addContactRecipient = (contact: {
    key: string;
    value: string;
    metaData?: string | null;
  }) => {
    const email = contact.metaData || '';

    if (!email.trim()) {
      setInlineError('This contact does not have an email address.');
      return;
    }

    if (existingEmails.includes(email.toLowerCase())) {
      setInlineError('This contact has already been added.');
      return;
    }

    onAddRecipient({
      id: v4(),
      email,
      displayName: contact.value,
      personId: parseInt(contact.key, 10),
      isCustom: false,
    });
    setInputValue('');
    setInlineError(null);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCustomEmail(inputValue);
    }

    if (e.key === 'Backspace' && inputValue === '' && recipients.length > 0) {
      const lastRecipient = recipients[recipients.length - 1];
      onRemoveRecipient(lastRecipient.id);
    }
  };

  const handleBlur = () => {
    // Delay to allow dropdown click to register
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setShowDropdown(false);
        if (inputValue.trim() && EMAIL_REGEX.test(inputValue.trim())) {
          addCustomEmail(inputValue);
        }
      }
    }, 200);
  };

  const handleChipKeyDown = (e: React.KeyboardEvent, recipientId: string) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onRemoveRecipient(recipientId);
      inputRef.current?.focus();
    }
  };

  const displayedOptions =
    inputValue.trim().length > 0 ? filteredContactOptions : contactOptions;

  return (
    <div className="mri-container" ref={containerRef}>
      <label className="mri-label" id={`mri-label-${label}`}>
        {label}
      </label>
      <div
        className={`mri-input-wrapper ${validationError || inlineError ? 'mri-input-wrapper--error' : ''} ${disabled ? 'mri-input-wrapper--disabled' : ''}`}
        onClick={() => inputRef.current?.focus()}
        role="group"
        aria-labelledby={`mri-label-${label}`}
      >
        <ul
          className="mri-chip-list"
          role="list"
          aria-label={ariaLabel || `${label} recipients`}
        >
          {recipients.map((recipient) => (
            <li
              key={recipient.id}
              className="mri-chip"
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => handleChipKeyDown(e, recipient.id)}
              aria-label={`${recipient.displayName || recipient.email}. Press delete to remove.`}
            >
              <span className="mri-chip-text">
                {recipient.displayName || recipient.email}
              </span>
              <button
                type="button"
                className="mri-chip-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveRecipient(recipient.id);
                }}
                aria-label={`Remove ${recipient.displayName || recipient.email}`}
                tabIndex={-1}
                disabled={disabled}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
        <input
          ref={inputRef}
          type="text"
          className="mri-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={recipients.length === 0 ? placeholder : ''}
          disabled={disabled}
          aria-label={ariaLabel || `Add ${label} recipient`}
          aria-describedby={
            inlineError || validationError ? `mri-error-${label}` : undefined
          }
          aria-invalid={!!(inlineError || validationError)}
          autoComplete="off"
        />
      </div>

      {inputValue.trim() &&
        !showDropdown &&
        EMAIL_REGEX.test(inputValue.trim()) && (
          <div className="mri-hint" aria-live="polite">
            Press <kbd>Enter</kbd> to add <strong>{inputValue.trim()}</strong>
          </div>
        )}

      {inputValue.trim() &&
        showDropdown &&
        EMAIL_REGEX.test(inputValue.trim()) && (
          <ul
            className="mri-dropdown"
            role="listbox"
            aria-label="Contact suggestions"
          >
            <li
              className="mri-dropdown-item"
              role="option"
              aria-selected={false}
              onClick={() => addCustomEmail(inputValue)}
              onMouseDown={(e) => e.preventDefault()}
            >
              <span className="mri-dropdown-name">
                Add &quot;{inputValue.trim()}&quot;
              </span>
              <span className="mri-dropdown-email">
                Press Enter or click to add
              </span>
            </li>
            {!isLoading &&
              displayedOptions.map((option) => (
                <li
                  key={option.key}
                  className="mri-dropdown-item"
                  role="option"
                  aria-selected={false}
                  onClick={() => addContactRecipient(option)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="mri-dropdown-name">{option.value}</span>
                  {option.metaData && (
                    <span className="mri-dropdown-email">
                      {option.metaData}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        )}

      {showDropdown &&
        displayedOptions.length > 0 &&
        !EMAIL_REGEX.test(inputValue.trim()) && (
          <ul
            className="mri-dropdown"
            role="listbox"
            aria-label="Contact suggestions"
          >
            {isLoading ? (
              <li className="mri-dropdown-item mri-dropdown-item--loading">
                Searching...
              </li>
            ) : (
              displayedOptions.map((option) => (
                <li
                  key={option.key}
                  className="mri-dropdown-item"
                  role="option"
                  aria-selected={false}
                  onClick={() => addContactRecipient(option)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="mri-dropdown-name">{option.value}</span>
                  {option.metaData && (
                    <span className="mri-dropdown-email">
                      {option.metaData}
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        )}

      {(inlineError || validationError) && (
        <div
          className="mri-error"
          id={`mri-error-${label}`}
          role="alert"
          aria-live="polite"
        >
          {inlineError || validationError}
        </div>
      )}
    </div>
  );
};

export default MultiRecipientInput;
