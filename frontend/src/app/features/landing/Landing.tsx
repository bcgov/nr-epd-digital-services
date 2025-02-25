import { Container, Row, Col } from "react-bootstrap";
import { LoginPanel } from "../../components/landing/LoginPanel";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const Landing = () => {
  const auth = useAuth();
  const { redirect, idp } = useParams();

  useEffect(() => {
    console.log("auth", auth);
    if (
      auth != null &&
      !auth.isLoading &&
      redirect === "redirect" &&
      idp === "bceid"
    ) {
      //auth.signinRedirect({ extraQueryParams: { kc_idp_hint: "bceid" } });
      auth.signinRedirect({ extraQueryParams: { kc_idp_hint: "bceid" } });
    }
  }, [auth, redirect, idp]);

  // if (redirect === "redirect" && idp === "bceid") {
  //   //auth.signinRedirect({ extraQueryParams: { kc_idp_hint: "bceid" } });
  //   auth.signinRedirect({ extraQueryParams: { kc_idp_hint: "bceid" } });
  // }

  return (
    <Container fluid className="mt-3" id="landing-container">
      <LoginPanel />
      {}

      <Row>
        <Col className="col-12 col-sm-6 offset-sm-3">
          <p>Welcome to the new Site Remediation Services (SRS) web app.</p>

          <p>
            You can now easily submit applications for site remediation services
            and track the status of your application.
          </p>

          <p>
            Use the Site Remediation Services (SRS) web app to complete an
            application for:
          </p>

          <ul>
            <li>Contaminated Site Services Application (CSSA)</li>
            <li>Site Disclosure Statement</li>
            <li>Site Risk Classification Report</li>
          </ul>

          <p>
            These, as well as all other forms can be completed using the{" "}
            <a href="https://www2.gov.bc.ca/gov/content/environment/air-land-water/site-remediation/guidance-resources/forms">
              Site Remediation Forms
            </a>
          </p>
        </Col>

        <Col className="col-12 col-sm-6 offset-sm-3 small">
          <hr />
          <p>Collection Notice for Environmental Protection Platform:</p>
          <p>
            Your personal information is collected under 26(c) of the Freedom of
            Information and Protection of Privacy Act for the purpose of
            accessing services of the Environmental Protection Division. If you
            have any questions about the collection of your information, please
            contact Site Remediation Services at{" "}
            <a href="mailto:site@gov.bc.ca">site@gov.bc.ca</a>.
          </p>
          <p>Collection Notice for Site Remediation Forms:</p>
          <p>
            Your personal information is collected under 26(c) of the Freedom of
            Information and Protection of Privacy Act for the purpose of
            receiving site remediation services. If you have any questions about
            the collection of your information, please contact Site Remediation
            Services at <a href="mailto:site@gov.bc.ca">site@gov.bc.ca</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Landing;
