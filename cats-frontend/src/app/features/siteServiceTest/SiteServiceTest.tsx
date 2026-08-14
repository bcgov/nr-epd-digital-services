import { FormEvent, useState } from 'react';
import PageContainer from '../../components/simple/PageContainer';
import { Button } from '../../components/button/Button';
import {
  useGetSiteByIdForServiceAsUserLazyQuery,
  useGetSiteByIdForServiceLazyQuery,
} from './SiteServiceTest.generated';
import './SiteServiceTest.css';

const formatResult = (
  error: { message: string } | undefined,
  payload: unknown,
  called: boolean,
) => {
  if (error) {
    return error.message;
  }
  if (payload) {
    return JSON.stringify(payload, null, 2);
  }
  return called ? 'No response payload' : 'Not called yet.';
};

export const SiteServiceTest = () => {
  const [siteId, setSiteId] = useState('');
  const [fetchAsService, serviceResult] = useGetSiteByIdForServiceLazyQuery();
  const [fetchAsUser, userResult] = useGetSiteByIdForServiceAsUserLazyQuery();

  const trimmedSiteId = siteId.trim();

  const onFetchAsService = (event: FormEvent) => {
    event.preventDefault();
    if (!trimmedSiteId) {
      return;
    }
    fetchAsService({ variables: { siteId: trimmedSiteId } });
  };

  const onFetchAsUser = () => {
    if (!trimmedSiteId) {
      return;
    }
    fetchAsUser({ variables: { siteId: trimmedSiteId } });
  };

  const serviceFailed =
    Boolean(serviceResult.error) ||
    serviceResult.data?.getSiteByIdForService?.success === false;
  const userFailed =
    Boolean(userResult.error) ||
    userResult.data?.getSiteByIdForServiceAsUser?.success === false;

  return (
    <PageContainer role="main">
      <div className="site-service-test">
        <h1>SITE service call</h1>
        <p>
          Same SITE query (<code>findSiteBySiteIdForService</code>) with two
          tokens. The service-account path should succeed. The logged-in user
          token should be rejected (role / <code>azp</code>).
        </p>
        <form className="site-service-test-form" onSubmit={onFetchAsService}>
          <input
            aria-label="Site ID"
            placeholder="Site ID"
            value={siteId}
            onChange={(event) => setSiteId(event.target.value)}
          />
          <Button
            type="submit"
            disabled={serviceResult.loading || !trimmedSiteId}
          >
            {serviceResult.loading ? 'Fetching…' : 'Fetch as service'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={userResult.loading || !trimmedSiteId}
            onClick={onFetchAsUser}
          >
            {userResult.loading ? 'Fetching…' : 'Fetch as logged-in user'}
          </Button>
        </form>
        <div className="site-service-test-results">
          <section>
            <h2>Service account (client credentials)</h2>
            <pre
              className={
                serviceFailed
                  ? 'site-service-test-output site-service-test-error'
                  : 'site-service-test-output'
              }
            >
              {formatResult(
                serviceResult.error,
                serviceResult.data?.getSiteByIdForService,
                serviceResult.called,
              )}
            </pre>
          </section>
          <section>
            <h2>Logged-in user token</h2>
            <pre
              className={
                userFailed
                  ? 'site-service-test-output site-service-test-error'
                  : 'site-service-test-output'
              }
            >
              {formatResult(
                userResult.error,
                userResult.data?.getSiteByIdForServiceAsUser,
                userResult.called,
              )}
            </pre>
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

export default SiteServiceTest;
