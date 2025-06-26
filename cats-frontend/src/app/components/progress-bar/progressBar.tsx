import React from 'react';

interface ProgressBarProps {
  inputValue: number;
}

const CustomProgressBar: React.FC<ProgressBarProps> = ({ inputValue }) => {
  const max = 160;
  const percentage = (Math.min(inputValue, max) / max) * 100;
  const actualPercentage = (inputValue / max) * 100;

  const getColorForProgressBar = (value: number): string => {
    if (value > 160) return '#000000'; // black
    if (value > 120) return '#FF0000'; // red
    if (value > 80) return '#FFBF00'; // amber
    if (value > 40) return '#FFFF00'; // yellow
    return '#00FF00'; // green
  };

  const getTextColorForProgressBar = (value: number): string => {
    if (value > 160) return 'white';
    if (value > 120) return 'white';
    if (value > 80) return 'white';
    if (value > 40) return 'black';
    return 'white'; // green
  };

  return (
    <div className="d-flex align-items-center justify-content-start gap-3 w-100">
      <div
        className="flex-grow-1"
        style={{
          backgroundColor: '#e0e0e0',
          borderRadius: 4,
          overflow: 'hidden',
          height: 24,
        }}
      >
        <div
          title={`${inputValue}`}
          style={{
            width: `${percentage}%`,
            backgroundColor: getColorForProgressBar(inputValue), // fix here
            height: '100%',
            textAlign: 'center',
            alignContent: 'center',
            color: getTextColorForProgressBar(inputValue),
            fontWeight: 500,
          }}
        >
          {Math.round(actualPercentage)}%
        </div>
      </div>
    </div>
  );
};

export default CustomProgressBar;
