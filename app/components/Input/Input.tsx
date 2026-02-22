import React, { FC, ReactNode, useState } from "react";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { MdClear } from "react-icons/md";
import { HiExclamationCircle } from "react-icons/hi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  helperText?: string;
  register?: UseFormRegister<FieldValues>;
  errors?: FieldErrors<FieldValues>;
  onClear?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  validation?: RegisterOptions<FieldValues, string>;
}

const Input: FC<InputProps> = ({
  id,
  label,
  helperText,
  register,
  errors,
  onClear,
  className,
  leftIcon,
  rightIcon,
  disabled,
  required,
  validation,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!errors?.[id];
  const errorMessage = errors?.[id]?.message as ReactNode;

  const borderColor = hasError
    ? "border-red-400 focus-within:ring-red-100 focus-within:border-red-500"
    : isFocused
      ? "border-primary-500 focus-within:ring-primary-100"
      : "border-gray-200 hover:border-gray-300";

  return (
    <div className="w-full mb-4">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-semibold mb-1.5 transition-colors duration-150 ${
            hasError
              ? "text-red-500"
              : isFocused
                ? "text-primary-600"
                : "text-gray-700"
          }`}
        >
          {label}
          {required && (
            <span className="text-secondary-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {/* Input Wrapper */}
      <div
        className={`
          flex items-center gap-2 w-full
          bg-white border rounded-xl px-3.5 h-11
          ring-4 ring-transparent
          transition-all duration-200
          ${borderColor}
          ${disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : ""}
        `}
      >
        {/* Left Icon */}
        {leftIcon && (
          <span
            className={`flex-shrink-0 text-lg ${hasError ? "text-red-400" : "text-gray-400"}`}
          >
            {leftIcon}
          </span>
        )}

        {/* Input */}
        <input
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...register?.(id, validation)}
          {...rest}
          className={`
            flex-1 min-w-0 bg-transparent outline-none
            text-sm text-gray-800 placeholder:text-gray-400
            disabled:cursor-not-allowed
            ${className ?? ""}
          `}
        />

        {/* Right: error icon / custom icon / clear button */}
        {hasError ? (
          <HiExclamationCircle className="flex-shrink-0 text-red-400 text-lg" />
        ) : rightIcon ? (
          <span className="flex-shrink-0 text-gray-400 text-lg">
            {rightIcon}
          </span>
        ) : null}

        {onClear && !hasError && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Hapus isian"
            className="flex-shrink-0 p-0.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
          >
            <MdClear className="text-base" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {hasError && errorMessage && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-[fadeIn_0.15s_ease]"
        >
          <HiExclamationCircle className="text-sm flex-shrink-0" />
          {errorMessage}
        </p>
      )}

      {/* Helper Text */}
      {!hasError && helperText && (
        <p id={`${id}-helper`} className="mt-1.5 text-xs text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
