import { action, computed, makeObservable, observable } from "mobx";
import { ChatMessage } from "../../shared/models/chat";

export class Chat {
  public messages: ChatMessage[] = [];

  public serverAddress: URL | null = null;

  public messageDraft: string = "";

  public username: string | null = null;

  public secret: string | null = null;

  private loggedIn = observable.box(false);

  constructor() {
    makeObservable<Chat, "loggedIn">(this, {
      messages: observable,
      serverAddress: observable,
      messageDraft: observable,
      username: observable,
      secret: observable,
      loggedIn: observable,
      setUsername: action,
      setServerAddress: action,
      clearMessageDraft: action,
      addMessage: action,
      login: action,
      logout: action,
      isLoggedIn: computed,
      updateDraftValue: action,
      clearLoginMessages: action,
      clearSecret: action,
    });
  }

  public setUsername(username: string): void {
    this.username = username;
  }

  public setServerAddress(address: URL): void {
    this.serverAddress = address;
  }

  public clearMessageDraft(): void {
    this.messageDraft = "";
  }

  public addMessage(msg: ChatMessage): void {
    this.messages.push(msg);
  }

  public login(secret: string): void {
    this.loggedIn.set(true);
    this.secret = secret;
  }

  public logout(): void {
    this.loggedIn.set(false);
  }

  public get isLoggedIn(): boolean {
    return this.loggedIn.get();
  }

  public updateDraftValue(newValue: string): void {
    this.messageDraft = newValue;
  }

  public clearLoginMessages(): void {
    this.messages = this.messages.filter((m) => m.type !== "login");
  }

  public clearSecret(): void {
    this.secret = null;
  }
}
