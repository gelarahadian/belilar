import React, { FC } from 'react'

interface CategoryFooterProps {
    category: string
}

const CategoryFooter: FC<CategoryFooterProps> = ({category}) => {
  return (
    <div>
      <h5 className="font-semibold text-sm mb-2">{category}</h5>
      <ul className="space-y-2">
        <li className="text-xs">
          <a href="#">Lorem Ipsum</a>
        </li>
        <li className="text-xs">
          <a href="#">Lorem Ipsum</a>
        </li>
        <li className="text-xs">
          <a href="#">Lorem Ipsum</a>
        </li>
        <li className="text-xs">
          <a href="#">Lorem Ipsum</a>
        </li>
        <li className="text-xs">
          <a href="#">Lorem Ipsum</a>
        </li>
        <li className="text-xs">
          <a href="#">Lorem Ipsum</a>
        </li>
      </ul>
    </div>
  );
}

export default CategoryFooter