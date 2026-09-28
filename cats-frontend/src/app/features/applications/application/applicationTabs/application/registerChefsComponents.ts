import { Formio } from 'formiojs';

type FormioGlobal = typeof Formio & { Formio?: typeof Formio };

declare global {
  interface Window {
    Formio?: FormioGlobal;
  }
}

let registration: Promise<void> | null = null;

/**
 * Load the CHEFS Form.io UMD after exposing the same formiojs instance
 * @formio/react uses. The UMD webpack build externalizes formiojs as the
 * global `Formio` and calls `Formio.use(...)` on load.
 */
export function registerChefsComponents(): Promise<void> {
  if (!registration) {
    registration = loadChefsUmd();
  }
  return registration;
}

function loadChefsUmd(): Promise<void> {
  const formio = Formio as FormioGlobal;
  window.Formio = formio;
  if (!formio.Formio) {
    formio.Formio = formio;
  }

  const src = `${import.meta.env.BASE_URL}chefs-formio/bcgov-formio-components.use.min.js`;

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error(`Failed to load CHEFS Form.io components from ${src}`));
    document.head.appendChild(script);
  });
}
