import React from 'react';
import { useNavigate } from 'react-router-dom';

function ComponentA() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/companyPanel/company-details');
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 hover:bg-gray-700 cursor-pointer"
    >
      Companies
    </div>
  );
}

export default ComponentA;
