import React from 'react'
import { getSiteSearchResultsColumns } from '../dto/Columns'

const Column = () => {

  const columns = getSiteSearchResultsColumns();

  const filterColumnsByGroup = (groupId:number) =>
  {
       return columns.filter(item=>item.groupId === groupId);
  }

  
  console.log(columns);

  return (
    <div>
        <div>Column</div>
        <div className="row">
            {columns.map((item,index)=>{
                return ( <div key={index}>
                    {item.displayName}
                </div>)
            })}
        </div>
    </div>
 



  )
}

export default Column