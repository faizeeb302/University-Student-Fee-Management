// components/ClientOnlySelect.js
"use client"
import Select from 'react-select';
import React from 'react';

const ClientOnlySelect = (props) => {
  return <Select {...props} />;
};

export default ClientOnlySelect;
