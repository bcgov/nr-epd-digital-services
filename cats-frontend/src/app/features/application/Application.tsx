import React, { useState } from "react";
import "./Application.css";

const tabs = [
  "Application",
  "Details",
  "Participants",
  "Services",
  "Timesheets",
  "Expenses",
  "Invoices",
  "Notes",
  "Associated Files",
  "Housing",
];

const Application: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Application");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <button onClick={() => (window.location.href = "/applications")}>
        Back
      </button>
      <h1>Application Component</h1>
      <ul className="tabs">
        {tabs.map((tab) => (
          <li
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {activeTab === "Application" && (
          <p>This is the Application tab content.</p>
        )}
        {activeTab === "Details" && <p>This is the Details tab content.</p>}
        {activeTab === "Participants" && (
          <p>This is the Participants tab content.</p>
        )}
        {activeTab === "Services" && <p>This is the Services tab content.</p>}
        {activeTab === "Timesheets" && (
          <p>This is the Timesheets tab content.</p>
        )}
        {activeTab === "Expenses" && <p>This is the Expenses tab content.</p>}
        {activeTab === "Invoices" && <p>This is the Invoices tab content.</p>}
        {activeTab === "Notes" && <p>This is the Notes tab content.</p>}
        {activeTab === "Associated Files" && (
          <p>This is the Associated Files tab content.</p>
        )}
        {activeTab === "Housing" && <p>This is the Housing tab content.</p>}
      </div>
    </div>
  );
};

export default Application;
