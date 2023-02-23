import { UiStore } from "./UiStore";
import { action, computed, makeObservable, observable, reaction } from "mobx";

export class LoginFormStore {
  public showLoginError: boolean = false;

  constructor(public uiStore: UiStore) {
    makeObservable(this, {
      showLoginError: observable,
      loginInProgress: computed,
      hideError: action,
      loginError: computed,
    });

    reaction(
      () => this.uiStore.rootStore.ChatStore.lastChatError,
      (value) => {
        this.hideError();
        if (!value) {
          return;
        }

        this.showLoginError = true;
      }
    );
  }

  public get loginInProgress(): boolean {
    const tryingToLogin =
      this.uiStore.rootStore.ChatStore.isSocketOpen &&
      !this.uiStore.rootStore.ChatStore.chat.isLoggedIn &&
      this.uiStore.rootStore.ChatStore.lastChatError === null;

    return this.uiStore.rootStore.ChatStore.isSocketConnecting || tryingToLogin;
  }

  public hideError(): void {
    this.showLoginError = false;
  }

  public get loginError(): string | null {
    const lastError = this.uiStore.rootStore.ChatStore.lastChatError;
    switch (lastError) {
      case "abnormalDisconnect":
        return "Could not connect to the server. Check your internet connection or if the server is reachable.";
      case "loginAlreadyExists":
        return `The login you are using is already taken by someone on this server. 
        Please try another login or wait for the login to be released.`;
      default:
        return null;
    }
  }
}
