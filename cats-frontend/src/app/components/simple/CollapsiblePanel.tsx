import { FC, ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp, SpinnerIcon } from '../common/icon';
import styles from './CollapsiblePanel.module.css';
import { Button } from '../button/Button';
import { LoadingSpinner } from '../loader/LoadingOverlay';

interface CollapsiblePanelProps {
  label: string | ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
  loading?: boolean;
}

const CollapsiblePanel: FC<CollapsiblePanelProps> = ({
  label,
  content,
  defaultOpen = false,
  loading = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`d-flex flex-column ${styles.panelContainer}`}>
      {label && (
        <div className="d-flex justify-content-between">
          <div className={styles.panelLabel}>{label}</div>
          <Button
            variant="tertiary"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Collapse section' : 'Expand section'}
            aria-expanded={open}
          >
            {open ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      )}

      {open && !loading && content}
      {open && loading && (
        <div className="d-flex justify-content-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default CollapsiblePanel;
