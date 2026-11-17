/**
 * Checked-in CHEFS-shaped SDS submission fixture.
 *
 * Mirrors the production CHEFS site disclosure statement schema:
 * mapped components live inside the nested `container`
 * (`Section3-IndustrialOrCommercialUses`, `Section4-AdditionalInformation`,
 * `ownerSignature`) while `approvingAuthorityContactInformation` sits at the
 * top level. Unmapped SDS data (owners, PIDs/PINs, coordinates, signature and
 * qualifying questions) is included so tests can assert it is not projected.
 */
export const sdsSubmissionFixture = {
  submit: true,
  container: {
    'Section2-SiteInformation': {
      'Section2-Latitude-Degrees': '48',
      'Section2-Latitude-Minutes': '25',
      'Section2-Latitude-Seconds': '0',
      'Section2-Longitude-Degrees': '123',
      'Section2-Longitude-Minutes': '22',
      'Section2-Longitude-Seconds': '0',
      'Section2-LegallyTitled-Address': '123 Test Street',
      'Section2-LegallyTitled-PIDColumn': [
        { 'Section2-LegallyTitled-PID': '000-000-001' },
      ],
    },
    'Section3-IndustrialOrCommercialUses': {
      schedule2Reference: ['a1', 'none', 'c3'],
    },
    'Section4-AdditionalInformation': {
      'Section4-BriefProposedLandUseSummary':
        'Redevelop the site for a mixed-use residential and commercial building.',
      'Section4-InformationUsedForSDS':
        'BC Assessment records, historical aerial photographs and a Phase 1 ESA.',
      'Section4-PastPresentGovernmentOrders':
        'No past or present government orders apply to the site.',
    },
    'Section5-Declarations': {
      'Section5-Declarations-Checkbox-UnderOrder': false,
      'Section5-Declarations-Checkbox-Foreclosure': false,
    },
    supportingDocuments1: {
      simplefile: [{ name: 'phase-1-esa.pdf' }],
    },
    ownerSignature: {
      Signature: 'data:image/png;base64,AAAA',
      firstAndLastName: 'Jane Doe',
      datesigned: '2024-05-01',
    },
    sectionIContactAndBusinessDetails: {
      'Section1A-Company': 'Example Holdings Ltd.',
    },
  },
  approvingAuthorityContactInformation: {
    'ApprovingAuth-ContactName': 'John Smith',
    'ApprovingAuth-ContactAddress': '1 Authority Way',
    datereceivedbyapprovingauthority: '2024-04-15',
    datesubmittedtoregistrar: '2024-04-20',
  },
} as const;

/**
 * Same shape but with every CHEFS date absent, so tests can prove that missing
 * dates stay blank (and are never defaulted to "today").
 */
export const sdsSubmissionFixtureMissingDates = {
  container: {
    'Section3-IndustrialOrCommercialUses': {
      schedule2Reference: ['none'],
    },
    'Section4-AdditionalInformation': {
      'Section4-BriefProposedLandUseSummary': '',
      'Section4-InformationUsedForSDS': '',
      'Section4-PastPresentGovernmentOrders': '',
    },
    ownerSignature: {
      datesigned: '',
    },
  },
  approvingAuthorityContactInformation: {
    datereceivedbyapprovingauthority: '',
    datesubmittedtoregistrar: '',
  },
} as const;
