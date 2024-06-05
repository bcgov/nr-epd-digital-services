export interface ISearchInput {
    label?: string;
    searchTerm: string;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clearSearch: () => void;
}