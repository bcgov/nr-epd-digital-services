import { Formio } from 'formiojs';
import { registerChefsComponents } from './registerChefsComponents';

vi.mock('formiojs', () => {
  const Formio = { use: vi.fn() };
  return { Formio };
});

describe('registerChefsComponents', () => {
  afterEach(() => {
    document.head.querySelectorAll('script').forEach((el) => el.remove());
    delete window.Formio;
  });

  it('exposes the app formiojs instance on window and loads the CHEFS UMD', async () => {
    const pending = registerChefsComponents();
    const script = document.querySelector(
      'script[src="/chefs-formio/bcgov-formio-components.use.min.js"]',
    ) as HTMLScriptElement | null;

    expect(script).not.toBeNull();
    expect(window.Formio).toBe(Formio);
    expect(window.Formio?.Formio).toBe(Formio);

    script?.dispatchEvent(new Event('load'));
    await pending;
  });
});
