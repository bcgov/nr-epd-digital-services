import React from 'react'
import { getSiteSearchResultsColumns } from '../dto/Columns'
import { TableColumn } from '../../../components/table/TableColumn';
import './Column.css'

interface ColumnProps {
  toggleColumnSelectionForDisplay: (item: TableColumn) => void;
  columns: TableColumn[];
  reset:() => void;
  close:() => void;
}

const Column:React.FC<ColumnProps> = ({toggleColumnSelectionForDisplay,columns,reset, close}) => {

  console.log('child updated ',columns)

  const filterColumnsByGroup = (groupId:number) =>
  {
       return columns.filter(item=>item.groupId === groupId && item.dynamicColumn === false);
  }

  const columnItem = (item:TableColumn,index:number) => {
    return (
      <div key={index} className="column-item more-gap">
      <input type="checkbox" className='checkbox-color'  aria-label={item.displayName}  aria-checked={item.isChecked ? "true" : "false"}  disabled={item.disabled} checked={item.isChecked} onChange={(e)=>{toggleColumnSelectionForDisplay(item)}} />
      {item.displayName}
  </div>
    )
  }

  return (
    <div className='column-section'>      
        <div className="row">
          <div className="col-12 col-sm-6 col-md-3">
          {filterColumnsByGroup(1).map((item,index)=>{
                 return columnItem(item,index)
            })}
          </div>
          <div className="col-12 col-sm-6 col-md-3">
          {filterColumnsByGroup(2).map((item,index)=>{
                return columnItem(item,index)
            })}
          </div>
          <div className="col-12 col-sm-6 col-md-3">
          {filterColumnsByGroup(3).map((item,index)=>{
                 return columnItem(item,index)
            })}
          </div>
          <div className=" col-12 col-sm-6 col-md-3">
          {filterColumnsByGroup(4).map((item,index)=>{
                 return columnItem(item,index)
            })}
          </div>            
        </div>
        <div className='row'>
          <div className='col-12'>
              <input type='button' value={'Reset Columns'} className='reset-btn' onClick={()=>{ reset()}} ></input>
              <input type='button' value="Close" className='close-btn' onClick={()=>{ close() }} ></input> 
          </div>

        </div>
    </div>
 



  )
}

export default Column