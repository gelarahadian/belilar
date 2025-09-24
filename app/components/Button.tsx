import React, { FC } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  variant?: "default" | "info" | "danger" | "grey" | "border" | "border-danger";
  className?: string;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "default",
  className,
}) => {
  let classVariant = "";

  if (variant === "default") {
    classVariant = "text-white bg-secondary hover:bg-secondary/90";
  } else if (variant === "info") {
    classVariant = "text-white bg-blue-500 hover:bg-blue-500/90";
  } else if (variant === "danger") {
    classVariant = "text-white bg-red-500 hover:bg-red-500/90";
  } else if (variant === "grey") {
    classVariant = "text-white bg-grey hover:bg-grey/90";
  } else if (variant === "border") {
    classVariant =
      " border border-secondary hover:bg-secondary/10 text-secondary";
  } else if (variant === "border-danger") {
    classVariant = " border border-red-500 hover:bg-red-500/10 text-red-500";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`text-sm rounded-lg px-4 py-1 font-semibold text-center text-nowrap transition-all duration-200 ease-linear ${classVariant} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
