import React, { ReactNode } from "react";
import "./Pagination.css";
import { AngleLeft, AngleRight } from "../../../components/common/icon";

interface PaginationProps {
  selectPage: (pageNumber:number) => void;
  currentPage: number;
  resultsPerPage: number;
  totalResults: number;
  changeResultsPerPage: (resultsCount: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  selectPage,
  currentPage,
  resultsPerPage,
  totalResults,
  changeResultsPerPage
}) => {

   // Define breakpoints
const breakpoints = {
  small: 576,
  medium: 768,
  large: 992,
  extraLarge: 1200
};

// Function to check current viewport size against breakpoints
function getCurrentBreakpoint() {
  const width = window.innerWidth;
  if (width < breakpoints.small) {
    return 'small';
  } else if (width < breakpoints.medium) {
    return 'medium';
  } else if (width < breakpoints.large) {
    return 'large';
  } else {
    return 'extraLarge';
  }
}


  let  pagesToDisplay = 5;

  if(getCurrentBreakpoint() === 'small')
    {
      pagesToDisplay = 3;
    }

  const totalPagesRequired = Math.ceil(totalResults / resultsPerPage);

  const onlyOnePage = totalPagesRequired === 1;

  const showDotsLeft = (currentPage - 1) > 1 ;
  
 

  // More Pages Required
  const morePagesToDisplay = totalPagesRequired > pagesToDisplay ;

  let maxPagesToRender = 0;

    if (morePagesToDisplay )
    {
        maxPagesToRender =  (currentPage + pagesToDisplay )- 1;
    }
    else
    {
        maxPagesToRender = totalPagesRequired;
    }

    if(maxPagesToRender > totalPagesRequired)
    {
        maxPagesToRender = totalPagesRequired ;
    }

  const showDotsRight =  (( totalPagesRequired -  maxPagesToRender)) > 1;
  const showNextFivePage = (totalPagesRequired - currentPage ) > pagesToDisplay;
  const lastPage = (totalPagesRequired-maxPagesToRender) === 1;
  const firstPage = (currentPage-1) === 1;

  console.log("totalPagesRequired",totalPagesRequired);
  console.log("morePagesToDisplay",morePagesToDisplay);
  console.log("maxPagesToRender",maxPagesToRender);
  console.log("showDotsRight",showDotsRight);
  console.log("showDotsLeft",showDotsLeft);


  const paginationDots = (  <span className="pagination-dots">...</span>);

  const page = (pageNumber: number) => {
    return <div onClick={()=>selectPage(pageNumber)} className={`pagination-page ${currentPage === pageNumber ? 'pagination-page-active' : ''}`}>{pageNumber}</div>;

  };


  const renderDotsAndLastPage = () => {

    return (
        <React.Fragment>
          {paginationDots}
          <div className="pagination-section">{page(totalPagesRequired)}</div>
          <AngleRight className="pagination-page" onClick={()=>selectPage(currentPage+1)} />
        </React.Fragment>
    )

  }

  const renderDotsAndFirstPage = () => {

    return (
        <React.Fragment>
          <AngleLeft className="pagination-page" onClick={()=>selectPage(currentPage-1)}/>        
          <div className="pagination-section">{page(1)}</div>
          {paginationDots}
        </React.Fragment>
    )

  }

  const renderNextSetPages = (currentPage: number): ReactNode => {
      const pages: JSX.Element[] = [];
      console.log("renderNextSetPages");

      let pagesCount = maxPagesToRender-currentPage;
      let startPage = currentPage;
      if(pagesCount != 0 && pagesCount <( pagesToDisplay-1))
      {
        if(maxPagesToRender > pagesToDisplay)
          {
        startPage = currentPage - ( pagesToDisplay - pagesCount);

        if(startPage < 1)
            {
                startPage = 1;
            }
          }
      }
      else if (pagesCount == 0 && currentPage > pagesToDisplay)
      {

          if(currentPage - pagesToDisplay > 0)
          {
              startPage = currentPage - pagesToDisplay;
          }
          else
          {
            startPage = 1;
          }
      }
      else 
      {
        startPage = 2;
      }

      console.log("startPage",startPage)
      
      for (let i = startPage ; i <= maxPagesToRender; i++) {
          pages.push(<div key={i} className="pagination-section">{page(i)}</div>);
      } 
  
      return (
          <React.Fragment>
              {pages}
          </React.Fragment>
      );
  };

  const pageSelectOptions = (): ReactNode =>{
    const pages: JSX.Element[] = [];

    for (let i = 1 ; i <= totalPagesRequired; i++) {
        pages.push(<option key={i}>{i}</option>);
    }
    
    return pages;
  }
  
  return (
    <div className="pagination-control">
      <div className="pagination-pages">
        {onlyOnePage ? (
          <div className="pagination-section">{page(1)}</div>
        ) :  (
          <React.Fragment>
 { !showDotsLeft && firstPage ? ( <div className="pagination-section">{page(1)}</div>) : null }    

          {showDotsLeft ? renderDotsAndFirstPage() : null}
          {renderNextSetPages(currentPage)}
          {showDotsRight ? renderDotsAndLastPage() : null}
          { !showDotsRight && lastPage ? ( <div className="pagination-section">{page(totalPagesRequired)}</div>) : null }
          </React.Fragment>
        )}
      </div>
      <div className="pagination-result-options">
        <div className="result-options-section">
        <span>Results per page</span>
        <select className="reslect-options-select" onChange={(e)=>{changeResultsPerPage(parseInt(e.target.value))}}>
          <option>5</option>
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
        </div>
        
        <div className="result-options-section">
        <span>Jump To</span>
        <select className="reslect-options-select" value={currentPage} onChange={(e)=>{selectPage(parseInt(e.target.value))}}>
          
         {pageSelectOptions()}
          
        
        </select>
        </div>
        
      </div>
    </div>
  );
};

export default Pagination;
