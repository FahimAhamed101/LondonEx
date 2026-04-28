"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import type { AppStore } from "@/lib/redux/store";
import { makeStore } from "@/lib/redux/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
