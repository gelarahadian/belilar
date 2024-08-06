"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import { FieldErrors, FieldValues, UseFormSetValue } from "react-hook-form";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  id: string;
  options: Option[];
  setValue: UseFormSetValue<FieldValues>;
  label: string;
  defaultValue?: Option;
  disabled?: Boolean;
  required?: boolean | string;
  errors: FieldErrors;
  onClear?: () => void;
}

const Select: FC<SelectProps> = ({
  id,
  label,
  options,
  defaultValue,
  setValue,
  required = false,
  errors,
  onClear,
}) => {
  const [focus, setFocus] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    defaultValue ? defaultValue : undefined
  );
  const selectRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setFocus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  const handleClick = (option: Option) => {
    setSelectedOption(option);
    setValue(id, option.value);
    setFocus(false);
    onClear && onClear();
  };
  return (
    <div
      ref={selectRef}
      id={id}
      onClick={() => setFocus(!focus)}
      className={`flex items-center justify-between relative border border-black h-8 w-full rounded-lg px-4 mb-3 outline-none text-secondaryText ${
        errors[id] ? "bg-red-50" : focus ? "border-green-500" : ""
      }`}
    >
      {selectedOption ? (
        <div className="text-nowrap overflow-hidden">
          {selectedOption.label}
        </div>
      ) : (
        <div className="text-nowrap overflow-hidden">{label}</div>
      )}
      <MdOutlineKeyboardArrowDown
        className={`${
          focus ? "rotate-180" : "rotate-0"
        } transition-all duration-200 ease-in-out`}
      />
      {focus && (
        <div
          className={`absolute top-9 left-0 bg-white border ${
            focus ? "z-10" : "-z-50"
          } border-black w-full shadow rounded max-h-96 overflow-y-scroll `}
          style={{ scrollbarWidth: "none" }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleClick(option)}
              className="px-4 py-2 hover:bg-slate-200 transition-all duration-300 ease-linear cursor-pointer border-b border-black "
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
