import { useEffect, useState } from 'react';
import { RequestStatus } from '../../helpers/requests/status';
import { recentViewedColumns } from './DashboardConfig';
import { useSelector } from 'react-redux';
import { UserType } from '../../helpers/requests/userType';
import './Dashboard.css';
import PageContainer from '../../components/simple/PageContainer';
import Widget from '../../components/widget/Widget';
import { getUser } from '../../helpers/utility';

interface DashboardWidgetProps {
  title?: string;
  buttonText?: string;
  columns: any[];
  loading: RequestStatus;
  data: any[];
  allowRowsSelect?: boolean;
  onButtonClick?: () => void;
}

const changeHandler = (event: any) => {};

const DashboardTableWidget: React.FC<DashboardWidgetProps> = ({
  title,
  buttonText,
  columns,
  loading,
  data,
  allowRowsSelect,
  onButtonClick,
}) => (
  <Widget
    changeHandler={changeHandler}
    title={title}
    tableColumns={columns}
    tableData={data}
    tableIsLoading={loading}
    allowRowsSelect={allowRowsSelect}
    primaryKeycolumnName="siteId"
  >
    {buttonText && onButtonClick && (
      <button
        className="dashboard-btn"
        type="button"
        onClick={onButtonClick}
        aria-label={buttonText}
      >
        <span className="btn-lbl">{buttonText}</span>
      </button>
    )}
  </Widget>
);

const Dashboard = () => {
  const sites = useSelector((state: any) => state.dashboard);
  const loggedInUser = getUser();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState<RequestStatus>(RequestStatus.loading);
  const [data, setData] = useState<any[]>([]);
  const [userType, setUserType] = useState<UserType>(UserType.External);

  useEffect(() => {
    if (loggedInUser?.profile.preferred_username?.indexOf('bceid') !== -1) {
      setUserType(UserType.External);
    } else if (
      loggedInUser?.profile.preferred_username?.indexOf('idir') !== -1
    ) {
      setUserType(UserType.Internal);
    } else {
      // not logged in
      setUserType(UserType.External);
    }

    loggedInUser
      ? setName(', ' + loggedInUser?.profile.given_name + ' ')
      : setName('');
  }, [loggedInUser]);

  useEffect(() => {
    if (sites.status === RequestStatus.success) {
      setData(sites.dashboard.recentView.data);
      setLoading(sites.status);
    } else {
      setLoading(RequestStatus.idle);
    }
  }, [sites.status]);

  return (
    <PageContainer role="Dashboard">
      <h1 className="dashboard-title">Welcome{name}</h1>
      <DashboardTableWidget
        title="Recently Viewed"
        columns={recentViewedColumns}
        loading={loading}
        data={data ?? []}
        allowRowsSelect={true}
      />
    </PageContainer>
  );
};

export default Dashboard;
