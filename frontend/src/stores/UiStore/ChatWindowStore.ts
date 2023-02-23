import { action, computed, makeObservable, observable, reaction } from "mobx";
import { UiStore } from "./UiStore";

export class ChatWindowStore {
  private readonly reconnectTimeoutSeconds = 10;

  private timer: NodeJS.Timer | null = null;

  public secondsLeftUntilReconnect: number = this.reconnectTimeoutSeconds;

  constructor(private readonly uiStore: UiStore) {
    makeObservable<ChatWindowStore, "decrementTimer">(this, {
      secondsLeftUntilReconnect: observable,
      reconnectBackdropShown: computed,
      cancelTimer: action,
      decrementTimer: action,
    });

    reaction(
      () => this.reconnectBackdropShown,
      (value) => {
        if (value) {
          this.launchInterval();
        } else {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }
      }
    );

    reaction(
      () => this.secondsLeftUntilReconnect,
      (value) => {
        if (value !== 0) {
          return;
        }

        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.uiStore.rootStore.ChatStore.initiateConnection();
      }
    );

    reaction(
      () => this.uiStore.rootStore.ChatStore.lastChatError,
      (val) => {
        if (this.reconnectBackdropShown && !this.timer) {
          this.launchInterval();
        }
      }
    );
  }

  public get reconnectBackdropShown(): boolean {
    return (
      !this.uiStore.loginScreenShown.get() &&
      (!this.uiStore.rootStore.ChatStore.isSocketOpen || !this.uiStore.rootStore.ChatStore.chat.isLoggedIn)
    );
  }

  public cancelTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private decrementTimer(): void {
    this.secondsLeftUntilReconnect -= 1;
  }

  private launchInterval(): void {
    this.secondsLeftUntilReconnect = this.reconnectTimeoutSeconds;
    this.timer = setInterval(() => {
      this.decrementTimer();
    }, 1000);
  }
}
