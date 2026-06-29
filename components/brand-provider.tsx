"use client";

import * as React from "react";

type BrandTheme = "neutral" | "twitter" | "claude" | "supabase";

interface BrandContextType {
  theme: BrandTheme;
  setTheme: (theme: BrandTheme) => void;
}

const BrandContext = React.createContext<BrandContextType | undefined>(
  undefined,
);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<BrandTheme>("neutral");

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("brand-theme") as BrandTheme;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const setTheme = (newTheme: BrandTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("brand-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <BrandContext.Provider value={{ theme, setTheme }}>
      {children}
    </BrandContext.Provider>
  );
}

export const useBrandTheme = () => {
  const context = React.useContext(BrandContext);
  if (context === undefined) {
    throw new Error("useBrandTheme must be used within a BrandProvider");
  }
  return context;
};
