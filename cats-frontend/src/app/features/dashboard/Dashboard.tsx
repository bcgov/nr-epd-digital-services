import { useEffect, useState } from 'react';
import './Dashboard.css';
import PageContainer from '../../components/simple/PageContainer';
import Widget from '../../components/widget/Widget';
import { getUser } from '../../helpers/utility';
import {
  useGetApplicationsQuery,
  useGetRecentViewedApplicationsQuery,
} from './graphql/dashboard.generated';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/button/Button';
import { FileCirclePlusIcon } from '../../components/common/icon';
import { actionRequiredColumns } from './DashboardConfig';
import { DashboardWidgetProps } from './IDashboard';

/**
 * A widget that displays a list of cards.
 * The cards are clickable and when clicked, the `onButtonClick` callback is called with the application data as an argument.
 * @param {{title: string, data: any[], onButtonClick: (card: any) => void}} props
 * @return {JSX.Element}
 */
export const DashboardCardsWidget: React.FC<DashboardWidgetProps> = ({
  title,
  data,
  onButtonClick,
}) => {
  return (
    <Widget
      // Hide the table
      hideTable={true}
      // Set the title
      title={title}
      // Set a custom CSS class for the label container
      widgetLabelContainerCss={'custom-dashboard-widget-lbl'}
    >
      {/* If there are applications, render them as cards */}
      {data && data.length > 0 ? (
        <div className="dashboard-card-container">
          {[...data]?.reverse()?.map((application: any, index: number) => (
            <div
              key={index}
              className="dashboard-card"
              onClick={() => onButtonClick?.(application)}
            >
              {/* Application type */}
              <div className="dashboard-card-title">
                {application?.applicationType?.trim() || ''}
              </div>
              {/* Application ID */}
              <div className="dashboard-card-id">
                {application?.siteId || ''}
              </div>
              {/* Application address */}
              <div className="dashboard-card-address">
                {application?.address?.trim() || ''}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* If there are no applications, display a message */
        <div className="dashboard-error-container">
          <div className="dashboard-error-message">
            <p className="dashboard-error-details">
              No recent applications visited by user.
            </p>
          </div>
        </div>
      )}
    </Widget>
  );
};

/**
 * A widget that displays a table with action required applications.
 * @param {{title: string, columns: any[], loading: RequestStatus, data: any[]}} props
 * @return {JSX.Element}
 */
export const DashboardActionRequiredWidget: React.FC<DashboardWidgetProps> = ({
  title,
  columns,
  loading,
  data,
}) => {
  return (
    <Widget
      // Set the title for the widget
      title={title}
      // Set the columns for the table
      tableColumns={columns || []}
      // Set the loading state for the table
      tableIsLoading={loading}
      // Set the data for the table
      tableData={data}
      // Hide the table
      hideTable={false}
      // Set a custom CSS class for the label container
      widgetLabelContainerCss={'custom-dashboard-widget-lbl'}
      // Set a custom filter for the widget
      filter={
        <div className="d-flex justify-content-end">
          <Link to="/applications" className="dashboard-view-all-link">
            View All
          </Link>
        </div>
      }
    />
  );
};

/**
 * The main dashboard component.
 * @return {JSX.Element} The dashboard page content.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const loggedInUser = getUser();
  const [name, setName] = useState('');

  /**
   * Fetch the recent viewed applications.
   * Using the `network-only` fetch policy to force a server fetch on each mount.
   */
  const { data: recentViewedData, loading: recentViewedLoading } =
    useGetRecentViewedApplicationsQuery({
      fetchPolicy: 'network-only', // <-- Force server fetch on each mount
    });

  /**
   * Fetch the action required applications.
   * Using the `network-only` fetch policy to force a server fetch on each mount.
   */
  const { data: actionRequiredData, loading: actionRequiredLoading } =
    useGetApplicationsQuery({
      fetchPolicy: 'network-only', // <-- Force server fetch on each mount
    });

  useEffect(() => {
    // Set the user's name
    loggedInUser
      ? setName(', ' + loggedInUser?.profile.given_name + ' ')
      : setName('');
  }, [loggedInUser]);

  /**
   * Handle the click event on the recent viewed applications.
   * @param {any} data The application data.
   */
  const handleRecentViewClick = (data: any) => {
    navigate(`/applications/${data?.applicationId}`, {
      state: {
        from: 'Dashboard',
      },
    });
  };

  return (
    <PageContainer role="Dashboard">
      <h1 className="dashboard-title">Welcome{name}</h1>
      <Button
        className="dashboard-btn justify-content-center"
        variant="primary"
        size="medium"
        onClick={() => {}}
      >
        <span className="dashboard-btn-icon">
          <FileCirclePlusIcon />
        </span>
        <span className="dashboard-btn-text">Create New Site</span>
      </Button>
      {/* Display the recent viewed applications widget */}
      {!recentViewedLoading && (
        <DashboardCardsWidget
          data={recentViewedData?.getRecentViewedApplications?.data || []}
          onButtonClick={handleRecentViewClick}
          title={'Recent'}
        />
      )}
      {/* Display the action required applications widget */}
      {!actionRequiredLoading && (
        <DashboardActionRequiredWidget
          data={actionRequiredData?.getApplications?.data || []}
          title={'Action Required'}
          columns={actionRequiredColumns}
        />
      )}
    </PageContainer>
  );
};

export default Dashboard;
