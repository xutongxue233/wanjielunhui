export {};

declare global {
  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => Promise<void>;
    __WANJIE_AUTOMATION_BOOTSTRAPPED__?: boolean;
    __WANJIE_AUTOMATION_ENCOUNTER__?: string[];
    __WANJIE_AUTOMATION_FORCE_PROC__?: boolean;
    __WANJIE_ORIGINAL_DATE_NOW__?: () => number;
    __WANJIE_TIME_OFFSET__?: number;
  }
}
