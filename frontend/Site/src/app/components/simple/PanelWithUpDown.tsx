import { FC, ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "../common/icon";

interface PanelWithUpDownProps {
  label: string;
  children: ReactNode; // Define children prop
}

const PanelWithUpDown: FC<PanelWithUpDownProps> = ({ label, children }) => {
  const [showDetails, setShowDetails] = useState(true);
  return (
    <div className="section-container">
      <div className="section-container-header">
        <div className="section-container-label">
          <span className="section-content-label">{label}</span>
        </div>
        <div>
          {showDetails ? (
            <ChevronUp
              onClick={() => {
                setShowDetails(false);
              }}
            />
          ) : (
            <ChevronDown
              onClick={() => {
                setShowDetails(true);
              }}
            />
          )}
        </div>
      </div>
      {showDetails && children}
    </div>
  );
};

export default PanelWithUpDown;
