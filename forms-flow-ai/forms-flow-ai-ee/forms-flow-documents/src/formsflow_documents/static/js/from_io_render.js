const form_options = { readOnly: true, renderMode: "flat" };

// Help web driver to idetify the form rendered completely.
function formReady() {
  document.getElementById("formio").classList.add("completed");
}

// Render form with form adapter 
function renderFormWithSubmission() {
  Formio.createForm(
    document.getElementById("formio"),
    form_info.form_url,
    form_options
  ).then((form) => {
    form.submission = form_info.submission_data;
    form.ready.then(() => {
      formReady();
    });
  });
}

// Render form from formio
function renderFormWithOutSubmission() {
  Formio.createForm(
    document.getElementById("formio"),
    form_info.form_url,
    form_options
  ).then((form) => {
    form.ready.then(() => {
      formReady();
    });
  });
}

// Render bundle
function renderFormBundle() {

  // Sort the bundle_forms array based on the 'form_order'
  const sortedBundleForms = form_info.bundle_forms.sort((a, b) => a.form_order - b.form_order);
  // Create an array to hold all form creation promises
  const formCreationPromises = sortedBundleForms.map((bundle_forms, index) => {
    return new Promise((resolve, reject) => {
      // Create a unique container element for each form
      const container = document.createElement('div');
      container.className = 'form-container';
      container.id = `form-container-${index}`;
      
      document.getElementById("formio").appendChild(container);
      Formio.createForm(
        container,
        {components: bundle_forms.form_component},
        form_options
      ).then((form) => {
        form.submission = form_info.submission_data;
        
        // Ensure form rules are executed after the form is fully ready
        form.on('change', () => {
          resolve(form);
        });

        form.ready.then(() => {
          form.triggerChange();
        });
      }).catch((error) => {
        reject(error);
      });
    });
  });

  // Wait for all form creation promises to resolve
  Promise.all(formCreationPromises)
    .then((forms) => {
      forms.forEach((form, index) => {
        const containerElement = document.getElementById(`form-container-${index}`);
        if (index < forms.length - 1) {
          const pageBreak = document.createElement('div');
          pageBreak.style.pageBreakAfter = 'always';
          containerElement.appendChild(pageBreak);
        }
      });
      formReady();
    })
    .catch((error) => {
      console.error('Error creating forms:', error);
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
    } 
    else if (form_info.form_adapter) {
      renderFormWithSubmission();
    } else {
      renderFormWithOutSubmission();
    }
  } catch (err) {
    console.log("Cannot render form", err);
    document.getElementById("formio").innerHTML('Cannot render form')
    formReady();
  }


}
