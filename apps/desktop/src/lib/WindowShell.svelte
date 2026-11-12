<script lang="ts">
  import type { Component } from "svelte";
  import TitleBar from "./components/TitleBar.svelte";

  let {
    component,
    componentProps = {},
    titleKey,
  }: {
    component: Component<any>;
    componentProps?: Record<string, unknown>;
    titleKey: string;
  } = $props();

  const Page = $derived(component);
</script>

<div class="shell">
  <TitleBar {titleKey} />
  <div class="content">
    <Page {...componentProps} />
  </div>
</div>

<style>
  .shell {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    background: var(--surface);
    color: var(--ink);
  }
  .content {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }
  :global(.content > *) {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    max-height: 100%;
  }
</style>
