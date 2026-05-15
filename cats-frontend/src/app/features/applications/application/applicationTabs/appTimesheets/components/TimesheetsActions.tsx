import { Button } from '@cats/components/button/Button';

interface TimesheetsActionsProps {
  onSave: () => void;
  onCancelOverride: () => void;
  hasEdits: boolean;
  disabled?: boolean;
  isOverrideEditing?: boolean;
}

export const TimesheetsActions = ({
  onSave,
  onCancelOverride,
  hasEdits,
  disabled,
  isOverrideEditing,
}: TimesheetsActionsProps) => {
  return (
    <div className="d-flex gap-2 mt-4">
      {isOverrideEditing && (
        <Button variant="tertiary" disabled={disabled} onClick={onCancelOverride}>
          Cancel
        </Button>
      )}
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
