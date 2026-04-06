import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button 
        className="p-1.5 rounded-md text-muted-foreground opacity-50" 
        aria-label="Toggle Dark Mode"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-500" />
      ) : (
        <Moon className="h-4 w-4 text-sky-500" />
      )}
    </button>
  );
}
