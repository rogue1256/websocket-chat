import { Login } from "./login";

export interface LoginProvider {
  findLogin: (username: string) => Login | null;
  addLogin: (username: string, secret: string) => Login;
  removeLogin: (id: string) => boolean;
  secretBelongsToUsername: (username: string, secret: string) => boolean;
  loginAccessed: (username: string) => void;
}
