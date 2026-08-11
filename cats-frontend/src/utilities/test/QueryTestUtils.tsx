import React, { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { render, RenderOptions } from '@testing-library/react';
import { renderHook, RenderHookOptions } from '@testing-library/react';

type WrapperOptions = {
  initialEntries?: string[];
  queryClient?: QueryClient;
};

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

export const createQueryRouterWrapper = ({
  initialEntries = ['/'],
  queryClient = createTestQueryClient(),
}: WrapperOptions = {}) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  return { Wrapper, queryClient };
};

export const renderWithQueryRouter = (
  ui: ReactElement,
  options: WrapperOptions & Omit<RenderOptions, 'wrapper'> = {},
) => {
  const { initialEntries, queryClient, ...renderOptions } = options;
  const { Wrapper, queryClient: client } = createQueryRouterWrapper({
    initialEntries,
    queryClient,
  });

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient: client,
  };
};

export const renderHookWithQueryRouter = <TResult,>(
  hook: () => TResult,
  options: WrapperOptions & Omit<RenderHookOptions<unknown>, 'wrapper'> = {},
) => {
  const { initialEntries, queryClient, ...hookOptions } = options;
  const { Wrapper, queryClient: client } = createQueryRouterWrapper({
    initialEntries,
    queryClient,
  });

  return {
    ...renderHook(hook, { wrapper: Wrapper, ...hookOptions }),
    queryClient: client,
  };
};
