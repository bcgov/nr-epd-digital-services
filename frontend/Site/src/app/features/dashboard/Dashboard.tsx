import { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { RequestStatus } from "../../helpers/requests/status";
import {
  recentAssignedColumn,
  recentFoliosColumns,
  recentViewedColumns,
} from "./DashboardConfig";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Store";
import { fetchRecentViews } from "./DashboardSlice";
import { UserType } from "../../helpers/requests/userType";
import "./Dashboard.css";
import PageContainer from "../../components/simple/PageContainer";
import Widget from "../../components/widget/Widget";

interface DashboardWidgetProps {
  title?: string;
  buttonText?: string;
  columns: any[];
  loading: RequestStatus;
  data: any[];
  allowRowsSelect?:boolean;
  onButtonClick?: () => void;
}

const changeHandler = (event:any) => {
  console.log(event);
}


const DashboardTableWidget: React.FC<DashboardWidgetProps> = ({
  title,
  buttonText,
  columns,
  loading,
  data,
  allowRowsSelect,
  onButtonClick,
}) => (
  <Widget changeHandler={changeHandler} title={title} tableColumns={columns} tableData={data} tableIsLoading={loading} allowRowsSelect={allowRowsSelect}>
    { buttonText && onButtonClick && 
      <button className="dashboard-btn" type="button" onClick={onButtonClick} aria-label={buttonText} >
        <span className="btn-lbl">{buttonText}</span>
      </button>
     }
  </Widget>
);

const Dashboard = () => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<RequestStatus>(RequestStatus.loading);
  const [data, setData] = useState<any[]>([]);
  const [userType, setUserType] = useState<UserType>(UserType.External);
  const dispatch = useDispatch<AppDispatch>();
  const sites = useSelector((state: any) => state.dashboard);

  useEffect(() => {
    dispatch(fetchRecentViews("1"));
  }, [dispatch]);

  useEffect(() => {
    if (sites.status === RequestStatus.success) {
      setData(sites.dashboard.recentView.data);
      setLoading(sites.status);
      setName("First Name");
    }
  }, [sites.status]);

  const handleButtonClick = () => {
    alert("Button clicked!");
    // Additional logic can be added here
  };

  return (

    <PageContainer role="Dashboard">
      <h1 className="dashboard-title">Welcome, {name}</h1>
      <DashboardTableWidget
        title="Recently Viewed"
        columns={recentViewedColumns}
        loading={loading}
        data={data}
        allowRowsSelect={true}
      />
      <DashboardTableWidget
        title={
          userType === UserType.External
            ? "Recently Modified Folios"
            : "Sites from Applications recently assigned to me"
        }
        buttonText={
          userType === UserType.External ? "View All Folios" : "View All"
        }
        columns={
          userType === UserType.External
            ? recentFoliosColumns
            : recentAssignedColumn
        }
        loading={loading}
        data={data}
        onButtonClick={handleButtonClick}
        allowRowsSelect={userType === UserType.Internal}
      />
    </PageContainer>
  );
};


export default Dashboard;
