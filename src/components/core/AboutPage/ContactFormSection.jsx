import React from 'react';
import { ContactUsForm } from '../../contactUs/ContactUsForm';

const ContactFormSection = () => {
  return (
    <div className='mx-auto'>
      <h1 className='text-center text-4xl font-semibold'>
        Get in Touch
      </h1>
      <p className='text-center text-[#838894] mt-3'>
        We would love to here for you, Please fill out this form.
      </p>
      <div>
        <ContactUsForm />
      </div>
    </div>
  )
};

export { 
    ContactFormSection
};