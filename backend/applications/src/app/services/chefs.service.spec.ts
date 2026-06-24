import {
  extractChefsFormName,
  extractChefsFormSchema,
  extractChefsSubmissionFields,
  parseChefsExportSubmissions,
} from './chefs.service';

describe('ChefsService helpers', () => {
  describe('extractChefsSubmissionFields', () => {
    it('reads Form.io data from submission.submission.data', () => {
      const body = {
        submission: {
          id: 'sub-id',
          submission: {
            data: { siteIdNumber: '100001', firstName: 'Test' },
          },
        },
        form: { id: 'form-id', name: 'NOM' },
      };

      expect(extractChefsSubmissionFields(body)).toEqual({
        siteIdNumber: '100001',
        firstName: 'Test',
      });
    });

    it('returns empty object when structure is unexpected', () => {
      expect(extractChefsSubmissionFields({})).toEqual({});
    });
  });

  describe('extractChefsFormName', () => {
    it('reads form.name from CHEFS API envelope', () => {
      expect(
        extractChefsFormName({
          submission: { id: 'x' },
          form: { id: 'f', name: 'NOM' },
        }),
      ).toBe('NOM');
    });
  });

  describe('extractChefsFormSchema', () => {
    it('reads Form.io schema from version.schema', () => {
      const schema = extractChefsFormSchema({
        id: 'version-id',
        schema: {
          title: 'NOM',
          display: 'form',
          type: 'form',
          components: [{ type: 'textfield', key: 'siteId' }],
        },
      });

      expect(schema?.title).toBe('NOM');
      expect(schema?.components).toHaveLength(1);
    });

    it('reads schema when components are at root', () => {
      const schema = extractChefsFormSchema({
        title: 'Direct',
        components: [{ type: 'hidden', key: 'hdnAppType' }],
      });

      expect(schema?.title).toBe('Direct');
      expect(schema?.components).toHaveLength(1);
    });

    it('returns null when components are missing', () => {
      expect(extractChefsFormSchema({ schema: { title: 'Empty' } })).toBeNull();
    });

    it('reads schema from CHEFS Form.versions[] (GET /forms/:id/version)', () => {
      const schema = extractChefsFormSchema({
        id: '94fa90d0-645f-42ca-bf07-2d7b6184d472',
        name: 'NOM',
        versions: [
          {
            id: 'version-id',
            version: 3,
            published: true,
            schema: {
              display: 'form',
              type: 'form',
              components: [{ type: 'textfield', key: 'siteId' }],
            },
          },
        ],
      });

      expect(schema?.title).toBe('NOM');
      expect(schema?.components).toHaveLength(1);
    });
  });

  describe('parseChefsExportSubmissions', () => {
    it('parses array export and sorts newest first', () => {
      const result = parseChefsExportSubmissions(
        [
          {
            id: 'older',
            createdAt: '2026-01-01T10:00:00Z',
          },
          {
            submission: { id: 'newer' },
            createdAt: '2026-06-23T10:00:00Z',
          },
        ],
        10,
      );

      expect(result[0].submissionId).toBe('newer');
      expect(result[1].submissionId).toBe('older');
    });

    it('deduplicates submission ids', () => {
      const result = parseChefsExportSubmissions(
        [{ id: 'same-id' }, { id: 'same-id' }],
        10,
      );
      expect(result).toHaveLength(1);
    });

    it('parses CHEFS form export rows (form.submissionId)', () => {
      const result = parseChefsExportSubmissions(
        [
          {
            form: {
              submissionId: '8d5b1013-9758-4e53-add0-d52ef4ae67d8',
              submittedAt: '2026-06-23T20:39:50.026Z',
              status: 'SUBMITTED',
            },
            's2-city': 'test',
          },
        ],
        10,
      );

      expect(result).toHaveLength(1);
      expect(result[0].submissionId).toBe(
        '8d5b1013-9758-4e53-add0-d52ef4ae67d8',
      );
      expect(result[0].createdAt).toBe('2026-06-23T20:39:50.026Z');
    });
  });
});
