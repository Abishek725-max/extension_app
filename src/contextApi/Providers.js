import { NextUIProvider } from "@nextui-org/react";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export default function Providers({ children }) {
  const [isClient, setIsClient] = useState(false);

  // Only render components that require the window object after mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a fallback component
  }

  return (
    <NextUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={true}
        themes={["light", "dark"]}
      >
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
