import React from 'react'
import CopyrightAndLanguage from './CopyrightAndLanguage'
import AppFooter from './AppFooter'
import Description from './Description'

const Footer = () => {
  return (
    <>
      <div className="bg-white py-4 border-t border-t-secondary mt-4 ">
        <div className="max-w-7xl mx-auto text-gray-500">
          <Description />
        </div>
      </div>

      <div className="max-w-7xl mx-auto text-gray-500">
        <AppFooter />
        <CopyrightAndLanguage />
      </div>
    </>
  );
}

export default Footer