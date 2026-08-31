const serviceTypeDetail = (
  applicationServiceDesc: string,
  serviceType: 'CSAP' | 'Non-CSAP',
) => ({ applicationServiceDesc, serviceType });

export const COMMON_PERMISSIONS = [
  {
    description: 'Remediation plan with risk assessment',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Remediation plan with risk assessment',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Remediation Plan', 'Non-CSAP'),
    ],
  },
  {
    description: 'Covenant',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Covenant',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail(
        '26-Review of a Covenant Prior to Registering',
        'Non-CSAP',
      ),
    ],
  },
  {
    description: 'Confirmation of Remediation',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Confirmation of remediation',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Confirmation of Remediation', 'Non-CSAP'),
      serviceTypeDetail('26-Indemnification', 'Non-CSAP'),
    ],
  },
  {
    description: 'Authorizations - Monitoring Report',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Authorizations - Monitoring Report',
        serviceType: 'Non-CSAP',
      },
    ],
  },
  {
    description: 'Approvals and Permits',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Approvals and Permits',
        serviceType: 'Non-CSAP',
      },
    ],
  },
  {
    description: 'Consultation/Meetings',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Consultation:',
        serviceType: 'Non-CSAP',
      },
    ],
  },
  {
    description: 'Additional Services and Functions',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Additional Services and Functions',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Site Specific Standards', 'Non-CSAP'),
      serviceTypeDetail('26-Summary of Site Condition Report', 'Non-CSAP'),
      serviceTypeDetail('26-Transfer Agreement', 'Non-CSAP'),
      serviceTypeDetail('26-Voluntary Remediation Agreement', 'Non-CSAP'),
      serviceTypeDetail(
        '26-Person Requests Designation of an Area as an Environmental Management Area',
        'Non-CSAP',
      ),
    ],
  },
  {
    description: 'Financial Statement/Security',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Financial Statement/Security',
        serviceType: 'Non-CSAP',
      },
    ],
  },
  {
    description: 'Scenario 1 Releases',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Site ID Release (Scenario 1)',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Release under scenario 1', 'Non-CSAP'),
    ],
  },
  {
    description: 'Scenario 2 Releases',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Site ID Release (Scenario 2)',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Release under scenario 2', 'Non-CSAP'),
    ],
  },
  {
    description: 'Scenario 3 Releases',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Site ID Release (Scenario 3)',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Release under scenario 3', 'Non-CSAP'),
    ],
  },
  {
    description: 'Direct to Ministry Certifications (Risk Based)',
    serviceTypesDetails: [
      {
        applicationServiceDesc:
          'Amendment of Legal Instrument: Hourly Fees with or without other services',
        serviceType: 'Non-CSAP',
      },
      {
        applicationServiceDesc:
          'Approval in Principle with or without additional services ',
        serviceType: 'Non-CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - detailed risk assessment with or without other reports',
        serviceType: 'Non-CSAP',
      },
      {
        applicationServiceDesc: 'Detailed site investigation',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Approval in Principle', 'Non-CSAP'),
      serviceTypeDetail(
        '26-Certificate of Compliance - Detailed Risk Assessment',
        'Non-CSAP',
      ),
      serviceTypeDetail('26-Detailed Site Condition Report', 'Non-CSAP'),
      serviceTypeDetail('26-Detailed Site Investigation', 'Non-CSAP'),
      serviceTypeDetail('26-Preliminary Site Investigation', 'Non-CSAP'),
      serviceTypeDetail(
        '26-Risk Assessment (Human health or Environmental risk assessment)',
        'Non-CSAP',
      ),
    ],
  },
  {
    description: 'Direct to Ministry Certifications (Numerical)',
    serviceTypesDetails: [
      {
        applicationServiceDesc:
          'Amendment of Legal Instrument: Hourly Fees with or without other services',
        serviceType: 'Non-CSAP',
      },
      {
        applicationServiceDesc:
          'Approval in Principle with or without additional services ',
        serviceType: 'Non-CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - numerical withor without other reports',
        serviceType: 'Non-CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - screening level risk assessment',
        serviceType: 'Non-CSAP',
      },
      {
        applicationServiceDesc: 'Final Determination under CSR 15(3)',
        serviceType: 'Non-CSAP',
      },
      {
        applicationServiceDesc:
          'Preliminary Determination under CSR 15(3), with other reports',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Certificate of Compliance - Numerical', 'Non-CSAP'),
      serviceTypeDetail(
        '26-Certificate of Compliance - Screening Level Risk Assessment',
        'Non-CSAP',
      ),
      serviceTypeDetail(
        '26-Determination of a Contaminated Site - Preliminary',
        'Non-CSAP',
      ),
      serviceTypeDetail(
        '26-Determination of a contaminated site - Final - no ministry fees',
        'Non-CSAP',
      ),
    ],
  },
  {
    description: 'P4',
    serviceTypesDetails: [
      {
        applicationServiceDesc:
          'Background Substance Conc.: Protocol 4 Background Soil',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail(
        '26-Background Substance Concentrations: Protocol 4 Background Soil',
        'Non-CSAP',
      ),
    ],
  },
  {
    description: 'P6',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Protocol 6 Approval',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Protocol 6 Pre-approval', 'Non-CSAP'),
    ],
  },
  {
    description: 'P9',
    serviceTypesDetails: [
      {
        applicationServiceDesc:
          'Background Substance Conc.: Protocol 9 Background Groundwater',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail(
        '26-Background Substance Concentrations: Protocol 9 Background Groundwater',
        'Non-CSAP',
      ),
    ],
  },
  {
    description: 'P21',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Protocol 21 Water Use',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Protocol 21 Water Use', 'Non-CSAP'),
    ],
  },
  {
    description: 'Requests to Director',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Request to Director',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Minor Contribution Status', 'Non-CSAP'),
      serviceTypeDetail(
        '26-Person Requests the Appointment of an Allocation Panel',
        'Non-CSAP',
      ),
      serviceTypeDetail(
        '26-Request to Director: Review of Background Substance Concentrations for a Site under CSR s. 11, 17 or 18',
        'Non-CSAP',
      ),
    ],
  },
  {
    description: 'Reclassifications',
    serviceTypesDetails: [
      {
        applicationServiceDesc:
          'P12 - Reclassification with or without additional services',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-P12 - Reclassification', 'Non-CSAP'),
    ],
  },
  {
    description: 'High Risk Reporting Requirements',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Reporting',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail(
        '26-Protocol 12 High Risk Reporting (Review of an Interim Report per Protocol 12 - Site Risk Classification)',
        'Non-CSAP',
      ),
      serviceTypeDetail(
        "26-Review of Interim Report for the Remediation of a Contaminated Site in Accordance with an Applicable Director's Protocol Made under Section 64(1)(d) of the Act",
        'Non-CSAP',
      ),
    ],
  },
  {
    description: 'Site ID confirmation of remediation',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Site ID - Confirmation of Remediation',
        serviceType: 'Non-CSAP',
      },
    ],
  },
];

export const SDM_PERMISSIONS = [
  {
    description: 'AP Recommended Certifications (Risk Based)',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Approval in Principle',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - detailed risk assessment',
        serviceType: 'CSAP',
      },
      serviceTypeDetail('26-Approval in Principle', 'CSAP'),
      serviceTypeDetail(
        '26-Certificate of Compliance - Detailed Risk Assessment',
        'CSAP',
      ),
    ],
  },
  {
    description: 'AP Recommended Certifications (Numerical)',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Approval in Principle',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - screening level risk assessment',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc: 'Certificate of Compliance - numerical',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc: 'Final Determination under CSR 15(3)',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc: 'Preliminary Determination under CSR 15(3)',
        serviceType: 'CSAP',
      },
      serviceTypeDetail('26-Certificate of Compliance - Numerical', 'CSAP'),
      serviceTypeDetail(
        '26-Certificate of Compliance - Screening Level Risk Assessment',
        'CSAP',
      ),
      serviceTypeDetail('26-Final Determination under CSR 15(3)', 'CSAP'),
      serviceTypeDetail('26-Preliminary Determination under CSR 15(3)', 'CSAP'),
    ],
  },
  {
    description: 'Monitoring Reports from CSAP RSC',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'CSAP - AP Statement or report',
        serviceType: 'CSAP',
      },
      serviceTypeDetail(
        '26-CSAP - AP Statement or report - no ministry fee',
        'CSAP',
      ),
    ],
  },
];

export const CASEWORKER_PERMISSIONS = [
  {
    description: 'Direct to Ministry Monitoring Reports',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Reporting',
        serviceType: 'Non-CSAP',
      },
    ],
  },
  {
    description: 'Site ID Annual Reports',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Site ID (Annual Update)',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Annual Update - Site ID  (Table 2.16)', 'Non-CSAP'),
    ],
  },
];

export const MENTOR_PERMISSIONS = [
  {
    description: 'AP Recommended Certifications (Risk Based)',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Approval in Principle',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - detailed risk assessment',
        serviceType: 'CSAP',
      },
      serviceTypeDetail('26-Approval in Principle', 'CSAP'),
      serviceTypeDetail(
        '26-Certificate of Compliance - Detailed Risk Assessment',
        'CSAP',
      ),
    ],
  },
  {
    description: 'AP Recommended Certifications (Numerical)',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Approval in Principle',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - screening level risk assessment',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc: 'Certificate of Compliance - numerical',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc: 'Final Determination under CSR 15(3)',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc: 'Preliminary Determination under CSR 15(3)',
        serviceType: 'CSAP',
      },
      serviceTypeDetail('26-Certificate of Compliance - Numerical', 'CSAP'),
      serviceTypeDetail(
        '26-Certificate of Compliance - Screening Level Risk Assessment',
        'CSAP',
      ),
      serviceTypeDetail('26-Final Determination under CSR 15(3)', 'CSAP'),
      serviceTypeDetail('26-Preliminary Determination under CSR 15(3)', 'CSAP'),
    ],
  },
  {
    description: 'Direct to Ministry Monitoring Reports',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Reporting',
        serviceType: 'Non-CSAP',
      },
    ],
  },
  {
    description: 'Site ID Annual Reports',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Site ID (Annual Update)',
        serviceType: 'Non-CSAP',
      },
      serviceTypeDetail('26-Annual Update - Site ID  (Table 2.16)', 'Non-CSAP'),
    ],
  },
];
