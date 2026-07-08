export interface EmailRecipient {
  id: string;
  email: string;
  displayName?: string;
  personId?: number;
  isCustom: boolean;
}

export interface MultiRecipientInputProps {
  label: string;
  recipients: EmailRecipient[];
  onAddRecipient: (recipient: EmailRecipient) => void;
  onRemoveRecipient: (id: string) => void;
  contactOptions?: { key: string; value: string; metaData?: string | null }[];
  filteredContactOptions?: {
    key: string;
    value: string;
    metaData?: string | null;
  }[];
  onSearchContacts?: (searchTerm: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  validationError?: string;
  disabled?: boolean;
  ariaLabel?: string;
}
