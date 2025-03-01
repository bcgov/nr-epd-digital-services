import { useEffect, useState } from 'react';
import { getNavComponents } from '../../navigation/NavigationPillsConfig';
import { useAuth } from 'react-oidc-context';
import { Button } from '../../../components/button/Button';
import { useNavigate } from 'react-router-dom';
import { AngleLeft } from '../../../components/common/icon';
import Actions from '../../../components/action/Actions';
import PageContainer from '../../../components/simple/PageContainer';
import NavigationPills from '../../../components/navigation/navigationpills/NavigationPills';
import CustomLabel from '../../../components/simple/CustomLabel';
import { ActionItems } from '../../../components/action/ActionsConfig';
import {
  CancelButton,
  SaveButton,
} from '../../../components/simple/CustomButtons';
import { UserMode } from '../../../helpers/requests/userMode';
import { UserAction } from '../../../helpers/requests/UserAction';

const ApplicationDetails = () => {
  const [edit, setEdit] = useState(false);
  const [viewMode, setViewMode] = useState(UserMode.Default);
  const [isVisible, setIsVisible] = useState(false);
  const [save, setSave] = useState(false);
  const navComponents = getNavComponents(true);

  const auth = useAuth();

  const navigate = useNavigate();
  const onClickBackButton = () => {
    navigate(-1);
  };

  useEffect(() => {
    console.log('nupur - window.scrollY is: ', window.scrollY);
    const handleScroll = () => {
      if (window.scrollY > 5) {
        // Adjust the scroll position as needed
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleItemClick = async (value: string) => {
    console.log('nupur - handleItemClick value is: ', value);
    switch (value) {
      case UserMode.Default:
        setEdit(false);
        setViewMode(UserMode.Default);
        break;
      case UserMode.EditMode:
        setEdit(true);
        setViewMode(UserMode.EditMode);
        break;
      case UserAction.SAVE:
        setSave(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {isVisible && (
        <div className="d-flex justify-content-between align-items-center custom-sticky-header w-100">
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <Button variant="secondary" onClick={onClickBackButton}>
              <AngleLeft />
              Back
            </Button>
            <div className="d-flex flex-wrap align-items-center gap-2 pe-3 custom-sticky-header-lbl">
              <span className="custom-sticky-header-txt">{'1234567890'}</span>
              <span className="d-flex align-items-center justify-content-center px-2 custom-dot">
                .
              </span>
              <div className="custom-sticky-header-lbl">
                <span>{'1234-1456 Vancouver'}</span>
              </div>
            </div>
          </div>
          <div className="d-flex gap-2 justify-align-center pe-2 position-relative">
            {/* For Action Dropdown*/}
            {!edit && viewMode === UserMode.Default && (
              <Actions
                label="Actions"
                items={ActionItems}
                onItemClick={handleItemClick}
              />
            )}

            {/* For Edit */}
            <div className="gap-3 align-items-center d-none d-md-flex d-lg-flex d-xl-flex">
              {edit && (
                <>
                  <CustomLabel labelType="c-b" label={UserMode.EditMode} />
                  <SaveButton
                    variant="secondary"
                    clickHandler={() => handleItemClick(UserAction.SAVE)}
                    // isDisabled={savedChanges?.length > 0 ? false : true}
                  />
                  <CancelButton
                    clickHandler={() => {
                      handleItemClick(UserAction.CANCEL);
                    }}
                  />
                </>
              )}
            </div>
            {edit && (
              <div className="d-flex d-md-none d-lg-none d-xl-none">
                <Actions
                  label="Actions"
                  items={[
                    {
                      label: 'Save',
                      value: 'save',
                    },
                    {
                      label: 'Cancel',
                      value: 'cancel',
                    },
                  ]}
                  onItemClick={handleItemClick}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <PageContainer role="details">
        {!isVisible && (
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={onClickBackButton}>
              <AngleLeft /> Back to
            </Button>
            <div className="d-flex gap-2 justify-align-center pe-2 pos-relative">
              {/* For Action Dropdown*/}
              {!edit && viewMode === UserMode.Default && (
                <Actions
                  label="Actions"
                  items={ActionItems}
                  onItemClick={handleItemClick}
                />
              )}

              <div className="gap-3 align-items-center d-none d-md-flex d-lg-flex d-xl-flex">
                {edit && (
                  <>
                    <CustomLabel labelType="c-b" label={UserMode.EditMode} />
                    <SaveButton
                      variant="secondary"
                      clickHandler={() => handleItemClick(UserAction.SAVE)}
                    />
                    <CancelButton
                      clickHandler={() => handleItemClick(UserAction.CANCEL)}
                    />
                  </>
                )}
              </div>

              {viewMode === UserMode.EditMode && (
                <div className="d-flex d-md-none d-lg-none d-xl-none">
                  <Actions
                    label="Actions"
                    items={[
                      {
                        label: 'Save',
                        value: 'save',
                      },
                      {
                        label: 'Cancel',
                        value: 'cancel',
                      },
                    ]}
                    onItemClick={handleItemClick}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="section-details-header row">
          <div>
            <CustomLabel label="1234456" labelType="r-h5" />
          </div>
          <div>
            <CustomLabel
              label="Notice of Independent Remediation"
              labelType="b-h1"
            />
          </div>
          <div>
            <CustomLabel
              label="(12345) 1435-1438 Frances Street, Vancouver"
              labelType="r-h5"
            />
          </div>
        </div>

        <NavigationPills
          components={navComponents}
          tabSearchKey="applicationTab"
        />
      </PageContainer>
    </>
  );
};

export default ApplicationDetails;
