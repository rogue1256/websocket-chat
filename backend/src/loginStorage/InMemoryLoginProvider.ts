import { LoginProvider } from "./loginProvider";
import { Login } from "./login";
import { createDefaultLogger } from "../logging";
import { emptyCollectionSize, MINUTES_TO_SECONDS_RATIO, SECONDS_TO_MILLISECONDS_RATIO } from "../helpers";

const logger = createDefaultLogger("InMemory Login Provider");

const LOGIN_LIFETIME_MINUTES = 10;
const LOGIN_LIFETIME_MS: number = LOGIN_LIFETIME_MINUTES * MINUTES_TO_SECONDS_RATIO * SECONDS_TO_MILLISECONDS_RATIO;

const QUERY_INTERVAL_SECONDS = 10;
const QUERY_INTERVAL_MILLISECONDS = QUERY_INTERVAL_SECONDS * SECONDS_TO_MILLISECONDS_RATIO;

interface TimestampedEntity<T extends Login> {
  accessedAt: Date;
  entity: T;
}

// todo: there is a better way to handle data access on each read/write
export class InMemoryLoginProvider implements LoginProvider {
  private readonly storage: Map<string, TimestampedEntity<Login>> = new Map<string, TimestampedEntity<Login>>();

  private interval: NodeJS.Timer | null = null;

  public addLogin(username: string, secret: string): Login {
    const storedLogin = this.searchLogin(username);
    if (storedLogin) {
      throw new Error("Duplicated login");
    }

    if (!this.interval) {
      this.startInterval();
    }
    const newLogin = new Login(username, secret);
    this.storage.set(newLogin.id, { accessedAt: new Date(), entity: newLogin });
    return newLogin;
  }

  public findLogin(username: string): Login | null {
    const login = this.searchLogin(username);
    if (!login) {
      return null;
    }

    return login.entity;
  }

  public removeLogin(id: string): boolean {
    logger.debug(`Removing login with id ${id}`);
    return this.storage.delete(id);
  }

  public secretBelongsToUsername(username: string, secret: string): boolean {
    const storedLogin = this.searchLogin(username);
    if (!storedLogin) {
      return false;
    }

    return storedLogin.entity.secret === secret;
  }
  public loginAccessed(username: string): void {
    const login = this.searchLogin(username);
    if (login) {
      logger.debug(`Login for ${username} has been accessed and last time was updated`);
      login.accessedAt = new Date();
    }
  }

  private searchLogin(username: string): TimestampedEntity<Login> | null {
    for (const mapEntry of this.storage.entries()) {
      const [, login] = mapEntry;
      if (login.entity.username === username) {
        return login;
      }
    }

    return null;
  }

  private startInterval(): void {
    this.interval = setInterval(() => this.handleIntervalCheck(), QUERY_INTERVAL_MILLISECONDS);
  }

  private handleIntervalCheck(): void {
    logger.debug("Starting login provider cleanup");
    if (this.storage.size === emptyCollectionSize && this.interval) {
      logger.debug("Database is empty, no cleanup needed");
      logger.debug("Stopping interval timer");
      clearInterval(this.interval);
      this.interval = null;
      logger.debug("Cleared interval");
      return;
    }

    logger.debug("Checking if any logins should be cleared");
    const keyListToDelete: string[] = [];
    for (const entry of this.storage.entries()) {
      const [key, loginEntry] = entry;
      if (new Date().getTime() - loginEntry.accessedAt.getTime() > LOGIN_LIFETIME_MS) {
        keyListToDelete.push(key);
      }
    }

    logger.debug("Removing following keys", keyListToDelete);
    for (const key of keyListToDelete) {
      this.storage.delete(key);
    }
  }
}
