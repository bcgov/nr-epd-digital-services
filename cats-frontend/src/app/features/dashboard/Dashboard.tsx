import { useEffect, useState } from 'react';
import { RequestStatus } from '../../helpers/requests/status';
import './Dashboard.css';
import PageContainer from '../../components/simple/PageContainer';
import Widget from '../../components/widget/Widget';
import { getUser } from '../../helpers/utility';
import { useGetRecentViewedApplicationsQuery } from './graphql/dashboard.generated';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/button/Button';
import { FileCirclePlusIcon } from '../../components/common/icon';

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
  data,
  onButtonClick,
}) => {
  return (
    <Widget
      hideTable={true}
      title="Recent"
      widgeLabelContainerCss={'custom-dashboard-widget-lbl'}
    >
      {data && data.length > 0 ? (
        <div className="dashboard-card-container">
          {[...data]?.reverse()?.map((application: any, index: number) => (
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
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const loggedInUser = getUser();
  const [name, setName] = useState('');
  const { data, loading: recentViewedLoading } =
    useGetRecentViewedApplicationsQuery({
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
      {!recentViewedLoading && (
        <DashboardCardsWidget
          data={data?.getRecentViewedApplications?.data || []}
          onButtonClick={handleRecentViewClick}
        />
      )}
    </PageContainer>
  );
};

export default Dashboard;
