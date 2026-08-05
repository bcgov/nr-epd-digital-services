import { fireEvent, screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { ApplicationsV2FilterPanel } from './ApplicationsV2FilterPanel';
import { EMPTY_ADVANCED_FILTERS } from './applicationsV2Filters';

describe('ApplicationsV2FilterPanel', () => {
  it('keeps draft edits local until Apply', () => {
    const onApply = vi.fn();
    const onReset = vi.fn();
    const onCancel = vi.fn();

    render(
      <ApplicationsV2FilterPanel
        appliedFilters={EMPTY_ADVANCED_FILTERS}
        onApply={onApply}
        onReset={onReset}
        onCancel={onCancel}
      />,
    );

    fireEvent.change(screen.getByLabelText('Application ID'), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByLabelText('Priority'), {
      target: { value: 'High' },
    });

    expect(onApply).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('Apply Filters'));

    expect(onApply).toHaveBeenCalledWith({
      ...EMPTY_ADVANCED_FILTERS,
      id: '12',
      priority: 'High',
    });
  });

  it('resets draft and calls onReset', () => {
    const onApply = vi.fn();
    const onReset = vi.fn();
    const onCancel = vi.fn();

    render(
      <ApplicationsV2FilterPanel
        appliedFilters={{
          ...EMPTY_ADVANCED_FILTERS,
          commonName: 'acme',
        }}
        onApply={onApply}
        onReset={onReset}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByLabelText('Common Name')).toHaveValue('acme');

    fireEvent.change(screen.getByLabelText('Common Name'), {
      target: { value: 'draft-only' },
    });
    fireEvent.click(screen.getByTestId('Reset Filters'));

    expect(screen.getByLabelText('Common Name')).toHaveValue('');
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onApply).not.toHaveBeenCalled();
  });

  it('abandons draft edits on Cancel', () => {
    const onApply = vi.fn();
    const onReset = vi.fn();
    const onCancel = vi.fn();

    render(
      <ApplicationsV2FilterPanel
        appliedFilters={{
          ...EMPTY_ADVANCED_FILTERS,
          priority: 'Low',
        }}
        onApply={onApply}
        onReset={onReset}
        onCancel={onCancel}
      />,
    );

    fireEvent.change(screen.getByLabelText('Priority'), {
      target: { value: 'High' },
    });
    expect(screen.getByLabelText('Priority')).toHaveValue('High');

    fireEvent.click(screen.getByTestId('Cancel Filters'));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Priority')).toHaveValue('Low');
    expect(onApply).not.toHaveBeenCalled();
  });
});
