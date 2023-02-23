import { ChatStore } from "./ChatStore";
import { UiStore } from "./UiStore/UiStore";

export class RootStore {
  public ChatStore: ChatStore;

  public UiStore: UiStore;

  constructor() {
    this.ChatStore = new ChatStore(this);
    this.UiStore = new UiStore(this);
  }
}

export const Store = new RootStore();
