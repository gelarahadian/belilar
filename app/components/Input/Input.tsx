import React, {
  ChangeEvent,
  FC,
  HTMLInputTypeAttribute,
  ReactNode,
} from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  ValidationRule,
} from "react-hook-form";
import { MdClear } from "react-icons/md";

interface InputProps {
  id: string;
  type?: HTMLInputTypeAttribute;
  label?: string;
  placeholder: string;
  disabled?: boolean;
  value?: string | undefined;
  required?: boolean | string;
  pattern?: ValidationRule<RegExp>;
  register?: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
  onClear?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({
  id,
  type = "text",
  label,
  placeholder,
  value,
  disabled = false,
  required = false,
  register,
  errors,
  pattern = undefined,
  onClear,
  onChange,
}) => {
  return (
    <div className="relative text-body w-full mb-3">
      <label htmlFor={id}>{label}</label>
      <div className="flex items-center ">
        <input
          id={id}
          name={id}
          value={value}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...(register &&
            register(id, {
              required: required,
              pattern: pattern,
            }))}
          className={`border border-black w-full rounded h-10 px-4 outline-none  ${
            errors && errors[id] ? "border-red-500" : "focus:border-green-500"
          }`}
          onChange={onChange}
        />
        {onClear && (
          <button className="absolute right-4" onClick={onClear}>
            <MdClear />
          </button>
        )}
      </div>
      {errors && errors[id] && (
        <span className="absolute block text-secondaryText text-red-500 bg-white">
          {errors && errors[id] && (errors[id]?.message as ReactNode)}
        </span>
      )}
    </div>
  );
};

export default Input;
