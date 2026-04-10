"use client";

import { forwardRef } from "react";
import styles from "./TextInput.module.scss";

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: "text" | "password";
  error?: boolean;
  fullWidth?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ type = "text", error = false, fullWidth = true, className, ...rest }, ref) => {
    const cls = [
      styles.input,
      error ? styles.error : "",
      fullWidth ? styles.fullWidth : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return <input ref={ref} type={type} className={cls} {...rest} />;
  }
);

TextInput.displayName = "TextInput";
export default TextInput;
