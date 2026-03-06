"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { getDayTheme, getDayThemeClass, type DayTheme } from "@/lib/day-theme";

const DayThemeContext = createContext<DayTheme>(null);

export function useDayTheme() {
  return useContext(DayThemeContext);
}

export function DayThemeProvider({ children }: { children: React.ReactNode }) {
  const [dayTheme, setDayTheme] = useState<DayTheme>(null);

  useEffect(() => {
    const theme = getDayTheme();
    setDayTheme(theme);

    const cls = getDayThemeClass();
    if (cls) {
      document.documentElement.classList.add(cls);
    }

    return () => {
      if (cls) {
        document.documentElement.classList.remove(cls);
      }
    };
  }, []);

  return (
    <DayThemeContext.Provider value={dayTheme}>
      {children}
    </DayThemeContext.Provider>
  );
}
