import React, { FC } from 'react';
import './LabelComponent.css'


interface LabelProps
{
  name:string;
  value:string;
}


const LabelComponent:FC<LabelProps> = ({name,value}) => {
  return (
    <div className='label-container'>
    <span className='field-label'>{name}</span>
    <span className='field-value'>{value}</span>
   </div>
  )
}

export default LabelComponent