import React from 'react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useUnsavedChangesWarning } from './useUnsavedChangesWarning';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

const mockBlocker = {
  state: 'unblocked',
  proceed: vi.fn(),
  reset: vi.fn(),
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useBlocker: vi.fn(() => mockBlocker),
  };
});

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(MemoryRouter, null, children);
};

describe('useUnsavedChangesWarning', () => {
  let mockConfirm: ReturnType<typeof vi.fn>;
  let mockAddEventListener: ReturnType<typeof vi.fn>;
  let mockRemoveEventListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockConfirm = vi.fn();
    Object.defineProperty(window, 'confirm', {
      value: mockConfirm,
      writable: true,
    });

    mockAddEventListener = vi.fn();
    mockRemoveEventListener = vi.fn();
    Object.defineProperty(window, 'addEventListener', {
      value: mockAddEventListener,
      writable: true,
    });
    Object.defineProperty(window, 'removeEventListener', {
      value: mockRemoveEventListener,
      writable: true,
    });

    mockBlocker.state = 'unblocked';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Browser events (beforeunload)', () => {
    it('should not add beforeunload listener when hasUnsavedChanges is false', () => {
      renderHook(() => useUnsavedChangesWarning({ hasUnsavedChanges: false }), {
        wrapper: createWrapper(),
      });

      expect(mockAddEventListener).not.toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      );
    });

    it('should add beforeunload listener when hasUnsavedChanges is true', () => {
      renderHook(() => useUnsavedChangesWarning({ hasUnsavedChanges: true }), {
        wrapper: createWrapper(),
      });

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      );
    });

    it('should remove beforeunload listener when hasUnsavedChanges changes from true to false', () => {
      const { rerender } = renderHook(
        ({ hasUnsavedChanges }) =>
          useUnsavedChangesWarning({ hasUnsavedChanges }),
        {
          wrapper: createWrapper(),
          initialProps: { hasUnsavedChanges: true },
        },
      );

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      );

      rerender({ hasUnsavedChanges: false });

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      );
    });

    it('should remove beforeunload listener on cleanup', () => {
      const { unmount } = renderHook(
        () => useUnsavedChangesWarning({ hasUnsavedChanges: true }),
        { wrapper: createWrapper() },
      );

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      );
    });

    it('should handle beforeunload event correctly when hasUnsavedChanges is true', () => {
      renderHook(
        () =>
          useUnsavedChangesWarning({
            hasUnsavedChanges: true,
            message: 'Custom warning message',
          }),
        { wrapper: createWrapper() },
      );

      const eventHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'beforeunload',
      )?.[1];

      expect(eventHandler).toBeDefined();

      const mockEvent = {
        preventDefault: vi.fn(),
        returnValue: '',
      };

      const result = eventHandler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.returnValue).toBe('Custom warning message');
      expect(result).toBe('Custom warning message');
    });

    it('should not prevent default when hasUnsavedChanges is false', () => {
      renderHook(() => useUnsavedChangesWarning({ hasUnsavedChanges: false }), {
        wrapper: createWrapper(),
      });

      expect(mockAddEventListener).not.toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      );
    });
  });

  describe('React Router navigation blocking', () => {
    it('should return isBlocked as false when blocker state is unblocked', () => {
      mockBlocker.state = 'unblocked';

      const { result } = renderHook(
        () => useUnsavedChangesWarning({ hasUnsavedChanges: true }),
        { wrapper: createWrapper() },
      );

      expect(result.current.isBlocked).toBe(false);
    });

    it('should return isBlocked as true when blocker state is blocked', () => {
      mockBlocker.state = 'blocked';

      const { result } = renderHook(
        () => useUnsavedChangesWarning({ hasUnsavedChanges: true }),
        { wrapper: createWrapper() },
      );

      expect(result.current.isBlocked).toBe(true);
    });

    it('should call blocker.proceed() when user confirms navigation', () => {
      mockBlocker.state = 'blocked';
      mockConfirm.mockReturnValue(true);

      renderHook(
        () =>
          useUnsavedChangesWarning({
            hasUnsavedChanges: true,
            message: 'Custom warning message',
          }),
        { wrapper: createWrapper() },
      );

      expect(mockConfirm).toHaveBeenCalledWith('Custom warning message');
      expect(mockBlocker.proceed).toHaveBeenCalled();
      expect(mockBlocker.reset).not.toHaveBeenCalled();
    });

    it('should call blocker.reset() when user cancels navigation', () => {
      mockBlocker.state = 'blocked';
      mockConfirm.mockReturnValue(false);

      renderHook(
        () =>
          useUnsavedChangesWarning({
            hasUnsavedChanges: true,
            message: 'Custom warning message',
          }),
        { wrapper: createWrapper() },
      );

      expect(mockConfirm).toHaveBeenCalledWith('Custom warning message');
      expect(mockBlocker.reset).toHaveBeenCalled();
      expect(mockBlocker.proceed).not.toHaveBeenCalled();
    });

    it('should use default message when no custom message is provided', () => {
      mockBlocker.state = 'blocked';
      mockConfirm.mockReturnValue(true);

      renderHook(() => useUnsavedChangesWarning({ hasUnsavedChanges: true }), {
        wrapper: createWrapper(),
      });

      expect(mockConfirm).toHaveBeenCalledWith(
        'You have unsaved changes. Are you sure you want to leave?',
      );
    });

    it('should not show confirmation dialog when blocker state is not blocked', () => {
      mockBlocker.state = 'unblocked';

      renderHook(() => useUnsavedChangesWarning({ hasUnsavedChanges: true }), {
        wrapper: createWrapper(),
      });

      expect(mockConfirm).not.toHaveBeenCalled();
      expect(mockBlocker.proceed).not.toHaveBeenCalled();
      expect(mockBlocker.reset).not.toHaveBeenCalled();
    });
  });
});
