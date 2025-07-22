export interface IFilterOption {
  label: string;
  value: string;
  onClick: () => void;
  isSelected?: boolean;
  icon?: React.ReactNode;
}

export interface IFilterControls {
  options: IFilterOption[];
}
