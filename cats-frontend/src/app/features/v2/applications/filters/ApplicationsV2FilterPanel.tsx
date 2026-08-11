import { FormEvent, useEffect, useState } from 'react';
import { Button } from '../../../../components/button/Button';
import {
  DropdownInput,
  TextInput,
} from '../../../../components/input-controls/InputControls';
import { FormFieldType } from '../../../../components/input-controls/IFormField';
import '../../../../components/form/Form.css';
import { APPLICATIONS_V2_FILTER_FIELDS } from './applicationsV2FilterConfig';
import {
  EMPTY_ADVANCED_FILTERS,
  type ApplicationsV2AdvancedFilters,
} from './applicationsV2Filters';
import './ApplicationsV2FilterPanel.css';

const FIELD_COL = 'col-lg-3 col-md-6 col-sm-12';

export type ApplicationsV2FilterPanelProps = {
  appliedFilters: ApplicationsV2AdvancedFilters;
  onApply: (filters: ApplicationsV2AdvancedFilters) => void;
  onReset: () => void;
  onCancel: () => void;
};

export function ApplicationsV2FilterPanel({
  appliedFilters,
  onApply,
  onReset,
  onCancel,
}: ApplicationsV2FilterPanelProps) {
  const [draft, setDraft] =
    useState<ApplicationsV2AdvancedFilters>(appliedFilters);

  useEffect(() => {
    setDraft(appliedFilters);
  }, [appliedFilters]);

  const updateDraft = (
    key: keyof ApplicationsV2AdvancedFilters,
    value: string,
  ) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onApply(draft);
  };

  const handleReset = () => {
    setDraft(EMPTY_ADVANCED_FILTERS);
    onReset();
  };

  const handleCancel = () => {
    setDraft(appliedFilters);
    onCancel();
  };

  return (
    <form
      className="applications-v2-filter-panel"
      onSubmit={handleSubmit}
      data-testid="applications-v2-filter-panel"
      aria-label="Application filters"
    >
      <div className="row">
        {APPLICATIONS_V2_FILTER_FIELDS.map((field) => {
          if (field.kind === 'dateRange') {
            return (
              <div key={field.key} className={FIELD_COL}>
                <div className="mb-3">
                  <span className="form-label custom-label">{field.label}</span>
                  <div className="applications-v2-filter-panel__range-inputs">
                    <input
                      type="date"
                      aria-label={`${field.label} from`}
                      className="form-control custom-input custom-input-text"
                      value={draft[field.fromKey]}
                      onChange={(event) =>
                        updateDraft(field.fromKey, event.target.value)
                      }
                    />
                    <span
                      className="applications-v2-filter-panel__range-separator"
                      aria-hidden
                    >
                      –
                    </span>
                    <input
                      type="date"
                      aria-label={`${field.label} to`}
                      className="form-control custom-input custom-input-text"
                      value={draft[field.toKey]}
                      onChange={(event) =>
                        updateDraft(field.toKey, event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            );
          }

          if (field.kind === 'select') {
            return (
              <div key={field.key} className={FIELD_COL}>
                <DropdownInput
                  type={FormFieldType.DropDown}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={draft[field.key]}
                  isEditing
                  options={field.options.map((option) => ({
                    key: option.value,
                    value: option.label,
                  }))}
                  onChange={(value) =>
                    updateDraft(field.key, String(value ?? ''))
                  }
                />
              </div>
            );
          }

          return (
            <div key={field.key} className={FIELD_COL}>
              <TextInput
                type={FormFieldType.Text}
                label={field.label}
                placeholder={field.placeholder}
                value={draft[field.key]}
                isEditing
                validation={
                  field.pattern
                    ? {
                        pattern: field.pattern,
                        customMessage: field.patternMessage,
                      }
                    : undefined
                }
                onChange={(value) =>
                  updateDraft(field.key, String(value ?? ''))
                }
              />
            </div>
          );
        })}
      </div>

      <div className="d-flex flex-wrap justify-content-between w-100 mt-3">
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            data-testid="Reset Filters"
          >
            Reset Filters
          </Button>
        </div>
        <div className="d-flex gap-2">
          <Button type="submit" data-testid="Apply Filters">
            Submit
          </Button>
          <Button
            type="button"
            variant="tertiary"
            onClick={handleCancel}
            data-testid="Cancel Filters"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
