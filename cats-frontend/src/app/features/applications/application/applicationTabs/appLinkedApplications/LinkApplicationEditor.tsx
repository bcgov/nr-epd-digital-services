import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCombobox } from 'downshift';
import cx from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Button } from '../../../../../components/button/Button';
import ModalDialog from '../../../../../components/modaldialog/ModalDialog';
import {
  useSaveApplicationLinksMutation,
  useSearchApplicationLinkTargetsQuery,
  type ApplicationLinkRow,
  type ApplicationLinkSearchHit,
} from './LinkedApplications.generated';
import styles from './LinkApplicationEditor.module.css';

type EditorLink = {
  key: string;
  applicationId: number | null;
  confirmationId: string | null;
  fileName: string;
  fromForm: boolean;
};

const FORM_LINK_REMOVE_REASON =
  'This link came from the form submission and cannot be removed.';

const toEditorLink = (row: ApplicationLinkRow): EditorLink => ({
  key: row.id,
  applicationId: row.applicationId ?? null,
  confirmationId: row.confirmationId ?? null,
  fileName: row.fileName ?? row.confirmationId ?? '',
  fromForm: row.fromForm,
});

export const LinkApplicationEditor = ({
  cssaApplicationId,
  rows: storedRows,
  onCancel,
  onSaved,
}: {
  cssaApplicationId: number;
  rows: ApplicationLinkRow[];
  onCancel: () => void;
  onSaved: () => void;
}) => {
  const [rows, setRows] = useState<EditorLink[]>(() =>
    storedRows.map(toEditorLink),
  );
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selected, setSelected] = useState<ApplicationLinkSearchHit | null>(
    null,
  );
  const [saveLinks, { loading: saving }] = useSaveApplicationLinksMutation();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const excludeApplicationIds = useMemo(
    () =>
      rows.flatMap((row) =>
        row.applicationId == null ? [] : [row.applicationId],
      ),
    [rows],
  );

  const { data } = useSearchApplicationLinkTargetsQuery({
    variables: {
      cssaApplicationId,
      query: debouncedQuery,
      excludeApplicationIds,
    },
    skip: debouncedQuery.length === 0,
  });

  const hits = (data?.searchApplicationLinkTargets.data ?? []).filter(
    (hit) => !excludeApplicationIds.includes(hit.applicationId),
  );

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    reset,
  } = useCombobox({
    items: hits,
    inputValue: query,
    itemToString: (item) => item?.fileName ?? '',
    onInputValueChange: ({ inputValue, type }) => {
      setQuery(inputValue ?? '');
      if (type === useCombobox.stateChangeTypes.InputChange) {
        setSelected(null);
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      setSelected(selectedItem ?? null);
    },
  });

  const anchorRef = useRef<HTMLDivElement>(null);
  const menuProps = getMenuProps({}, { suppressRefError: true });
  const [menuBox, setMenuBox] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);
  const menuOpen = isOpen && hits.length > 0;

  useLayoutEffect(() => {
    if (!menuOpen) {
      return;
    }
    const placeMenu = () => {
      const input = anchorRef.current;
      if (!input) {
        return;
      }
      const rect = input.getBoundingClientRect();
      const margin = 8;
      const spaceBelow = window.innerHeight - rect.bottom - margin;
      const spaceAbove = rect.top - margin;
      const placeAbove = spaceBelow < 160 && spaceAbove > spaceBelow;
      const maxHeight = Math.max(placeAbove ? spaceAbove : spaceBelow, 0);
      setMenuBox({
        top: placeAbove ? rect.top - maxHeight : rect.bottom,
        left: rect.left,
        width: rect.width,
        maxHeight,
      });
    };
    placeMenu();
    window.addEventListener('resize', placeMenu);
    window.addEventListener('scroll', placeMenu, true);
    return () => {
      window.removeEventListener('resize', placeMenu);
      window.removeEventListener('scroll', placeMenu, true);
    };
  }, [menuOpen]);

  const addSelected = () => {
    if (
      !selected ||
      rows.some((row) => row.applicationId === selected.applicationId)
    ) {
      return;
    }
    setRows((current) => [
      ...current,
      {
        key: `new-${selected.applicationId}`,
        applicationId: selected.applicationId,
        confirmationId: selected.confirmationId ?? null,
        fileName: selected.fileName,
        fromForm: false,
      },
    ]);
    setSelected(null);
    setQuery('');
    reset();
  };

  const save = () => {
    saveLinks({
      variables: {
        input: {
          cssaApplicationId,
          links: rows.map((row) => ({
            targetApplicationId: row.applicationId,
            confirmationId: row.confirmationId,
          })),
        },
      },
      onCompleted: () => onSaved(),
    });
  };

  return (
    <ModalDialog
      headerLabel="Linked Applications"
      noFooterOptions
      cancelButtonDisabled={saving}
      customContentCss={styles.modal}
      customChildrenCss={styles.body}
      closeHandler={() => {
        if (!saving) {
          onCancel();
        }
      }}
    >
      <div className={styles.searchRow}>
        <div className={styles.searchField}>
          <label className="form-label custom-label" {...getLabelProps()}>
            Search and Link Applications
          </label>
          <div ref={anchorRef}>
            <input
              className="form-control custom-input"
              placeholder="Search and Select Applications..."
              {...getInputProps()}
            />
          </div>
          {menuOpen &&
            menuBox &&
            createPortal(
              <ul
                {...menuProps}
                className={styles.dropdownMenu}
                style={{
                  top: menuBox.top,
                  left: menuBox.left,
                  width: menuBox.width,
                  maxHeight: menuBox.maxHeight,
                }}
              >
                {hits.map((hit, index) => (
                  <li
                    key={hit.applicationId}
                    className={cx(
                      styles.dropdownMenuItem,
                      highlightedIndex === index &&
                        styles.dropdownMenuItemHighlighted,
                    )}
                    {...getItemProps({ item: hit, index })}
                  >
                    {hit.fileName}
                  </li>
                ))}
              </ul>,
              document.body,
            )}
        </div>
        <Button
          type="button"
          variant="primary"
          disabled={
            !selected ||
            rows.some((row) => row.applicationId === selected.applicationId)
          }
          onClick={addSelected}
        >
          Link Application
        </Button>
      </div>
      <ul className={styles.rows}>
        {rows.map((row) => (
          <li key={row.key} className={styles.row}>
            <p className={styles.fileName}>{row.fileName}</p>
            {row.fromForm ? (
              <OverlayTrigger
                placement="top"
                container={document.body}
                popperConfig={{ strategy: 'fixed' }}
                overlay={
                  <Tooltip
                    id={`cannot-remove-${row.key}`}
                    className={styles.removeTooltip}
                  >
                    {FORM_LINK_REMOVE_REASON}
                  </Tooltip>
                }
              >
                <span
                  className={styles.removeDisabled}
                  tabIndex={0}
                  aria-label={`Remove. ${FORM_LINK_REMOVE_REASON}`}
                >
                  <Button type="button" variant="secondary" disabled>
                    Remove
                  </Button>
                </span>
              </OverlayTrigger>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setRows((current) =>
                    current.filter((item) => item.key !== row.key),
                  )
                }
              >
                Remove
              </Button>
            )}
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <Button
          type="button"
          variant="tertiary"
          disabled={saving}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          disabled={saving}
          onClick={save}
        >
          Save
        </Button>
      </div>
    </ModalDialog>
  );
};
