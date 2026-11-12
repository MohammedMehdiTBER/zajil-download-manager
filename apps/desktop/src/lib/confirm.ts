import { writable } from "svelte/store";

export interface ConfirmationOptions {
  title: string;
  message: string;
  okLabel: string;
  cancelLabel: string;
}

/** A per-window, in-app confirmation prompt. The native file pickers stay native. */
export function createConfirmation() {
  const prompt = writable<ConfirmationOptions | null>(null);
  let settle: ((answer: boolean) => void) | null = null;

  function ask(options: ConfirmationOptions): Promise<boolean> {
    if (settle) return Promise.resolve(false);
    return new Promise((resolve) => {
      settle = resolve;
      prompt.set(options);
    });
  }

  function answer(value: boolean) {
    const resolve = settle;
    settle = null;
    prompt.set(null);
    resolve?.(value);
  }

  return { prompt, ask, answer };
}
