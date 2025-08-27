import { Button } from '@cats/components/button/Button';

interface TimesheetsActionsProps {
  onSave: () => void;
  hasEdits: boolean;
  disabled?: boolean;
}

export const TimesheetsActions = ({
  onSave,
  hasEdits,
  disabled,
}: TimesheetsActionsProps) => {
  return (
    <div className="d-flex gap-2 mt-4">
      <Button
        variant="primary"
        disabled={!hasEdits || disabled}
        onClick={onSave}
      >
        Save
      </Button>
    </div>
  );
};
