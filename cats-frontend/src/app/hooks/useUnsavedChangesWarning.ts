import { useEffect, useCallback } from 'react';
import { useBlocker, Location } from 'react-router-dom';

interface UseUnsavedChangesWarningOptions {
  hasUnsavedChanges: boolean;
  message?: string;
}

/**
 * Custom hook that warns users about unsaved changes when they try to navigate away
 * Handles both browser events (tab close, refresh, etc.) and client-side navigation
 */
export const useUnsavedChangesWarning = ({
  hasUnsavedChanges,
  message = 'You have unsaved changes. Are you sure you want to leave?',
}: UseUnsavedChangesWarningOptions) => {
  // Handle browser events (tab close, refresh, back button, etc.)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Modern browsers ignore the custom message and show their own, we don't have control over that
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);

  // Handle client-side navigation (React Router)
  const blocker = useBlocker(
    useCallback(
      ({
        currentLocation,
        nextLocation,
      }: {
        currentLocation: Location;
        nextLocation: Location;
      }) => {
        // Block navigation if there are unsaved changes and the user is navigating to a different route
        return (
          hasUnsavedChanges &&
          currentLocation.pathname !== nextLocation.pathname
        );
      },
      [hasUnsavedChanges],
    ),
  );

  // Handle the blocked navigation with a confirmation dialog
  useEffect(() => {
    if (blocker.state === 'blocked') {
      const shouldProceed = window.confirm(message);
      if (shouldProceed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);

  return {
    isBlocked: blocker.state === 'blocked',
  };
};
