import { FC, ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "../common/icon";

interface PanelWithUpDownProps {
  label?: string;
  firstChild?:ReactNode;
  secondChild?: ReactNode; // Define children prop
}

const PanelWithUpDown: FC<PanelWithUpDownProps> = ({ label, firstChild, secondChild }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="d-flex flex-column section-container" role="region" aria-label={label || "Section"} aria-expanded={showDetails}>
      {
        label && 
         <div className="d-flex w-100 justify-content-between">
           <div className="w-100 section-content-label">
             { label }
           </div>
           <button
             className="border-0 bg-white"
             onClick={() => setShowDetails(!showDetails)}
             aria-label={showDetails ? "Collapse section" : "Expand section"}
             aria-expanded={showDetails}
           >
             {showDetails ? <ChevronUp /> : <ChevronDown />}
           </button>
         </div>
      }
      { 
       !label && !showDetails &&  
          <div className="d-flex align-items-center">
            { firstChild }  
            <button className="border-0 bg-white" onClick={() => setShowDetails(!showDetails)} aria-label="Expand section">
              <ChevronDown />
            </button>
          </div>
      }
      {
        showDetails && 
          <div className="d-flex position-relative">
              <div className="w-100 ">
                { secondChild }
              </div>
                {
                  showDetails && !label && (
                   <div className="position-absolute end-0">
                     <div className="mt-4">
                       <button className="border-0 bg-white" onClick={() => setShowDetails(!showDetails)} aria-label="Collapse section">
                         <ChevronUp />
                       </button>
                     </div>
                   </div>
                )}
          </div>
      }
    </div>
  );
};

export default PanelWithUpDown;
