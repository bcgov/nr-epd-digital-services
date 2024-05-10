import React, { FC } from 'react';
import './SectionHeader.css'

interface HeadingProps
{
    label: string;
}

const SectionHeader:FC<HeadingProps> = ({label}) => {
  return (
    <div className='custom-header-label'>{label}</div>
  )
}

export default SectionHeader