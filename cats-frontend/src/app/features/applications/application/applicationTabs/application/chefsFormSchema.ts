/** Form.io schema shape used by the Application tab. */
export type FormioSchema = {
  title?: string;
  display?: string;
  type?: string;
  components: unknown[];
};

/**
 * CHEFS Form Builder uses custom Form.io component types (simpletextfield, simplecols2, …)
 * that are not bundled in @formio/js. Map them to standard types for read-only display.
 */
const CHEFS_TYPE_MAP: Record<string, string> = {
  simpletextfield: 'textfield',
  simpletextfieldadvanced: 'textfield',
  simpletextarea: 'textarea',
  simpleemail: 'email',
  simplephonenumber: 'phoneNumber',
  simplephone: 'phoneNumber',
  simpleselect: 'select',
  simpleradios: 'radio',
  simplecheckbox: 'checkbox',
  simplecheckboxes: 'selectboxes',
  simpledatetime: 'datetime',
  simplecontent: 'content',
  simplepanel: 'panel',
  simplecols2: 'columns',
  simplecols3: 'columns',
  simplecols4: 'columns',
  simplecols5: 'columns',
  simplecols6: 'columns',
  simplecols7: 'columns',
  simplecols8: 'columns',
  simplebcaddress: 'textarea',
  simplebuttonadvanced: 'button',
  orgbook: 'textfield',
  simplefile: 'file',
};

function normalizeComponent(component: unknown): unknown {
  if (!component || typeof component !== 'object') {
    return component;
  }

  const record = { ...(component as Record<string, unknown>) };
  const chefsType = String(record.type ?? '');
  const mappedType = CHEFS_TYPE_MAP[chefsType];

  if (mappedType) {
    record.type = mappedType;
    if (chefsType === 'simplecontent' && record.html && !record.content) {
      record.content = record.html;
    }
    if (chefsType === 'orgbook') {
      record.disabled = true;
    }
  }

  if (Array.isArray(record.components)) {
    record.components = record.components.map(normalizeComponent);
  }

  if (Array.isArray(record.columns)) {
    record.columns = record.columns.map((column) => {
      if (!column || typeof column !== 'object') {
        return column;
      }
      const col = { ...(column as Record<string, unknown>) };
      if (Array.isArray(col.components)) {
        col.components = col.components.map(normalizeComponent);
      }
      return col;
    });
  }

  if (Array.isArray(record.rows)) {
    record.rows = record.rows.map((row) => {
      if (!Array.isArray(row)) {
        return row;
      }
      return row.map((cell) => {
        if (!cell || typeof cell !== 'object') {
          return cell;
        }
        const c = { ...(cell as Record<string, unknown>) };
        if (Array.isArray(c.components)) {
          c.components = c.components.map(normalizeComponent);
        }
        return c;
      });
    });
  }

  return record;
}

export function normalizeChefsFormSchema(schema: FormioSchema): FormioSchema {
  return {
    ...schema,
    components: (schema.components ?? []).map(normalizeComponent) as unknown[],
  };
}

/** Format nested CHEFS values for standard read-only fields. */
export function formatChefsFieldValue(value: unknown): unknown {
  if (value == null) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => formatChefsFieldValue(item))
      .filter((item) => item != null && item !== '')
      .join(', ');
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.name === 'string') {
      return obj.name;
    }
    if (typeof obj.text === 'string') {
      return obj.text;
    }
    if (typeof obj.label === 'string') {
      return obj.label;
    }
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return value;
}

function isDatagridRowObject(value: Record<string, unknown>): boolean {
  if (Object.keys(value).length === 0) {
    return false;
  }
  return !(
    'features' in value ||
    'selectedBaseLayer' in value ||
    Array.isArray(value)
  );
}

function normalizeSubmissionValue(
  key: string,
  value: unknown,
): unknown {
  if (value == null) {
    return value;
  }

  if (key === 'map' && typeof value === 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((row) =>
      row && typeof row === 'object'
        ? normalizeChefsSubmissionData(row as Record<string, unknown>)
        : formatChefsFieldValue(row),
    );
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    if (
      (key === 'dataGrid' || key === 'dataGrid1') &&
      isDatagridRowObject(obj)
    ) {
      return [normalizeChefsSubmissionData(obj)];
    }

    const nested = normalizeChefsSubmissionData(obj);
    return Object.keys(nested).length > 0 ? nested : formatChefsFieldValue(value);
  }

  return formatChefsFieldValue(value);
}

export function normalizeChefsSubmissionData(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === '_intake' || key === 'submit' || key === 'saveasPDF' || key === 'lateEntry') {
      continue;
    }

    result[key] = normalizeSubmissionValue(key, value);
  }

  return result;
}
