import React, { FC } from 'react'
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from './Pagination';
import {Product} from '@/context/product';

interface ListProductProps {
    currentPage: number;
    totalPages: number;
    products: Product[]
}
const ListProduct: FC<ListProductProps>  = ({currentPage, totalPages, products}) => {
  return (
    <div className="mt-4 ">
      <div className="w-full text-center py-3 border-b-secondary border-b mb-4 bg-white">
        <h1 className="text-xl font-light text-secondary text-center">
          REKOMENDASI
        </h1>
      </div>
      <ul className="flex justify-start flex-wrap gap-[6px]">
        {products &&
          products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </ul>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

export default ListProduct