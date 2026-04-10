"use client";

import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  children,
  className,
  ...rest
}: ButtonProps) {
  const cls = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} {...rest}>
      {icon && (
        <span
          className={`material-symbols-outlined ${styles.icon}`}
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}
