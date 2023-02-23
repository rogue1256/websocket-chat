import { RootStore } from "../RootStore";
import { LoginFormStore } from "./LoginFormStore";
import { action, IObservableValue, makeObservable, observable } from "mobx";
import { ChatWindowStore } from "./ChatWindowStore";

export class UiStore {
  public LoginFormStore: LoginFormStore;
  public ChatWindowStore: ChatWindowStore;
  public loginScreenShown: IObservableValue<boolean> = observable.box(true);

  constructor(public rootStore: RootStore) {
    this.LoginFormStore = new LoginFormStore(this);
    this.ChatWindowStore = new ChatWindowStore(this);

    makeObservable(this, {
      LoginFormStore: observable,
      ChatWindowStore: observable,
      loginScreenShown: observable,
      setLoginScreenShown: action,
    });
  }

  public setLoginScreenShown(shown: boolean): void {
    this.loginScreenShown.set(shown);
  }
}
