import { formatDateUTC } from '../../../../../helpers/utility';
import type { GetSdsDisclosurePreviewQuery } from './SdsDisclosurePreview.generated';
import styles from './SdsDisclosurePreview.module.css';

export type SdsDisclosure = NonNullable<
  NonNullable<
    GetSdsDisclosurePreviewQuery['getSdsDisclosurePreview']['data']
  >['disclosure']
>;

type SdsDisclosureDetailsProps = {
  disclosure?: SdsDisclosure | null;
};

const formatDisclosureDate = (value?: string | null): string =>
  value ? formatDateUTC(value, 'yyyy/MM/dd') : '';

export const SdsDisclosureDetails: React.FC<SdsDisclosureDetailsProps> = ({
  disclosure,
}) => {
  const schedule2References = disclosure?.schedule2References ?? [];

  const dateFields = [
    { label: 'Date Received', value: disclosure?.siteRegDateRecd },
    { label: 'Date Completed', value: disclosure?.dateCompleted },
    { label: 'Local Authority Received', value: disclosure?.localAuthDateRecd },
    { label: 'Date Registrar Received', value: disclosure?.rwmDateDecision },
    { label: 'Date Entered', value: disclosure?.siteRegDateEntered },
  ];

  const commentFields = [
    {
      label:
        'Provide a brief summary of the planned activity and proposed land use at the site.',
      value: disclosure?.plannedActivityComment,
    },
    {
      label:
        'Indicate the information used to complete this site disclosure statement including a list of record searches completed.',
      value: disclosure?.siteDisclosureComment,
    },
    {
      label:
        'List any past or present government orders, permits, approvals, certificates or notifications pertaining to the environmental condition of the site.',
      value: disclosure?.govDocumentsComment,
    },
  ];

  return (
    <>
      <dl className={styles.dates}>
        {dateFields.map((field) => (
          <div className={styles.dateField} key={field.label}>
            <dt className={styles.fieldLabel}>{field.label}</dt>
            <dd
              className={styles.fieldValue}
              data-testid={`sds-date-${field.label}`}
            >
              {formatDisclosureDate(field.value)}
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.block}>
        <h3 className={styles.blockHeading}>
          III Commercial and Industrial Purposes or Activities on Site
        </h3>
        {schedule2References.length ? (
          <table className={styles.scheduleTable} data-testid="sds-schedule2">
            <thead>
              <tr>
                <th scope="col">Schedule 2 Reference</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {schedule2References.map((reference) => (
                <tr key={reference.code}>
                  <td>{reference.code}</td>
                  <td>{reference.description ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.empty} data-testid="sds-schedule2-empty">
            No Schedule 2 references.
          </p>
        )}
      </div>

      <div className={styles.block}>
        <h3 className={styles.blockHeading}>
          IV Additional Comments and Explanations
        </h3>
        {commentFields.map((field) => (
          <div className={styles.commentField} key={field.label}>
            <p className={styles.fieldLabel}>{field.label}</p>
            <p
              className={styles.commentValue}
              data-testid={`sds-comment-${field.label}`}
            >
              {field.value ?? ''}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
