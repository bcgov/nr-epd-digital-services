import styles from './Details.module.css';
import cx from 'classnames';
import CollapsiblePanel from '../../../../../components/simple/CollapsiblePanel';

export const Details = () => {
  return (
    <CollapsiblePanel
      defaultOpen={true}
      label="Application Information"
      content={
        <div className={styles.rowsContainer}>
          <div className={cx(styles.row, styles.rowGrid6)}>
            <div className={styles.cell}>
              <label>Application ID</label>
              <div>18326</div>
            </div>
            <div className={styles.cell}>
              <label>CSAP Reference #</label>
              <div>000000000000</div>
            </div>
            <div className={styles.cell}>
              <label>Priority</label>
              <div>1</div>
            </div>
            <div className={styles.cell}>
              <label>Housing</label>
              <div>✓</div>
            </div>
            <div className={styles.cell}>
              <label>Tax Exempt</label>
              <div>✓</div>
            </div>
          </div>

          <div className={cx(styles.row, styles.rowGrid6)}>
            <div className={styles.cell}>
              <label>Received</label>
              <div>Mon Jul 08 2024</div>
            </div>
            <div className={styles.cell}>
              <label>Queued</label>
              <div>Mon Jul 08 2024</div>
            </div>
            <div className={styles.cell}>
              <label>Completed</label>
              <div>Fri Nov 15 2024</div>
            </div>
            <div className={styles.cell}>
              <label>Outcome</label>
              <div>Not Satisfactory</div>
            </div>
          </div>

          <div className={cx(styles.row, styles.rowGrid2)}>
            <div className={styles.cell}>
              <label>Application Type</label>
              <div>Notice of Independent Remediation</div>
            </div>
            <div className={styles.cell}>
              <label>Status</label>
              <div>Review in Progress: Caseworker</div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.cell}>
              <label>Site Type</label>
              <div>Lorem Ipsum Dolor Sit Amet</div>
            </div>
            <div className={styles.cell}>
              <label>Review Process</label>
              <div>Ministry</div>
            </div>
          </div>
        </div>
      }
    />
  );
};
