import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Col,
  Collapse,
  Container,
  Form,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import formsCatalog from './forms-catalog.json';
import './FormsIntake.css';

const INTAKE_API =
  import.meta.env.VITE_INTAKE_API ||
  window?._env_?.VITE_INTAKE_API ||
  'http://localhost:4006';

type CatalogForm = {
  name: string;
  copy?: string;
  url: string;
  formId: string;
  appType: string;
  pilot?: boolean;
};

const catalogForms = formsCatalog.forms as CatalogForm[];
const pilotForm =
  catalogForms.find((f) => f.pilot && f.formId) ?? catalogForms.find((f) => f.formId);

type IntakeResult = {
  message?: string;
  catsApplicationId?: number | null;
  catsIntegrated?: boolean;
  submission?: {
    _id: string;
    form: string;
    data?: {
      _intake?: { chefsSubmissionId?: string };
    };
  };
};

function getChefsSubmissionId(result: IntakeResult): string | null {
  return result.submission?.data?._intake?.chefsSubmissionId ?? null;
}

type IntakeHealth = {
  status: string;
  catsIntegrationEnabled: boolean;
  catsApi: string | null;
};

type ChefsSubmissionSummary = {
  submissionId: string;
  createdAt: string | null;
  label: string;
};

async function postIntake<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${INTAKE_API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? JSON.stringify(data));
  }
  return data;
}

async function getIntake<T>(path: string): Promise<T> {
  const res = await fetch(`${INTAKE_API}${path}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? JSON.stringify(data));
  }
  return data;
}

/**
 * Intake forms demo — CHEFS catalog + NOM pilot ingest → CATS Applications.
 */
const FormsIntake = () => {
  const [health, setHealth] = useState<IntakeHealth | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [latestLoading, setLatestLoading] = useState(false);
  const [chefsResult, setChefsResult] = useState<IntakeResult | null>(null);
  const [chefsError, setChefsError] = useState<string | null>(null);

  const [listVisible, setListVisible] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [chefsSubmissions, setChefsSubmissions] = useState<
    ChefsSubmissionSummary[]
  >([]);
  const [ingestingId, setIngestingId] = useState<string | null>(null);

  const [demoSiteId, setDemoSiteId] = useState('100001');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<IntakeResult | null>(null);
  const [demoError, setDemoError] = useState<string | null>(null);

  const [chefsFormsOpen, setChefsFormsOpen] = useState(false);

  useEffect(() => {
    fetch(`${INTAKE_API}/intake/health`)
      .then((res) => res.json())
      .then((data: IntakeHealth) => setHealth(data))
      .catch(() =>
        setHealthError(
          `Cannot reach intake adapter at ${INTAKE_API}. Start backend/applications (port 4006).`,
        ),
      );
  }, []);

  const ingestChefsSubmission = async (submissionId: string) => {
    if (!pilotForm?.formId) {
      return;
    }
    setChefsError(null);
    setChefsResult(null);
    setIngestingId(submissionId);
    try {
      const result = await postIntake<IntakeResult>('/intake/chefs/submit', {
        chefsFormId: pilotForm.formId,
        chefsSubmissionId: submissionId,
      });
      setChefsResult(result);
    } catch (e: any) {
      setChefsError(e.message);
    } finally {
      setIngestingId(null);
    }
  };

  const runLatestChefsSubmit = async () => {
    setChefsError(null);
    setChefsResult(null);
    setLatestLoading(true);
    try {
      const result = await postIntake<IntakeResult>('/intake/chefs/submit-latest');
      setChefsResult(result);
      setListVisible(false);
    } catch (e: any) {
      setChefsError(e.message);
    } finally {
      setLatestLoading(false);
    }
  };

  const loadChefsSubmissions = async () => {
    setListVisible(true);
    setListLoading(true);
    setChefsError(null);
    try {
      const data = await getIntake<{ submissions: ChefsSubmissionSummary[] }>(
        '/intake/chefs/submissions?limit=10',
      );
      setChefsSubmissions(data.submissions ?? []);
    } catch (e: any) {
      setChefsError(e.message);
      setChefsSubmissions([]);
    } finally {
      setListLoading(false);
    }
  };

  const runDemoSubmit = async () => {
    if (!pilotForm?.formId) {
      return;
    }
    setDemoError(null);
    setDemoResult(null);
    setDemoLoading(true);
    try {
      const result = await postIntake<IntakeResult>('/intake/submit', {
        formId: pilotForm.formId,
        data: {
          hdnAppType: pilotForm.appType,
          siteIdNumber: demoSiteId,
          applicationId: 0,
        },
      });
      setDemoResult(result);
    } catch (e: any) {
      setDemoError(e.message);
    } finally {
      setDemoLoading(false);
    }
  };

  const renderIntakeSuccess = (result: IntakeResult) => {
    const chefsSubmissionId = getChefsSubmissionId(result);
    const noChanges = result.message?.includes('No changes since last ingest');
    const catsFailed = result.catsApplicationId == null && result.catsIntegrated;
    const variant = noChanges ? 'info' : catsFailed ? 'warning' : 'success';
    return (
      <Alert variant={variant} className="mt-3">
        {result.message}
        {chefsSubmissionId && (
          <div>
            CHEFS submission: <code>{chefsSubmissionId}</code>
          </div>
        )}
        {result.catsApplicationId != null && (
          <div>
            CATS application ID: <strong>{result.catsApplicationId}</strong>
            {' — '}
            <Link to={`/applications/${result.catsApplicationId}`}>
              Open in Applications
            </Link>
          </div>
        )}
        {catsFailed && (
          <div className="mt-1 small">
            The CHEFS data is in the adapter; fix CATS config/seeds and click the
            green button again to retry.
          </div>
        )}
      </Alert>
    );
  };

  return (
    <Container className="mt-4 mb-5 forms-intake">
      <h1>Intake forms</h1>

      {healthError && <Alert variant="danger">{healthError}</Alert>}
      {health && !health.catsIntegrationEnabled && (
        <Alert variant="warning">
          CATS integration is off. Set{' '}
          <code>CATS_INTEGRATION_ENABLED=true</code> in the intake adapter.
        </Alert>
      )}

      <div className="forms-intake-step-header d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <h2 className="forms-intake-h2 mb-0">1. Submit in CHEFS</h2>
        <Button
          variant={chefsFormsOpen ? 'outline-primary' : 'primary'}
          size="sm"
          className="forms-intake-toggle-btn"
          onClick={() => setChefsFormsOpen((open) => !open)}
          aria-expanded={chefsFormsOpen}
          aria-controls="chefs-forms-list"
        >
          {chefsFormsOpen
            ? 'Hide form list'
            : `Show all forms (${catalogForms.length})`}
        </Button>
      </div>

      {!chefsFormsOpen && pilotForm?.url && (
        <p className="text-muted small mb-3">
          Demo:{' '}
          <Button
            href={pilotForm.url}
            target="_blank"
            rel="noreferrer"
            variant="link"
            size="sm"
            className="p-0 align-baseline"
          >
            Open NOM in CHEFS
          </Button>
        </p>
      )}

      <Collapse in={chefsFormsOpen}>
        <div id="chefs-forms-list">
          <p className="text-muted">
            Open the form in CHEFS, complete it, and submit. CHEFS URLs for forms
            without a link will be added here later.
          </p>
          <ListGroup className="mb-0">
            {catalogForms.map((form) => {
              const hasUrl = Boolean(form.url?.trim());
              return (
                <ListGroup.Item
                  key={form.name}
                  className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2"
                >
                  <div>
                    <strong>{form.name}</strong>
                    {form.pilot && (
                      <Badge bg="primary" className="ms-2">
                        Demo
                      </Badge>
                    )}
                    {form.appType && (
                      <Badge bg="secondary" className="ms-1">
                        {form.appType}
                      </Badge>
                    )}
                    {form.copy && (
                      <div className="small text-muted mt-1">{form.copy}</div>
                    )}
                  </div>
                  {hasUrl ? (
                    <Button
                      href={form.url}
                      target="_blank"
                      rel="noreferrer"
                      variant={form.pilot ? 'primary' : 'outline-primary'}
                      size="sm"
                    >
                      Open in CHEFS
                    </Button>
                  ) : (
                    <Button variant="outline-secondary" size="sm" disabled>
                      CHEFS link pending
                    </Button>
                  )}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </Collapse>

      {pilotForm?.pilot && (
        <>
          <h2 className="forms-intake-h2">2. Send to CATS</h2>
          <p className="text-muted">
            After you submit the form in CHEFS, use the green button to send
            the <strong>newest</strong> submission. Use &ldquo;Show recent
            submissions&rdquo; only if you need a specific older row.
          </p>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button
              onClick={runLatestChefsSubmit}
              variant="success"
              size="lg"
              disabled={latestLoading || ingestingId !== null}
            >
              {latestLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Fetching from CHEFS and creating CATS application…
                </>
              ) : (
                'Send latest CHEFS submission to CATS'
              )}
            </Button>
            <Button
              onClick={loadChefsSubmissions}
              variant="outline-secondary"
              disabled={listLoading || latestLoading}
            >
              {listLoading ? 'Loading…' : 'Show recent submissions'}
            </Button>
          </div>

          {listVisible && listLoading && (
            <p className="text-muted small mb-0">Loading submissions from CHEFS…</p>
          )}

          {listVisible && !listLoading && chefsSubmissions.length === 0 && (
            <Alert variant="info" className="mt-3 mb-0">
              No CHEFS submissions found for the demo form.
            </Alert>
          )}

          {listVisible && chefsSubmissions.length > 0 && (
            <ListGroup className="mt-3">
              {chefsSubmissions.map((item) => (
                <ListGroup.Item
                  key={item.submissionId}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span className="small">
                    {item.createdAt ? (
                      <>{new Date(item.createdAt).toLocaleString()} — </>
                    ) : null}
                    <code>{item.submissionId}</code>
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={ingestingId !== null || latestLoading}
                    onClick={() => ingestChefsSubmission(item.submissionId)}
                  >
                    {ingestingId === item.submissionId ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'Send to CATS'
                    )}
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {chefsError && (
            <Alert variant="danger" className="mt-3">
              {chefsError}
            </Alert>
          )}
          {chefsResult && renderIntakeSuccess(chefsResult)}
        </>
      )}

      <h2 className="forms-intake-h2">
        {pilotForm?.pilot ? '3' : '2'}. Review in CATS
      </h2>
      <Button as={Link} to="/applications" variant="outline-primary" size="lg">
        Go to Applications
      </Button>

      {pilotForm?.pilot && (
        <div className="forms-intake-dev-only mt-5 pt-4">
          <hr className="forms-intake-dev-only-divider" />
          <p className="forms-intake-dev-only-banner mb-3">
            <Badge bg="warning" text="dark" className="me-2">
              DEV TESTING ONLY
            </Badge>
            <span className="text-muted">
              The section below is for local integration testing. It is{' '}
              <strong>not</strong> part of the CHEFS intake demo above.
            </span>
          </p>
          <Accordion className="forms-intake-dev-accordion">
            <Accordion.Item eventKey="fallback">
              <Accordion.Header>
                Developer shortcut: submit to CATS without CHEFS
              </Accordion.Header>
              <Accordion.Body>
                <Alert variant="warning" className="small mb-3">
                  <strong>Not for demo use.</strong> This bypasses CHEFS and
                  posts fake form data directly to the intake adapter. Use it
                  only when testing adapter/CATS wiring locally — e.g. when
                  CHEFS cannot reach localhost.
                </Alert>
                <Row className="mb-2">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Site ID</Form.Label>
                      <Form.Control
                        value={demoSiteId}
                        onChange={(e) => setDemoSiteId(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  variant="outline-secondary"
                  onClick={runDemoSubmit}
                  disabled={demoLoading}
                >
                  {demoLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Creating…
                    </>
                  ) : (
                    'Simulate NOM submit → CATS'
                  )}
                </Button>
              {demoError && (
                <Alert variant="danger" className="mt-3">
                  {demoError}
                </Alert>
              )}
              {demoResult && renderIntakeSuccess(demoResult)}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        </div>
      )}
    </Container>
  );
};

export default FormsIntake;
