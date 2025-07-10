import { FC, ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp, SpinnerIcon } from '../common/icon';
import styles from './CollapsiblePanel.module.css';
import { Button } from '../button/Button';
import { LoadingSpinner } from '../loader/LoadingOverlay';
import cx from 'classnames';

interface CollapsiblePanelProps {
  label: string | ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
  loading?: boolean;
  defaultCloseBtnPosition?: 'left' | 'right';
  showBorder?: boolean;
  showPadding?: boolean;
  smallFont?: boolean;
  onToggle?: (open: boolean) => void;
  panelContainerClassName?: string;
  panelLabelClassName?: string;
}

const CollapsiblePanel: FC<CollapsiblePanelProps> = ({
  label,
  content,
  defaultOpen = false,
  loading = false,
  defaultCloseBtnPosition = 'right',
  showBorder = true,
  showPadding = true,
  smallFont = false,
  panelContainerClassName = '',
  panelLabelClassName = '',
  onToggle = () => {},
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const handleToggle = () => {
    setOpen(!open);
    onToggle(!open);
  };

  return (
    <div
      className={cx('d-flex flex-column', styles.panelContainer, {
        [styles.panelContainerBorder]: showBorder,
        [styles.panelContainerPadding]: showPadding,
        [panelContainerClassName]: panelContainerClassName,
      })}
    >
      {label && (
        <div
          className={cx('d-flex', {
            'justify-content-between': defaultCloseBtnPosition === 'right',
            'justify-content-end': defaultCloseBtnPosition === 'left',
            'flex-row-reverse': defaultCloseBtnPosition === 'left',
          })}
        >
          <div
            className={cx('panel-label', styles.panelLabel, {
              [styles.panelLabelSmall]: smallFont,
              [panelLabelClassName]: panelLabelClassName,
            })}
          >
            {label}
          </div>
          <Button
            variant="tertiary"
            onClick={handleToggle}
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
