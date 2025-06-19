import { useEffect, useState } from 'react';
import { RequestStatus } from '../../helpers/requests/status';
import './Dashboard.css';
import PageContainer from '../../components/simple/PageContainer';
import Widget from '../../components/widget/Widget';
import { getUser } from '../../helpers/utility';
import { useGetApplicationsQuery, useGetRecentViewedApplicationsQuery } from './graphql/dashboard.generated';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/button/Button';
import { FileCirclePlusIcon } from '../../components/common/icon';
import { actionRequiredColumns } from './DashboardConfig';

interface DashboardWidgetProps {
  title?: string;
  buttonText?: string;
  columns?: any[];
  loading?: RequestStatus;
  data?: any[];
  allowRowsSelect?: boolean;
  onButtonClick?: (card?: any) => void;
}

export const DashboardCardsWidget: React.FC<DashboardWidgetProps> = ({
  title,
  data,
  onButtonClick,
}) => {
  return (
    <Widget
      hideTable={true}
      title={title}
      widgetLabelContainerCss={'custom-dashboard-widget-lbl'}
    >
      {data && data.length > 0 ? (
        <div className="dashboard-card-container">
          {data?.map((application: any, index: number) => (
            <div
              key={index}
              className="dashboard-card"
              onClick={() => onButtonClick?.(application)}
            >
              <div className="dashboard-card-title">
                {application?.applicationType?.trim() || ''}
              </div>
              <div className="dashboard-card-id">
                {application?.siteId || ''}
              </div>
              <div className="dashboard-card-address">
                {application?.address?.trim() || ''}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="dashboard-error-container">
          <div className="dashboard-error-message">
            <p className="dashboard-error-details">
              No recent applications visited by user.
            </p>
          </div>
        </div>
      )}
    </Widget>
  )
}

export const DashboardActionRequiredWidget: React.FC<DashboardWidgetProps> = ({
  title,
  columns,
  loading,
  data,
}) => {
  return (
    <Widget
      title={title}
      tableColumns={columns || []}
      tableIsLoading={loading}
      tableData={data}
      hideTable={false}
      widgetLabelContainerCss={'custom-dashboard-widget-lbl'}
      filter={<div className="d-flex justify-content-end">
       <Link to="/applications" className="dashboard-view-all-link">
          View All
        </Link>
      </div>}
    />
  );
}
const Dashboard = () => {
  const navigate = useNavigate();
  const loggedInUser = getUser();
  const [name, setName] = useState('');
  const {data: recentViewedData, loading: recentViewedLoading} = useGetRecentViewedApplicationsQuery({
    fetchPolicy: 'network-only', // <-- Force server fetch on each mount
  });

  const { data: actionRequiredData, loading: actionRequiredLoading } = useGetApplicationsQuery({
    fetchPolicy: 'network-only', // <-- Force server fetch on each mount
  });

  useEffect(() => {
    loggedInUser
      ? setName(', ' + loggedInUser?.profile.given_name + ' ')
      : setName('');
  }, [loggedInUser]);

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
        <span className="dashboard-btn-text">New Application</span>
      </Button>
      {!recentViewedLoading && <DashboardCardsWidget data={recentViewedData?.getRecentViewedApplications?.data || []} onButtonClick={handleRecentViewClick} title={'Recent'} />}
      <DashboardActionRequiredWidget data={actionRequiredData?.getApplications?.data || []} title={'Action Required'} columns={actionRequiredColumns} />
    </PageContainer>
  );
};

export default Dashboard;
