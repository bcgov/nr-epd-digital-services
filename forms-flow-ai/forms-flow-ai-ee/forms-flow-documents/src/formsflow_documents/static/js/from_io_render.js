const form_options = { readOnly: true, renderMode: "flat" };

function getBooleanFromProperty(value) {
  if (typeof value === "boolean") return value;
  if (value === 1) return true;
  if (typeof value !== "string") return false;

  switch (value.toLowerCase()) {
    case "true":
    case "1":
    case "on":
    case "yes":
      return true;
    default:
      return false;
  }
}

function shouldHideInPdf(component) {
  if (!component) return false;
  if (getBooleanFromProperty(component.hideInPdf)) return true;
  if (
    component.customProperties &&
    getBooleanFromProperty(component.customProperties.hideInPdf)
  ) {
    return true;
  }
  if (
    component.properties &&
    getBooleanFromProperty(component.properties.hideInPdf)
  ) {
    return true;
  }
  return false;
}

// Recursively filter out components marked as hidden for PDF export
function filterComponentsForPDF(components) {
  if (!components || !Array.isArray(components)) {
    return components;
  }

  return components
    .map((component) => {
      if (shouldHideInPdf(component)) {
        return null;
      }

      // Standard nested components
      if (component.components && Array.isArray(component.components)) {
        component.components = filterComponentsForPDF(component.components);
      }

      // Columns layout (each column has its own components array)
      if (component.columns && Array.isArray(component.columns)) {
        component.columns = component.columns.map((column) => {
          if (column && Array.isArray(column.components)) {
            column.components = filterComponentsForPDF(column.components);
          }
          return column;
        });
      }

      // Table layout rows -> cells -> components
      if (component.rows && Array.isArray(component.rows)) {
        component.rows = component.rows.map((row) => {
          if (!Array.isArray(row)) return row;
          return row.map((cell) => {
            if (cell && Array.isArray(cell.components)) {
              cell.components = filterComponentsForPDF(cell.components);
            }
            return cell;
          });
        });
      }

      return component;
    })
    .filter(Boolean);
}

// Help web driver to idetify the form rendered completely.
function formReady() {
  document.getElementById("formio").classList.add("completed");
}

function applySubmissionAndReady(form, withSubmission) {
  if (withSubmission) {
    form.submission = form_info.submission_data;
  }
  form.ready.then(() => {
    formReady();
  });
}

function createFormWithDefinition(formDefinition, withSubmission) {
  const definitionCopy = _.cloneDeep(formDefinition);
  // Filter out components marked to be hidden in PDF
  if (definitionCopy.components) {
    definitionCopy.components = filterComponentsForPDF(
      definitionCopy.components
    );
  }

  return Formio.createForm(
    document.getElementById("formio"),
    definitionCopy,
    form_options
  ).then((form) => {
    applySubmissionAndReady(form, withSubmission);
  });
}

function createFormFromUrlFallback(withSubmission) {
  return Formio.createForm(
    document.getElementById("formio"),
    form_info.form_url,
    form_options
  ).then((form) => {
    applySubmissionAndReady(form, withSubmission);
  });
}

function renderFormWithAdapterOption(withSubmission) {
  // Fetch the form definition first to filter components
  fetch(form_info.form_url)
    .then((response) => response.json())
    .then((formDefinition) => {
      return createFormWithDefinition(formDefinition, withSubmission);
    })
    .catch((error) => {
      console.error("Error fetching form:", error);
      // Fallback to original behavior
      return createFormFromUrlFallback(withSubmission);
    });
}

function renderFormWithSubmission() {
  renderFormWithAdapterOption(true);
}

function renderFormWithOutSubmission() {
  renderFormWithAdapterOption(false);
}

// Render bundle
function renderFormBundle() {
  // Sort the bundle_forms array based on the 'form_order'
  const sortedBundleForms = form_info.bundle_forms.sort(
    (a, b) => a.form_order - b.form_order
  );
  // Create an array to hold all form creation promises
  const formCreationPromises = sortedBundleForms.map((bundle_forms, index) => {
    return new Promise((resolve, reject) => {
      // Create a unique container element for each form
      const container = document.createElement("div");
      container.className = "form-container";
      container.id = `form-container-${index}`;

      document.getElementById("formio").appendChild(container);

      const formComponents = filterComponentsForPDF(
        _.cloneDeep(bundle_forms.form_component)
      );

      Formio.createForm(container, { components: formComponents }, form_options)
        .then((form) => {
          form.submission = form_info.submission_data;

          // Ensure form rules are executed after the form is fully ready
          form.on("change", () => {
            resolve(form);
          });

          form.ready.then(() => {
            form.triggerChange();
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  // Wait for all form creation promises to resolve
  Promise.all(formCreationPromises)
    .then((forms) => {
      forms.forEach((form, index) => {
        const containerElement = document.getElementById(
          `form-container-${index}`
        );
        if (index < forms.length - 1) {
          const pageBreak = document.createElement("div");
          pageBreak.style.pageBreakAfter = "always";
          containerElement.appendChild(pageBreak);
        }
      });
      formReady();
    })
    .catch((error) => {
      console.error("Error creating forms:", error);
    });
}

function renderForm() {
  // loading custom components from formsflow-formio-custom-elements (npm package)
  try {
    const components = FormioCustom.components;
    for (var key of Object.keys(components)) {
      Formio.registerComponent(key, components[key]);
    }
  } catch (err) {
    console.log("Cannot load custom components.");
  }

  try {
    Formio.setBaseUrl(form_info.base_url);
    Formio.setProjectUrl(form_info.project_url);
    Formio.setToken(form_info.token);
    if (form_info.is_bundle) {
      renderFormBundle();
    } else if (form_info.form_adapter) {
      renderFormWithSubmission();
    } else {
      renderFormWithOutSubmission();
    }
  } catch (err) {
    console.log("Cannot render form", err);
    document.getElementById("formio").innerHTML("Cannot render form");
    formReady();
  }
}
