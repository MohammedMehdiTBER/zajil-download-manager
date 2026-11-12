// The schedule window's commands (src-tauri/src/schedule.rs). The types
// are generated from Rust (ts-rs), so both sides agree.
import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import type { AfterChoice } from "./bindings/AfterChoice";
import type { ConfirmTexts } from "./bindings/ConfirmTexts";
import type { Countdown } from "./bindings/Countdown";
import type { PlanChange } from "./bindings/PlanChange";
import type { QueuePlan } from "./bindings/QueuePlan";

export const scheduleApi = {
  /** Opens the schedule window, titled in the page's language. */
  open: (title: string) => invoke<void>("open_schedule", { title }),
  plans: () => invoke<QueuePlan[]>("queue_plans"),
  newQueue: (name: string) => invoke<void>("new_queue", { name }),
  /** Its downloads go to the end of the main queue. */
  deleteQueue: (name: string) => invoke<void>("delete_queue", { name }),
  saveQueue: (name: string, change: PlanChange) => invoke<void>("save_queue", { name, change }),
  moveInQueue: (id: number, up: boolean) => invoke<void>("move_in_queue", { id, up }),
  startQueue: (name: string) => invoke<void>("start_queue", { name }),
  /** «Choose a file…» (#142): Rust owns the selected path; the page only confirms. */
  chooseAfterOpen: (name: string, texts: ConfirmTexts) =>
    invoke<ConfirmTexts | null>("choose_after_open", { name, texts }),
  confirmAfterOpen: (confirmed: boolean) =>
    invoke<string | null>("confirm_after_open", { confirmed }),
  clearAfterOpen: (name: string) => invoke<void>("clear_after_open", { name }),
  /** This run only: never saved. */
  setAfter: (queue: string, choice: AfterChoice) => invoke<void>("set_after", { queue, choice }),
  countdown: () => invoke<Countdown | null>("countdown"),
  cancelAfter: () => invoke<void>("cancel_after"),
  onCountdown: (handler: (countdown: Countdown | null) => void): Promise<UnlistenFn> =>
    listen<Countdown | null>("after-countdown", (event) => handler(event.payload)),
  onAfterFailed: (handler: (error: string) => void): Promise<UnlistenFn> =>
    listen<string>("after-failed", (event) => handler(event.payload)),
};
