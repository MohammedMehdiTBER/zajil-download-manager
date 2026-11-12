<script lang="ts">
  import { onMount } from "svelte";
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import Icon from "./Icon.svelte";
  import Mark from "./Mark.svelte";
  import { locale } from "../i18n.svelte";
  // One title-bar implementation is used by every app-owned window.
  // The controls reverse as a group in RTL so the close button is outermost.
  let { titleKey = "app-title" }: { titleKey?: string } = $props();
  const brandRight = $derived(locale.dir === "rtl");
  const win = getCurrentWindow();
  let maximized = $state(false);

  onMount(() => {
    let unlisten: (() => void) | undefined;
    const check = () => void win.isMaximized().then((m) => (maximized = m), () => {});
    check();
    void win.onResized(check).then((u) => (unlisten = u), () => {});
    return () => unlisten?.();
  });
</script>

<!-- "deep": the logo and the name drag too; the buttons do not. -->
<!-- Laid out left to right, the sides chosen above; the brand reads in
     the language's own direction. -->
<div class="titlebar" class:brand-right={brandRight} dir="ltr" data-tauri-drag-region="deep">
  <span class="brand" dir={locale.dir}>
    <Mark size={18} />
    <span class="name">{locale.t(titleKey)}</span>
  </span>
  <span class="controls">
      <button class="ctl" aria-label={locale.t("win-minimize")} title={locale.t("win-minimize")} onclick={() => void win.minimize()}>
        <Icon name="minus" size={15} />
      </button>
      <button
        class="ctl"
        aria-label={locale.t(maximized ? "win-restore" : "win-maximize")}
        title={locale.t(maximized ? "win-restore" : "win-maximize")}
        onclick={() => void win.toggleMaximize()}
      >
        <Icon name={maximized ? "copy" : "square"} size={13} />
      </button>
      <button class="ctl close" aria-label={locale.t("win-close")} title={locale.t("win-close")} onclick={() => void win.close()}>
        <Icon name="x" size={16} />
      </button>
  </span>
</div>

<style>
  .titlebar {
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 12px;
    background: var(--frame, var(--sunken));
    border-bottom: 1px solid var(--line);
    user-select: none;
    -webkit-user-select: none;
    flex: none;
  }
  .brand-right .brand {
    margin-inline-start: auto;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .controls {
    display: flex;
    height: 100%;
    margin-inline-start: auto;
    margin-inline-end: -12px;
    flex: none;
  }
  /* In RTL, reverse the controls too: close is the leftmost outer button. */
  .brand-right .controls {
    order: -1;
    margin-inline-start: -12px;
    margin-inline-end: 0;
    flex-direction: row-reverse;
  }
  .ctl {
    width: 46px;
    height: 100%;
    border: 0;
    background: none;
    color: var(--muted);
    display: grid;
    place-items: center;
    cursor: default;
  }
  .ctl:hover {
    background: var(--sel);
    color: var(--ink);
  }
  .ctl.close:hover {
    background: #c42b1c;
    color: #fff;
  }
  .ctl:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
  }
</style>
