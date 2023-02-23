import { useContext } from "react";

import { createContext } from "react";
import { RootStore, Store } from "./RootStore";

export const RootStoreContext = createContext<RootStore>(Store);

export const useRootStore = (): RootStore => {
  const rootContext = useContext(RootStoreContext);

  if (!rootContext) {
    throw new Error(`Component must be rendered within the <${RootStoreContext.displayName}> provider`);
  }

  return rootContext;
};
