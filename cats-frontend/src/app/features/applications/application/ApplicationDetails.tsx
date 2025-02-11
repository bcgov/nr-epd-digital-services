import { useEffect, useState } from "react";
import { getNavComponents } from "../../navigation/NavigationPillsConfig";
import { useAuth } from "react-oidc-context";
import { Button } from "../../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { AngleLeft } from "../../../components/common/icon";
import Actions from "../../../components/action/Actions";
import PageContainer from "../../../components/simple/PageContainer";
import NavigationPills from "../../../components/navigation/navigationpills/NavigationPills";

const ApplicationDetails = () => {
    const [navComponents, SetNavComponents] = useState<any[]>();

    const auth = useAuth();

  useEffect(() => {
    SetNavComponents(getNavComponents(true));
  }, [auth.user]);

  console.log('nupur - navComponents', navComponents);
  const navigate = useNavigate();
  const onClickBackButton = () => {
    navigate(-1);
  };


    return (
        <>
        <div className="d-flex justify-content-between align-items-center custom-sticky-header w-100">
            <div className="d-flex gap-2 flex-wrap align-items-center">
                <Button variant="secondary" onClick={onClickBackButton}>
                <AngleLeft />
                Back
                </Button>
                <div className="d-flex flex-wrap align-items-center gap-2 pe-3 custom-sticky-header-lbl">
                    Site ID:{' '}
                    <span className="custom-sticky-header-txt">{'YOUR_ID' ?? ''}</span>
                    <span className="d-flex align-items-center justify-content-center px-2 custom-dot"></span>
                </div>
                <div className="d-flex gap-2 justify-align-center pe-2 position-relative">
                    {/* For Action Dropdown*/}
                
                        <Actions
                          label="Actions"
                          items={[]}
                          onItemClick={() => {}}
                        />
                </div>
            </div>
            </div>
              

        
      <PageContainer role="details">
        <NavigationPills
          components={navComponents}
        />
      </PageContainer>
    </>
  );
};

export default ApplicationDetails;