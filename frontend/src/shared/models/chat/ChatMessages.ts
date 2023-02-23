// eslint-disable-next-line max-classes-per-file
export type ReceivedMessageType = "login" | "text";

interface IdentifiedMessage {
  readonly id: string;
}

interface IncomingMessage extends IdentifiedMessage {
  readonly isBroadcast: boolean;
  readonly isOwn: boolean;
  readonly type: ReceivedMessageType;
  readonly text: string;
}

export class LoginMessage implements IncomingMessage {
  public readonly isBroadcast = true;

  public readonly isOwn = false;

  public readonly type = "login";

  constructor(public readonly id: string, public readonly username: string, public readonly location: string) {}

  public get text(): string {
    return `User ${this.username} from ${this.location} has connected`;
  }
}

export class TextMessage implements IncomingMessage {
  public readonly isBroadcast = false;

  public readonly type = "login";

  constructor(
    public readonly id: string,
    public readonly isOwn: boolean,
    private readonly message: string,
    private readonly username: string
  ) {}

  public get text(): string {
    return `${this.username}: ${this.message}`;
  }
}
