import { useEffect, useState, useRef } from 'react';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate, useParams, Outlet } from 'react-router-dom';
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
import NavigationBar from '../../../components/navigation-bar/NavigationBar';
import { UserType } from '../../../helpers/requests/userType';
import { useGetHeaderDetailsByApplicationIdQuery } from './ApplicationDetails.generated';
import styles from './ApplicationDetails.module.css';
import LoadingOverlay from '../../../components/loader/LoadingOverlay';
import cx from 'classnames';

const ApplicationDetails = () => {
  const [edit, setEdit] = useState(false);
  const [viewMode, setViewMode] = useState(UserMode.Default);
  const [isVisible, setIsVisible] = useState(false);
  const [save, setSave] = useState(false);
  const [userType, setUserType] = useState<UserType>(UserType.STAFF);
  const location = useLocation();
  const fromScreen = location.state?.from || 'Applications'; // Default to "Unknown Screen" if no state is passed
  const fromScreenRef = useRef(fromScreen);
  const auth = useAuth();
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);

  const { data, loading } = useGetHeaderDetailsByApplicationIdQuery({
    variables: {
      applicationId,
    },
    skip: !applicationId,
  });

  const application = data?.getApplicationDetailsById.data;

  const onClickBackButton = () => {
    navigate(`/${fromScreenRef.current.replace(/\s+/g, '').toLowerCase()}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY; // Get current scroll position
      const threshold = 50; // Set a custom threshold, for example, 100px
      if (
        scrollPosition === 0 ||
        scrollPosition === undefined ||
        scrollPosition <= 5
      ) {
        setIsVisible(false);
        return;
      }

      if (scrollPosition > threshold && !isVisible) {
        setIsVisible(true); // Show header after scrolling past 100px
      } else if (scrollPosition <= threshold && isVisible) {
        setIsVisible(false); // Hide header when scrolling back up
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]); // Depend on `isVisible` so we update when visibility changes

  const handleItemClick = async (value: string) => {
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
        setViewMode(UserMode.Default);
        break;
      case UserAction.CANCEL: // Cancel the changes
        setViewMode(UserMode.Default);
        break;
      default:
        break;
    }
  };

  const appId = application?.id?.toString() ?? '';
  const appDescription = application?.appType?.description ?? '';
  const { siteId, siteAddress, siteCity } = application || {};
  const parts: string[] = [];

  // Add (siteId) — assuming it's a number or string
  if (siteId !== null && siteId !== undefined) {
    parts.push(`(${siteId})`);
  }

  // Prepare address and city block
  const locationParts: string[] = [];

  if (siteAddress && String(siteAddress).trim()) {
    locationParts.push(String(siteAddress).trim());
  }

  if (siteCity && String(siteCity).trim()) {
    locationParts.push(String(siteCity).trim());
  }

  // Join address + city with comma
  const siteLocation = locationParts.join(', ');

  // Push to main parts array if location is present
  if (siteLocation) {
    parts.push(siteLocation);
  }

  const siteDescription: string = parts.join(' ');

  const navigationBarChildern = (
    <>
      {viewMode === UserMode.Default && userType === UserType.STAFF && (
        <Actions
          label="Actions"
          items={ActionItems}
          onItemClick={handleItemClick}
        />
      )}
      <div className="gap-3 align-items-center d-none d-md-flex d-lg-flex d-xl-flex">
        {viewMode === UserMode.EditMode && userType === UserType.STAFF && (
          <>
            {id && <CustomLabel labelType="c-b" label={`${'Edit Mode'}`} />}
            <SaveButton clickHandler={() => handleItemClick(UserAction.SAVE)} />
            <CancelButton
              variant="secondary"
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
                label: UserAction.SAVE,
                value: UserAction.SAVE,
              },
              {
                label: UserAction.CANCEL,
                value: UserAction.CANCEL,
              },
            ]}
            onItemClick={handleItemClick}
          />
        </div>
      )}
    </>
  );

  const showNavigationBar = isVisible && id;

  const navigationBarText =
    (appId || appDescription || siteDescription) && showNavigationBar ? (
      <div className="d-flex flex-column gap-1">
        {(appId || appDescription) && (
          <div>
            <span
              className={cx(styles.applicationIdLbl, styles.applicationLbl)}
            >
              {appId}
            </span>
            <span className={cx(styles.customDot, 'px-2')}>•</span>
            <span
              className={cx(styles.applicationTypeLbl, styles.applicationLbl)}
            >
              {appDescription}
            </span>
          </div>
        )}
        {siteDescription && (
          <div>
            <span
              className={cx(
                styles.applicationAddressLbl,
                styles.applicationLbl,
              )}
            >
              {siteDescription}
            </span>
          </div>
        )}
      </div>
    ) : null;

  if (loading) {
    return <LoadingOverlay loading={loading} />;
  }

  return (
    <div className={styles.applicationDetailContainer}>
      <NavigationBar
        isVisible={isVisible}
        onClickBackButton={onClickBackButton}
        backButtonProps={{ variant: 'secondary' }}
        backButtonText={`Back to ${fromScreenRef.current}`}
        navigationBarText={navigationBarText}
        childern={navigationBarChildern}
      />
      <PageContainer
        customContainerClass={styles.applicationPageContainer}
        role="details"
      >
        {(appId || appDescription || siteDescription) && (
          <div className={`gap-3 row ${isVisible ? 'invisible' : ''}`}>
            {(appId || appDescription) && (
              <div className="d-flex flex-column gap-1 flex-wrap">
                {appId && <CustomLabel label={appId} labelType="r-h5" />}
                {appDescription && (
                  <CustomLabel label={appDescription} labelType="b-h1" />
                )}
              </div>
            )}
            {siteDescription && (
              <CustomLabel label={siteDescription} labelType="r-h5" />
            )}
          </div>
        )}
        <NavigationPills />
        <div className="mt-4">
          <Outlet />
        </div>
      </PageContainer>
    </div>
  );
};

export default ApplicationDetails;
