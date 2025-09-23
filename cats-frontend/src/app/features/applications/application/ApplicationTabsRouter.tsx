import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AssociatedFiles } from './applicationTabs/appAssociatedFiles/AssociatedFiles';
import { Details } from './applicationTabs/appDetails/Details';
import { Housing } from './applicationTabs/appHousing/Housing';
import { Invoices } from './applicationTabs/appInvoices/Invoices';
import { Notes } from './applicationTabs/appNotes/Notes';
import { Participants } from './applicationTabs/appParticipants/Participants';
import { Timesheets } from './applicationTabs/appTimesheets/Timesheets';
import { Application } from './applicationTabs/application/Application';

const ApplicationTabsRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="application" element={<Application />} />
      <Route path="details" element={<Details />} />
      <Route path="participants" element={<Participants />} />
      <Route path="timesheets" element={<Timesheets />} />
      <Route path="invoices" element={<Invoices />} />
      <Route path="notes" element={<Notes />} />
      <Route path="associated-files" element={<AssociatedFiles />} />
      <Route path="housing" element={<Housing />} />
      {/* Redirect to the first tab by default */}
      <Route path="*" element={<Navigate to="application" replace />} />
    </Routes>
  );
};

export default ApplicationTabsRouter;
