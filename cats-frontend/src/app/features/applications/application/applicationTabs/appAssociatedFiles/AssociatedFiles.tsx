import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getBcBoxBucketIdApiUrl,
  getAxiosInstance,
  comsAccessKeyId,
  comsBcBoxBucketId,
  comsEndPoint,
  comsAccessRegion,
  comsAccessKey,
  bcBoxAppUrl,
} from '../../../../../helpers/utility';
import { Button } from '../../../../../components/button/Button';
import {
  ExternalLink,
  SpinnerIcon,
} from '../../../../../components/common/icon';

enum ButtonState {
  Loading = 'loading',
  Ready = 'ready',
  Error = 'error',
}

export const AssociatedFiles = () => {
  const [bucketUrl, setBucketUrl] = useState<string>('');
  const [buttonState, setButtonState] = useState<ButtonState>(
    ButtonState.Loading,
  );

  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);
  const axiosInstance = getAxiosInstance();

  // This should be run once when the component first mounts.
  useEffect(() => {
    axiosInstance
      .put(getBcBoxBucketIdApiUrl, {
        accessKeyId: comsAccessKeyId,
        active: true,
        bucket: comsBcBoxBucketId,
        bucketName: 'application/' + applicationId,
        endpoint: comsEndPoint,
        region: comsAccessRegion,
        secretAccessKey: comsAccessKey,
        key: 'application/' + applicationId,
      })
      .then(
        (result) => {
          if (result.data != null && result.data.bucketId != '')
            setBucketUrl(
              `${bcBoxAppUrl}/list/objects?bucketId=${result.data.bucketId}`,
            );
          setButtonState(ButtonState.Ready);
        },
        (_error) => {
          setButtonState(ButtonState.Error);
        },
      );
  }, []);

  return (
    <div>
      {buttonState === ButtonState.Loading && (
        <SpinnerIcon className="fa-spin mx-2" />
      )}
      {buttonState === ButtonState.Error && (
        <p>
          An error occurred while fetching the bucket location. Refresh to try
          again.
        </p>
      )}
      {buttonState === ButtonState.Ready && (
        <Button
          variant="primary"
          onClick={() => {
            window.open(bucketUrl, '_blank');
          }}
        >
          Open BC Box <ExternalLink />
        </Button>
      )}
    </div>
  );
};
