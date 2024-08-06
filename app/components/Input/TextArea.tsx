import React, { FC, ReactNode } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  ValidationRule,
} from "react-hook-form";
import { MdClear } from "react-icons/md";

interface TextAreaProps {
  id: string;
  placeholder: string;
  disabled?: Boolean;
  rows?: number;
  required?: boolean | string;
  pattern?: ValidationRule<RegExp>;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  onClear?: () => void;
  label?: string;
}

const TextArea: FC<TextAreaProps> = ({
  id,
  placeholder,
  required = false,
  rows,
  register,
  errors,
  pattern = undefined,
  onClear,
  label,
}) => {
  return (
    <div className="relative text-secondaryText w-full mb-3">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        {...register(id, {
          required: required,
          pattern: pattern,
        })}
        className={`border border-black  w-full rounded-lg p-3 outline-none  ${
          errors[id] ? "border-red-500" : "focus:border-green-500"
        }`}
      ></textarea>
      {onClear && (
        <button className="absolute right-4" onClick={onClear}>
          <MdClear />
        </button>
      )}
      {errors[id] && (
        <span className="absolute block text-secondaryText text-red-500">
          {errors[id] && (errors[id]?.message as ReactNode)}
        </span>
      )}
    </div>
  );
};

export default TextArea;
