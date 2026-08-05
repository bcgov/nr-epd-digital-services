import { FormEvent, useEffect, useState } from 'react';
import { Button } from '../../../../components/button/Button';
import { APPLICATIONS_V2_FILTER_FIELDS } from './applicationsV2FilterConfig';
import {
  EMPTY_ADVANCED_FILTERS,
  type ApplicationsV2AdvancedFilters,
} from './applicationsV2Filters';
import './ApplicationsV2FilterPanel.css';

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
      <div className="applications-v2-filter-panel__fields">
        {APPLICATIONS_V2_FILTER_FIELDS.map((field) => {
          if (field.kind === 'dateRange') {
            return (
              <fieldset
                key={field.key}
                className="applications-v2-filter-panel__field applications-v2-filter-panel__field--range"
              >
                <legend>{field.label}</legend>
                <label className="applications-v2-filter-panel__sublabel">
                  From
                  <input
                    type="date"
                    value={draft[field.fromKey]}
                    onChange={(event) =>
                      updateDraft(field.fromKey, event.target.value)
                    }
                  />
                </label>
                <label className="applications-v2-filter-panel__sublabel">
                  To
                  <input
                    type="date"
                    value={draft[field.toKey]}
                    onChange={(event) =>
                      updateDraft(field.toKey, event.target.value)
                    }
                  />
                </label>
              </fieldset>
            );
          }

          if (field.kind === 'select') {
            return (
              <label
                key={field.key}
                className="applications-v2-filter-panel__field"
              >
                {field.label}
                <select
                  value={draft[field.key]}
                  onChange={(event) =>
                    updateDraft(field.key, event.target.value)
                  }
                >
                  <option value="">{field.placeholder}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          return (
            <label
              key={field.key}
              className="applications-v2-filter-panel__field"
            >
              {field.label}
              <input
                type="text"
                value={draft[field.key]}
                placeholder={field.placeholder}
                pattern={field.pattern?.source}
                title={field.patternMessage}
                onChange={(event) => updateDraft(field.key, event.target.value)}
              />
            </label>
          );
        })}
      </div>

      <div className="applications-v2-filter-panel__actions">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          data-testid="Reset Filters"
        >
          Reset Filters
        </Button>
        <div className="applications-v2-filter-panel__actions-end">
          <Button type="submit" data-testid="Apply Filters">
            Apply
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
