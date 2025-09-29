import React from 'react'
import CategoryFooter from './CategoryFooter';

const AppFooter = () => {
  return (
    <div className="py-4 flex flex-wrap justify-between">
      <CategoryFooter category="Layanan Pelanggan" />
      <CategoryFooter category='Jelajahi Belilar'/>
      <CategoryFooter category='Ikuti Kami'/>
      <CategoryFooter category='Pembayaran'/>
      <CategoryFooter category='Pengiriman'/>
    </div>
  );
}

export default AppFooter