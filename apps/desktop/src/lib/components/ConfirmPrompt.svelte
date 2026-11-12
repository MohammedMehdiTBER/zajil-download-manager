<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import Icon from "./Icon.svelte";
  import { locale } from "../i18n.svelte";

  let {
    title,
    message,
    okLabel,
    cancelLabel,
    onanswer,
  }: {
    title: string;
    message: string;
    okLabel: string;
    cancelLabel: string;
    onanswer: (answer: boolean) => void;
  } = $props();

  let dialog: HTMLDivElement | undefined = $state();
  let cancel: HTMLButtonElement | undefined = $state();
  let previous: HTMLElement | null = null;

  onMount(() => {
    previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    void tick().then(() => cancel?.focus());
  });

  onDestroy(() => previous?.focus());

  function keydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onanswer(false);
      return;
    }
    if (event.key !== "Tab" || !dialog) return;
    const buttons = [...dialog.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
    if (!buttons.length) return;
    const first = buttons[0]!;
    const last = buttons[buttons.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
</script>

<div class="scrim" dir={locale.dir}>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex a11y_no_noninteractive_element_interactions -->
  <div
    class="dialog"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="confirm-title"
    aria-describedby="confirm-message"
    tabindex="-1"
    bind:this={dialog}
    onkeydown={keydown}
  >
    <div class="heading">
      <span class="symbol" aria-hidden="true"><Icon name="circle-alert" size={20} /></span>
      <h2 id="confirm-title">{title}</h2>
    </div>
    <p id="confirm-message">{message}</p>
    <div class="actions">
      <button class="btn" bind:this={cancel} data-cancel onclick={() => onanswer(false)}>{cancelLabel}</button>
      <button class="btn primary" onclick={() => onanswer(true)}>{okLabel}</button>
    </div>
  </div>
</div>

<style>
  .scrim {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: grid;
    place-items: center;
    padding: 18px;
    background: var(--scrim, rgb(0 0 0 / 0.42));
    font: inherit;
  }
  .dialog {
    width: min(460px, 100%);
    padding: 20px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--surface);
    color: var(--ink);
    box-shadow: var(--shadow);
    outline: none;
  }
  .heading {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .symbol {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: var(--amber-bg);
    color: var(--amber);
    flex: none;
  }
  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  p {
    margin: 14px 0 20px;
    color: var(--ink);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
</style>
