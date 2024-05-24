import React, { FC } from 'react';
import './SectionHeader.css'

interface HeadingProps
{
    label: string;
    headingtype: string;
}

const SectionHeader:FC<HeadingProps> = ({label,headingtype}) => {

    if(headingtype==='page')
    {
      return (  <div className='custom-header-label'>{label}</div>)
    }
    else
    {
     return ( <div className='custom-header-label'>{label}</div> )    
    }

  }

export default SectionHeader