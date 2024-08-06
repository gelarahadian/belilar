import React, { FC } from "react";

interface LabelProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Label: FC<LabelProps> = ({ children, onClick }) => {
  return (
    <li
      className="flex justify-center items-center px-2 h-6 bg-secondary  rounded text-secondaryText text-primary mb-1"
      onClick={() => onClick && onClick()}
    >
      {children}
    </li>
  );
};

export default Label;
