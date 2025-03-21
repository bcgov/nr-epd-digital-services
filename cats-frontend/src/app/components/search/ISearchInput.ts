type OptionType = string | { label: string; value: string | number };

export interface ISearchInput {
  label?: string;
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
  options?: OptionType[];
  optionSelectHandler?: (event: any) => void;
  createNewLabel?: string;
  createNewHandler?: (event: any) => void;
  placeHolderText?: string;
  loading?: boolean;
}
