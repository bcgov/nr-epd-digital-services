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
  const location = useLocation();
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const fromScreen = location.state?.from || 'Applications'; // Default to "Unknown Screen" if no state is passed
  const fromScreenRef = useRef(fromScreen);
  const applicationId = parseInt(id, 10);
  const [isVisible, setIsVisible] = useState(false);

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
