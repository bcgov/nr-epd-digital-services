import React, { FC } from "react";
import "./CustomLabel.css";

interface HeadingProps {
  label: string;
  labelType: string;
}

const CustomLabel: FC<HeadingProps> = ({ label, labelType }) => {
  if (labelType === "b-h1") {
    return <span className="custom-header-bold-h1">{label}</span>;
  } else if (labelType === "b-h5") {
    return <span className="custom-header-bold-h5">{label}</span>;
  } else if (labelType === "r-h5") {
    return <span className="custom-label-regular-h5">{label}</span>;
  } else if (labelType === "c-b") {
    return <span className="custom-bold-label">{label}</span>;
  } else {
    return <span className="custom-header-h5">{label}</span>;
  }
};

export default CustomLabel;
