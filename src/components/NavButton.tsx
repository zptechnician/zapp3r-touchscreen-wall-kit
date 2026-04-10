import type { ReactNode } from "react";

interface NavButtonProps {
  onClick: () => void;
  children: ReactNode;
  icon: ReactNode;
  iconPosition?: "left" | "right";
  variant?: "light" | "dark" | "inverted";
}

const NavButton = ({
  onClick,
  children,
  icon,
  iconPosition = "left",
  variant = "light",
}: NavButtonProps) => {
  const base =
    "touch-press inline-flex items-center gap-3 min-h-[56px] px-6 py-3 rounded-[4px] text-sm font-semibold transition-colors";

  const variantStyles: Record<string, string> = {
    dark: "bg-cta text-cta-foreground border border-cta active:bg-cta-active",
    light: "bg-background border border-primary text-primary active:bg-primary/5",
    inverted: "bg-transparent text-white border border-white active:bg-white/10",
  };

  const styles = variantStyles[variant];

  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      {iconPosition === "left" && icon}
      {children}
      {iconPosition === "right" && icon}
    </button>
  );
};

export default NavButton;
