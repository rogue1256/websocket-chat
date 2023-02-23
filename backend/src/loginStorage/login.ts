import { nanoid } from "nanoid";

export class Login {
  public readonly id: string = nanoid();

  constructor(public readonly username: string, public readonly secret: string) {}
}
