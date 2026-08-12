import React, { useMemo } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AssociatedFiles } from './applicationTabs/appAssociatedFiles/AssociatedFiles';
import { Details } from './applicationTabs/appDetails/Details';
import { Housing } from './applicationTabs/appHousing/Housing';
import { Invoices } from './applicationTabs/appInvoices/Invoices';
import { Notes } from './applicationTabs/appNotes/Notes';
import { Participants } from './applicationTabs/appParticipants/Participants';
import { Timesheets } from './applicationTabs/appTimesheets/Timesheets';
import { Application } from './applicationTabs/application/Application';
import { LinkedApplications } from './applicationTabs/appLinkedApplications/LinkedApplications';
import {
  DEFAULT_APPLICATION_TAB_PATH,
  canAccessInvoicesTab,
  isCssaAppType,
} from '../../navigation/NavigationPillsConfig';
import { useGetHeaderDetailsByApplicationIdQuery } from './ApplicationDetails.generated';

const GuardedRoute: React.FC<{
  allowed: boolean;
  loading: boolean;
  children: React.ReactElement;
}> = ({ allowed, loading, children }) => {
  // Wait for app type before redirecting — avoids kicking users off a valid tab on first paint
  if (loading) {
    return null;
  }
  if (!allowed) {
    return <Navigate to={DEFAULT_APPLICATION_TAB_PATH} replace />;
  }
  return children;
};

const ApplicationTabsRouter: React.FC = () => {
  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);

  // Same header query as ApplicationDetails — served from Apollo cache when available.
  const { data, loading } = useGetHeaderDetailsByApplicationIdQuery({
    variables: { applicationId },
    skip: !applicationId,
  });

  const appType = data?.getApplicationDetailsById.data?.appType;

  const isCssa = useMemo(() => isCssaAppType(appType), [appType]);
  const allowInvoices = useMemo(() => canAccessInvoicesTab(appType), [appType]);

  return (
    <Routes>
      <Route path="application" element={<Application />} />
      <Route
        path="details"
        element={
          <GuardedRoute allowed={isCssa} loading={loading}>
            <Details />
          </GuardedRoute>
        }
      />
      <Route
        path="linked-applications"
        element={
          <GuardedRoute allowed={isCssa} loading={loading}>
            <LinkedApplications />
          </GuardedRoute>
        }
      />
      <Route path="participants" element={<Participants />} />
      <Route
        path="timesheets"
        element={
          <GuardedRoute allowed={isCssa} loading={loading}>
            <Timesheets />
          </GuardedRoute>
        }
      />
      <Route
        path="invoices"
        element={
          <GuardedRoute allowed={allowInvoices} loading={loading}>
            <Invoices />
          </GuardedRoute>
        }
      />
      <Route path="notes" element={<Notes />} />
      <Route path="associated-files" element={<AssociatedFiles />} />
      <Route
        path="housing"
        element={
          <GuardedRoute allowed={isCssa} loading={loading}>
            <Housing />
          </GuardedRoute>
        }
      />
      {/* Redirect to the first tab by default */}
      <Route
        path="*"
        element={<Navigate to={DEFAULT_APPLICATION_TAB_PATH} replace />}
      />
    </Routes>
  );
};

export default ApplicationTabsRouter;
