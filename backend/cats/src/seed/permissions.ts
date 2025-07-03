import { application } from 'express';

export const COMMON_PERMISSIONS = [
  {
    description: 'Remediation plan with risk assessment',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Remediation plan with risk assessment',
        serviceType: 'Non-CSAP',
      },
    ],
  },
  {
    description: 'Covenant',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Covenant',
        serviceType: 'Non-CSAP',
      },
    ],
  },
  {
    description: 'Confirmation of Remediation',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Confirmation of Remediation',
        serviceType: 'Non-CSAP',
      },
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
    ],
  },
  {
    description: 'Scenario 2 Releases',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Site ID Release (Scenario 2)',
        serviceType: 'Non-CSAP',
      },
    ],
  },
  {
    description: 'Scenario 3 Releases',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Site ID Release (Scenario 3)',
        serviceType: 'Non-CSAP',
      },
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
        applicationServiceDesc:
          'Detailed site investigation, Risk assessment with other services',
        serviceType: 'Non-CSAP',
      },
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
    ],
  },
  {
    description: 'P6',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Protocol 6 Approval',
        serviceType: 'Non-CSAP',
      },
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
    ],
  },
  {
    description: 'P21',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Protocol 21 Water Use',
        serviceType: 'Non-CSAP',
      },
    ],
  },
  {
    description: 'Requests to Director',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Requests to Director',
        serviceType: 'Non-CSAP',
      },
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
    ],
  },
  {
    description: 'High Risk Reporting Requirements',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Reporting',
        serviceType: 'Non-CSAP',
      },
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
        applicationServiceDesc:
          'Approval in Principle with or without additional services',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - detailed risk assessment with or without other reports',
        serviceType: 'CSAP',
      },
    ],
  },
  {
    description: 'AP Recommended Certifications (Numerical)',
    serviceTypesDetails: [
      {
        applicationServiceDesc:
          'Approval in Principle with or without additional services',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - screening level risk assessment',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - numerical withor without other reports',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc: 'Final Determination under CSR 15(3)',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Preliminary Determination under CSR 15(3), with other reports',
        serviceType: 'CSAP',
      },
    ],
  },
  {
    description: 'Monitoring Reports from CSAP RSC',
    serviceTypesDetails: [
      {
        applicationServiceDesc: 'Reporting',
        serviceType: 'CSAP',
      },
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
    ],
  },
];

export const MENTOR_PERMISSIONS = [
  {
    description: 'AP Recommended Certifications (Risk Based)',
    serviceTypesDetails: [
      {
        applicationServiceDesc:
          'Approval in Principle with or without additional services',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - detailed risk assessment with or without other reports',
        serviceType: 'CSAP',
      },
    ],
  },
  {
    description: 'AP Recommended Certifications (Numerical)',
    serviceTypesDetails: [
      {
        applicationServiceDesc:
          'Approval in Principle with or without additional services',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - screening level risk assessment',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Certificate of Compliance - numerical withor without other reports',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc: 'Final Determination under CSR 15(3)',
        serviceType: 'CSAP',
      },
      {
        applicationServiceDesc:
          'Preliminary Determination under CSR 15(3), with other reports',
        serviceType: 'CSAP',
      },
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
    ],
  },
];
