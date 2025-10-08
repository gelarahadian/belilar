import React from 'react'
import CopyrightAndLanguage from './CopyrightAndLanguage'
import AppFooter from './AppFooter'
import Description from './Description'

const Footer = () => {
  return (
    <div>
      <div className="bg-white py-4 border-t border-t-secondary mt-4 ">
        <div className="container text-gray-500">
          <Description />
        </div>
      </div>

      <div className="container mx-auto text-gray-500">
        <AppFooter />
        <CopyrightAndLanguage />
      </div>
    </div>
  );
}

export default Footer