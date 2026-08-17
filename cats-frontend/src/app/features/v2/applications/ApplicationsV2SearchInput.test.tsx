import { act, fireEvent, render, screen } from '@testing-library/react';
import { ApplicationsV2SearchInput } from './ApplicationsV2SearchInput';

describe('ApplicationsV2SearchInput', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the current search value', () => {
    render(
      <ApplicationsV2SearchInput search="site-42" onSearchChange={vi.fn()} />,
    );

    expect(
      screen.getByRole('searchbox', { name: /search applications/i }),
    ).toHaveValue('site-42');
  });

  it('debounces onSearchChange so rapid typing does not fire per keystroke', () => {
    const onSearchChange = vi.fn();

    render(
      <ApplicationsV2SearchInput search="" onSearchChange={onSearchChange} />,
    );

    const input = screen.getByRole('searchbox', {
      name: /search applications/i,
    });

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });

    expect(onSearchChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onSearchChange).toHaveBeenCalledTimes(1);
    expect(onSearchChange).toHaveBeenCalledWith('abc');
  });

  it('does not call onSearchChange when the debounced value matches the current search', () => {
    const onSearchChange = vi.fn();

    render(
      <ApplicationsV2SearchInput
        search="abc"
        onSearchChange={onSearchChange}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onSearchChange).not.toHaveBeenCalled();
  });
});
