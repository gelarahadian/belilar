import React from 'react'
import CopyrightAndLanguage from './CopyrightAndLanguage'
import AppFooter from './AppFooter'
import Description from './Description'

const Footer = () => {
  return (
    <div className='max-w-7xl mx-auto text-gray-500'>
      <Description/>
      <AppFooter/>
      <CopyrightAndLanguage/>
    </div>
  )
}

export default Footer