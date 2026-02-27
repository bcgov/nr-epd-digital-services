import { SigninRedirectArgs } from 'oidc-client-ts';
import { useEffect, useMemo, useState } from 'react';
import { useAuth, hasAuthParams } from 'react-oidc-context';

const signInParams: SigninRedirectArgs = {
  extraQueryParams: { kc_idp_hint: 'idir' },
};

export const useAutoSignin = () => {
  const { isAuthenticated, activeNavigator, isLoading, error, signinRedirect } =
    useAuth();
  const [hasTriedSignin, setHasTriedSignin] = useState(false);

  const shouldAttemptSignin = useMemo(() => {
    return (
      !hasAuthParams() &&
      !isAuthenticated &&
      !activeNavigator &&
      !isLoading &&
      !error &&
      !hasTriedSignin
    );
  }, [activeNavigator, error, isAuthenticated, isLoading, hasTriedSignin]);

  useEffect(() => {
    if (shouldAttemptSignin) {
      const currentUrl = window.location.href;
      sessionStorage.setItem('returnUrl', currentUrl);

      void signinRedirect(signInParams);

      setHasTriedSignin(true);
    }
  }, [hasTriedSignin, shouldAttemptSignin, signinRedirect]);

  return {
    isLoading: isLoading,
    isAuthenticated: isAuthenticated,
    hasErrors: !!error,
  };
};
