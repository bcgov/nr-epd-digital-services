import { useEffect, useState } from "react";
import { getNavComponents } from "../../navigation/NavigationPillsConfig";
import { useAuth } from "react-oidc-context";
import { Button } from "../../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { AngleLeft } from "../../../components/common/icon";
import Actions from "../../../components/action/Actions";
import PageContainer from "../../../components/simple/PageContainer";
import NavigationPills from "../../../components/navigation/navigationpills/NavigationPills";
import CustomLabel from "../../../components/simple/CustomLabel";

const ApplicationDetails = () => {
    //const [navComponents, SetNavComponents] = useState<any[]>();
    const navComponents = getNavComponents(true);
  
    const auth = useAuth();

   // console.log('nupur - auth and navComponentsData: ', auth.user, ": ", navComponentsData);


  // useEffect(() => {
  
  //   SetNavComponents(navComponentsData);
  // }, [navComponentsData]);

  // useEffect(() => {
  //   console.log('Nupur D - navComponents', navComponents);
  // },[navComponents]);

  
  console.log('nupur - getNavComponents(true)', getNavComponents(true));
  //console.log('nupur - navComponents', navComponents);

  const navigate = useNavigate();
  const onClickBackButton = () => {
    navigate(-1);
  };



    return (
        <>
        {/* <div className="d-flex justify-content-between align-items-center custom-sticky-header w-100"> */}
        <PageContainer role="details">
          <div className="d-flex justify-content-between">
          
              <Button variant="secondary" onClick={onClickBackButton}>
                <AngleLeft /> Back to
              </Button>
                <div className="d-flex gap-2 justify-align-center pe-2 pos-relative">
                    {/* For Action Dropdown*/}
                
                    <Actions
                      label="Actions"
                      items={[]}
                      onItemClick={() => {}}
                    />
                </div>
          </div>

          <div className="section-details-header row">
            <div>
              <CustomLabel label='1234456' labelType="r-h5" />
              
            </div>
            <div>
              <CustomLabel label="Notice of Independent Remediation" labelType="b-h1" />
            </div>
            <div>
              <CustomLabel label='(12345) 1435-1438 Frances Street, Vancouver' labelType="r-h5" />
            </div>
          </div>
              
          <NavigationPills
            components={navComponents}
          />
      </PageContainer>
    </>
  );
};

export default ApplicationDetails;