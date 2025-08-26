System.register([], function (n, o) {
  return {
    execute: function () {
      n(
        (() => {
          var n = {
              373: (n, o, r) => {
                "use strict";
                r.d(o, { Z: () => i });
                var A = r(15),
                  t = r.n(A),
                  e = r(645),
                  a = r.n(e)()(t());
                a.push([
                  n.id,
                  '.application-head .main-nav.nav-item\n{\n  line-height: 1.5 !important;\n}\n\n.btn-danger\n{\n    border: 1px solid #2A4071;\n    color: #2A4071 !important;\n    background-color: white !important;\n}\n\n.btn-danger:hover\n{\n    border: 1px solid #2A4071;\n    color: #2A4071 !important;\n    background-color: white !important;\n}\n\n.btn-warning\n{\n    border: 1px solid #2A4071;\n    color: #2A4071 !important;\n    background-color: white !important;\n}\n\n.btn-warning:hover\n{\n    border: 1px solid #2A4071;\n    color: #2A4071 !important;\n    background-color: white !important;\n}\n\n.btn-success{\n  background: #2A4071 !important;\n  border: 1px solid #2A4071 !important;\n}\n\n.btn-success:hover{\n  background: #2A4071 !important;\n  border: 1px solid #2A4071 !important;\n}\n\n:root {\n  --color-primary: #4d61fc;\n  --color-secondary: #6c757d;\n  --color-success: #3fb618;\n  --color-info: #4d61fc;\n  --color-warning: #fcba19;\n  --color-red: #ff0039;\n  --color-light: #f8f9fa;\n  --color-dark: #373a3c;\n  --color-black: #000;\n  --color-indigo: #6610f2;\n  --color-purple: #613d7c;\n  --color-white: #fff;\n  --color-white: #fff;\n  --color-pink: #e83e8c;\n  --color-teal: #20c997;\n  --color-orange: #f2661f;\n  --color-cyan: #9954bb;\n  --color-gray-100: #f8f9fa;\n  --colorgray-200: #e9ecef;\n  --color-gray-300: #dee2e6;\n  --color-gray-400: #ced4da;\n  --color-gray-500: #adb5bd;\n  --color-gray-600: #868e96;\n  --color-gray-700: #495057;\n  --color-gray-800: #373a3c;\n  --color-gray-900: #212529;\n\n  --logo-path: "./logo.svg";\n\n  --logo-width: 50px;\n  --appname-margin-left: 0px;\n  --appname-margin-right: 0px;\n  --appname-margin-top: 0px;\n  --appname-margin-bottom: 0px;\n\n  --navbar-items-font-size:16px;\n  --navbar-items-font-weight: 600;\n\n  --navbar-background: var(--color-white);\n  --navbar-items: var(--color-black);\n  --navbar-active: var(--color-primary);\n  --button-primary-background: var(--color-primary);\n  --navbar-app-name: var(--color-black);\n  --navbar-logo-width: var(--logo-width);\n\n  --navbar-logo-path: var(--logo-path);\n}\n\n.container,\n.container-sm,\n.container-md,\n.container-lg,\n.container-xl {\n  max-width: 100vw;\n}\n.container {\n  margin-top: 3px;\n  padding-left: 0;\n  padding-right: 0;\n  height: 100%;\n}\n.overflow-x-auto {\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n\n.overflow-y-auto {\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.text-primary {\n  color: var(--color-primary);\n}\n.footer-text {\n  font-size: 18px;\n}\n.btn-primary {\n  background-color: var(--button-primary-background);\n}\n.btn-outline-primary:not(:disabled) {\n  border-color: #0071eb;\n  color: #0071eb;\n}\n.btn-outline-primary:not(:disabled):hover {\n  color: var(--color-white);\n  background-color: var(--color-primary);\n}\n\n.task-container {\n  height: 100% !important;\n}\n.logo {\n  height: 1.9em;\n}\nh4 {\n  font-size: 1.2rem;\n}\n#main {\n  min-height: 85vh;\n  padding-bottom: 1.5rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\nbody {\n  font-size: 16px;\n  font-family: Nunito Sans, SemiBold;\n  overflow: hidden;\n}\n.loader-container {\n  display: flex;\n  height: 80vh;\n  justify-content: center;\n  align-items: center;\n}\n.loader {\n  position: absolute;\n  margin: auto;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n}\n.input-group .input-group-addon {\n  position: absolute;\n  right: 5px;\n  top: 7px;\n}\n.input-group .radio-inline {\n  margin-left: 20px;\n}\n.input-group label {\n  margin-right: 2rem;\n}\n.well {\n  border: 1px solid #eeeeee;\n  padding: 1rem;\n  background-color: #f8f8f8bf;\n}\n.formio-component-panel {\n  border: 1px solid #eeeeee;\n}\n\n.formio-component-panel .panel-heading {\n  background-color: #eeeeee;\n  padding: 10px 0 10px 10px;\n}\n.formio-component-panel .panel-heading .panel-title i {\n  font-size: 12px;\n}\n.panel-body {\n  padding: 1.5rem 2rem 1.5rem 2rem;\n}\n\n.page-item.active .page-link {\n  background-color: #036 !important;\n  border-color: #56595d !important;\n  color: white !important;\n}\nh5,\n.h5 {\n  font-size: 16px !important;\n}\n.bg-default {\n  background-color: #38598a;\n  border: #38598a;\n  color: white !important;\n}\n.text-muted {\n  color: #868e96 !important;\n}\n\ni.fa.fa-question-circle.text-muted {\n  color: #2e96ff !important;\n}\n\n.panel-heading {\n  background-color: #38598a;\n  border: #38598a;\n  color: white !important;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 8px;\n}\n.form-view-wrapper {\n  min-height: 75vh;\n}\n.btn.signature-pad-refresh {\n  z-index: 99 !important;\n}\n\n.formio-error-wrapper,\n.has-error {\n  color: red;\n  background-color: #fff;\n  border-color: red;\n}\n.formio-error-wrapper,\n.has-error label {\n  color: red;\n}\n.formio-errors .error {\n  color: red;\n}\n.is-invalid {\n  background-color: #ffd1d1;\n}\n.active-tab {\n  background-color: transparent;\n  color: var(--navbar-active) !important;\n}\n\n.active-tab-dropdown > #dashboard-dropdown {\n  background-color: transparent;\n  filter: invert(36%) sepia(38%) saturate(7152%) hue-rotate(227deg)\n    brightness(101%) contrast(98%);\n}\n.active-tab-dropdown > #task-dropdown {\n  background-color: transparent;\n  filter: invert(36%) sepia(38%) saturate(7152%) hue-rotate(227deg)\n    brightness(101%) contrast(98%);\n}\n.dropdown-item:hover {\n  filter: none;\n  background-color: #e9ecef;\n}\n.selected-tag {\n  color: var(--color-info) !important;\n  border-bottom: 1px solid var(--color-info);\n  background-color: transparent;\n}\n.lbl-logout {\n  font-size: 16px;\n  color: var(--color-dark);\n  margin-left: 10px;\n  cursor: pointer;\n}\n\n.dropdown-menu:before {\n  position: absolute;\n  top: -7px;\n  right: 9px;\n  display: inline-block;\n  border-right: 7px solid transparent;\n  border-bottom: 7px solid #ccc;\n  border-left: 7px solid transparent;\n  border-bottom-color: rgba(0, 0, 0, 0.2);\n  content: "";\n}\n\n.dropdown-menu:after {\n  position: absolute;\n  top: -6px;\n  right: 10px;\n  display: inline-block;\n  border-right: 6px solid transparent;\n  border-bottom: 6px solid #ffffff;\n  border-left: 6px solid transparent;\n  content: "";\n}\n\n.taskDropdown > .dropdown-menu::before {\n  left: 10%;\n  right: 100%;\n}\n.taskDropdown > .dasboard-icon-dropdown {\n  margin-bottom: 5px;\n}\n.taskDropdown > .task-dropdown-icon {\n  margin-bottom: 1px;\n}\n.taskDropdown > .applications-icon-header {\n  width: 23px;\n  height: 23px;\n  margin-bottom: 5px;\n}\n.taskDropdown > .dropdown-menu::after {\n  left: 10%;\n  right: 100%;\n}\n\n.custom-profile {\n  position: absolute;\n  margin-left: 220px;\n  padding-bottom: 10px;\n  z-index: 10;\n}\n/* .d-md-none {\n  .dropup,\n  .dropright,\n  .dropdown,\n  .dropleft {\n    position: initial;\n  }\n  .nav-dropdown .dropdown-menu {\n    position: absolute;\n  }\n  .dropdown-menu:before {\n    position: absolute;\n    top: -6px;\n    right: 4px;\n    display: inline-block;\n    border-right: 7px solid transparent;\n    border-bottom: 7px solid #ccc;\n    border-left: 7px solid transparent;\n    border-bottom-color: rgba(0, 0, 0, 0.2);\n    content: "";\n  }\n\n  .dropdown-menu:after {\n    position: absolute;\n    top: -5px;\n    right: 5px;\n    display: inline-block;\n    border-right: 6px solid transparent;\n    border-bottom: 6px solid #ffffff;\n    border-left: 6px solid transparent;\n    content: "";\n  }\n}\n.lbl-app-nanme {\n  font-size: 20px;\n  color: #ffff;\n  margin-bottom: 0;\n  font-weight: bold;\n  margin-left: 20px;\n}\n.app-name {\n  color: $yellow;\n  margin: 0;\n}\n.nav-icons {\n  vertical-align: text-top;\n  margin-right: 3px;\n}\n.nav-dropdown .dropdown-menu {\n  height: auto !important;\n}\n.table-bordered thead th,\n.table-bordered thead td {\n  background-color: #f2f2f2 !important;\n}\n.navbar-dark.navbar-toggler {\n  border-color: white;\n} */\n.main-header {\n  margin-left: 15px !important;\n  display: flex;\n  margin-top: 10px;\n  margin-bottom: 25px;\n  height: 30px;\n  width: 100%;\n}\n@media (max-width: 768px) {\n  .main-header {\n    height: 70px;\n    flex-direction: row;\n    flex-wrap: wrap;\n  }\n}\n.back-icon {\n  display: flex;\n}\n.sub-container {\n  margin-left: 15px;\n}\n.task-head {\n  font-weight: bold;\n  font-size: 30px;\n  margin-left: 10px !important;\n}\n.icon-wp-forms {\n  height: 30px;\n}\n.forms-text {\n  vertical-align: bottom;\n  margin-left: 10px;\n  margin-bottom: 0px;\n}\n.task-head-icons {\n  height: 30px;\n  width: 30px;\n}\n.task-head-details {\n  font-weight: bold;\n  font-size: 30px;\n  margin-left: 10px !important;\n}\n.icon-wp-forms {\n  height: 30px;\n}\n.forms-text {\n  vertical-align: middle;\n  margin-left: 10px;\n}\n.btn-right {\n  float: right;\n  margin-left: auto;\n}\n.btn-center {\n  float: right;\n  margin-left: auto;\n}\n\n.btn.btn-link:focus,\n.btn.btn-link.focus {\n  box-shadow: none;\n}\n.div-center {\n  align-self: center;\n}\n.tooltip-inner {\n  color: black !important;\n  background-color: white !important;\n  border: 0.5px solid !important;\n  text-align: left;\n}\n\n.navbar-brand {\n  align-items: center;\n}\n\n.navbar-brand .img-fluid,\n.navbar-brand .img-thumbnail {\n  max-width: 100%;\n  height: 100%;\n}\n\nselect option:hover {\n  box-shadow: 0 0 10px 100px #000 inset;\n}\n.modal-dialog {\n  margin: 8.75rem auto !important;\n}\n\n#main {\n  background-color: #fff;\n  padding: 10px;\n  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2),\n    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);\n}\n\n#sidebar {\n  background: #fff;\n}\n\n.content {\n  background-color: #f8f8f8;\n}\n\n#sidebar ul li.active > a,\n#sidebar a[aria-expanded="true"] {\n  background: #fff;\n}\n\nheader nav {\n  border-bottom: #fff;\n}\n\n.topheading-border-bottom {\n  z-index: 2000;\n  border-bottom: 2px solid #4d61fc !important;\n  padding: 0 0.5rem !important;\n  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2),\n    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);\n}\n\n.rounded-circle {\n  border-radius: 50% !important;\n  border: 2px solid lightgrey;\n  height: 40px;\n  width: 40px;\n}\n\n.sort-span {\n  cursor: pointer;\n  border: 1px solid #0071eb;\n  border-radius: 0.25rem;\n  padding: 4px;\n  padding-left: 6px;\n  padding-top: 0px;\n  border-radius: 6px;\n  width: 35px;\n}\n\n.sort-span:hover {\n  background-color: #0071eb;\n}\n.sort-span:hover > .fa-lg-hover {\n  color: white;\n}\n\ndiv[disabled] {\n  pointer-events: none;\n  opacity: 0.7;\n}\n\n.hide-scroll {\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n}\n.classApplicationId {\n  width: 15%;\n}\n.form_select {\n  width: 15%;\n}\n.form_operation {\n  width: 30%;\n}\n.classApplicationName {\n  width: 20%;\n}\n.form_title {\n  width: 40%;\n}\n.navbar-light .navbar-nav .nav-link {\n  color: rgba(0, 0, 0, 0.9);\n}\n\n/* overwriting default styles */\n.MuiTab-wrapper {\n  font-size: 16px;\n}\n.formcomponents .formcomponent {\n  font-size: 1em;\n}\n.button_font {\n  font-size: 14px;\n  font-weight: bold;\n}\n.delete_button {\n  font-size: 25px;\n  color: red;\n  cursor: pointer;\n}\n\n.custom_primary_color {\n  /* color: #0000ff; */\n  color: #2A3F71 !important;\n}\n\n.tooltiptext {\n  color: #757575;\n}\n\n.select_download {\n  display: flex;\n  flex-direction: row;\n}\n.select_text {\n  font-weight: bold;\n}\n.select_input {\n  width: 15px;\n  height: 15px;\n}\n.form_check {\n  margin-bottom: 20px;\n}\na {\n  /* color: #0000ff; */\n  color: #2A3F71 !important;\n}\n.info-background {\n  background-color: #ffdbdb;\n}\n\n.formio-wizard-nav-container {\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n}\n.btn-wizard-nav-submit,\n.btn-wizard-nav-next,\n.btn-wizard-nav-previous {\n  margin-left: 5px;\n}\n\ndiv.upload {\n  background-color: rgb(239, 239, 239);\n  border: 1px solid #ddd;\n  border-radius: 5px;\n  display: inline-block;\n  height: 30px;\n  padding: 3px 3px 3px 3px;\n  position: relative;\n  width: 140px;\n  text-align: center;\n}\n\ndiv.upload:hover {\n  opacity: 0.95;\n}\n\ndiv.upload input[type="file"] {\n  display: input-block;\n  width: 100%;\n  height: 30px;\n  opacity: 0;\n  cursor: pointer;\n  position: absolute;\n  left: 0;\n}\n.uploadButton {\n  background-color: #425f9c;\n  border: none;\n  border-radius: 3px;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  height: 30px;\n  margin-right: 15px;\n  width: auto;\n  padding: 0 20px;\n  box-sizing: content-box;\n}\n\n.fileName {\n  font-family: Arial;\n  font-size: 14px;\n}\n\n.upload + .uploadButton {\n  height: 38px;\n}\n\n.admin-container > .header-container {\n  padding-top: 5rem !important;\n  margin-left: 3.938rem;\n  margin-right: 4.188rem;\n  padding-left: 1.938rem;\n  padding-right: 1.938rem;\n}\n\n.head-item {\n    color: #ABABAB;\n    cursor: pointer;\n    padding-bottom: 3rem;\n  }\n  \n  .head-active {\n    color: #212529;\n    border-bottom: 4px solid #4d61fc;\n  }\n  .padding-left-60 {\n    margin-left: 60px;\n  }\n  .padding-right-60 {\n    margin-left: -35px;\n  }\n.head-rule{\n    margin-top: -10px;\n    padding-top: -10px;\n  }\n  \n  .application-head\n  {\n      font-weight: bold;\n      font-size:26px;\n      display: flex;\n  }\n  .application-head-details\n  {\n      font-weight: bold;\n      font-size:30px;\n      margin-left: 10px !important;\n      display: inline-block;\n  }\n  .solid-list-icon {\n    height: 25px;\n    margin-top: 7px;\n  }\n  .application-text{\n    margin-left: 10px;\n  }\n  .application-count\n  {\n      font-size: 20px;\n      margin-top: 5px;\n      margin-left: 5px;\n  }\n  .main-header {\n    margin-left: 15px !important;\n    display: flex;\n    margin-top: 10px;\n    margin-bottom: 25px;\n    height: 30px;\n    width: 100%;\n  }\n  @media (max-width: 768px) {\n    .main-header{\n      height: 70px;\n      flex-direction: row;\n      flex-wrap: wrap;\n    }\n  }',
                  "",
                  {
                    version: 3,
                    sources: ["webpack://./src/global.css"],
                    names: [],
                    mappings:
                      "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",
                    sourcesContent: [
                      '.application-head .main-nav.nav-item\n{\n  line-height: 1.5 !important;\n}\n\n.btn-danger\n{\n    border: 1px solid #2A4071;\n    color: #2A4071 !important;\n    background-color: white !important;\n}\n\n.btn-danger:hover\n{\n    border: 1px solid #2A4071;\n    color: #2A4071 !important;\n    background-color: white !important;\n}\n\n.btn-warning\n{\n    border: 1px solid #2A4071;\n    color: #2A4071 !important;\n    background-color: white !important;\n}\n\n.btn-warning:hover\n{\n    border: 1px solid #2A4071;\n    color: #2A4071 !important;\n    background-color: white !important;\n}\n\n.btn-success{\n  background: #2A4071 !important;\n  border: 1px solid #2A4071 !important;\n}\n\n.btn-success:hover{\n  background: #2A4071 !important;\n  border: 1px solid #2A4071 !important;\n}\n\n:root {\n  --color-primary: #4d61fc;\n  --color-secondary: #6c757d;\n  --color-success: #3fb618;\n  --color-info: #4d61fc;\n  --color-warning: #fcba19;\n  --color-red: #ff0039;\n  --color-light: #f8f9fa;\n  --color-dark: #373a3c;\n  --color-black: #000;\n  --color-indigo: #6610f2;\n  --color-purple: #613d7c;\n  --color-white: #fff;\n  --color-white: #fff;\n  --color-pink: #e83e8c;\n  --color-teal: #20c997;\n  --color-orange: #f2661f;\n  --color-cyan: #9954bb;\n  --color-gray-100: #f8f9fa;\n  --colorgray-200: #e9ecef;\n  --color-gray-300: #dee2e6;\n  --color-gray-400: #ced4da;\n  --color-gray-500: #adb5bd;\n  --color-gray-600: #868e96;\n  --color-gray-700: #495057;\n  --color-gray-800: #373a3c;\n  --color-gray-900: #212529;\n\n  --logo-path: "./logo.svg";\n\n  --logo-width: 50px;\n  --appname-margin-left: 0px;\n  --appname-margin-right: 0px;\n  --appname-margin-top: 0px;\n  --appname-margin-bottom: 0px;\n\n  --navbar-items-font-size:16px;\n  --navbar-items-font-weight: 600;\n\n  --navbar-background: var(--color-white);\n  --navbar-items: var(--color-black);\n  --navbar-active: var(--color-primary);\n  --button-primary-background: var(--color-primary);\n  --navbar-app-name: var(--color-black);\n  --navbar-logo-width: var(--logo-width);\n\n  --navbar-logo-path: var(--logo-path);\n}\n\n.container,\n.container-sm,\n.container-md,\n.container-lg,\n.container-xl {\n  max-width: 100vw;\n}\n.container {\n  margin-top: 3px;\n  padding-left: 0;\n  padding-right: 0;\n  height: 100%;\n}\n.overflow-x-auto {\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n\n.overflow-y-auto {\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.text-primary {\n  color: var(--color-primary);\n}\n.footer-text {\n  font-size: 18px;\n}\n.btn-primary {\n  background-color: var(--button-primary-background);\n}\n.btn-outline-primary:not(:disabled) {\n  border-color: #0071eb;\n  color: #0071eb;\n}\n.btn-outline-primary:not(:disabled):hover {\n  color: var(--color-white);\n  background-color: var(--color-primary);\n}\n\n.task-container {\n  height: 100% !important;\n}\n.logo {\n  height: 1.9em;\n}\nh4 {\n  font-size: 1.2rem;\n}\n#main {\n  min-height: 85vh;\n  padding-bottom: 1.5rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\nbody {\n  font-size: 16px;\n  font-family: Nunito Sans, SemiBold;\n  overflow: hidden;\n}\n.loader-container {\n  display: flex;\n  height: 80vh;\n  justify-content: center;\n  align-items: center;\n}\n.loader {\n  position: absolute;\n  margin: auto;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n}\n.input-group .input-group-addon {\n  position: absolute;\n  right: 5px;\n  top: 7px;\n}\n.input-group .radio-inline {\n  margin-left: 20px;\n}\n.input-group label {\n  margin-right: 2rem;\n}\n.well {\n  border: 1px solid #eeeeee;\n  padding: 1rem;\n  background-color: #f8f8f8bf;\n}\n.formio-component-panel {\n  border: 1px solid #eeeeee;\n}\n\n.formio-component-panel .panel-heading {\n  background-color: #eeeeee;\n  padding: 10px 0 10px 10px;\n}\n.formio-component-panel .panel-heading .panel-title i {\n  font-size: 12px;\n}\n.panel-body {\n  padding: 1.5rem 2rem 1.5rem 2rem;\n}\n\n.page-item.active .page-link {\n  background-color: #036 !important;\n  border-color: #56595d !important;\n  color: white !important;\n}\nh5,\n.h5 {\n  font-size: 16px !important;\n}\n.bg-default {\n  background-color: #38598a;\n  border: #38598a;\n  color: white !important;\n}\n.text-muted {\n  color: #868e96 !important;\n}\n\ni.fa.fa-question-circle.text-muted {\n  color: #2e96ff !important;\n}\n\n.panel-heading {\n  background-color: #38598a;\n  border: #38598a;\n  color: white !important;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 8px;\n}\n.form-view-wrapper {\n  min-height: 75vh;\n}\n.btn.signature-pad-refresh {\n  z-index: 99 !important;\n}\n\n.formio-error-wrapper,\n.has-error {\n  color: red;\n  background-color: #fff;\n  border-color: red;\n}\n.formio-error-wrapper,\n.has-error label {\n  color: red;\n}\n.formio-errors .error {\n  color: red;\n}\n.is-invalid {\n  background-color: #ffd1d1;\n}\n.active-tab {\n  background-color: transparent;\n  color: var(--navbar-active) !important;\n}\n\n.active-tab-dropdown > #dashboard-dropdown {\n  background-color: transparent;\n  filter: invert(36%) sepia(38%) saturate(7152%) hue-rotate(227deg)\n    brightness(101%) contrast(98%);\n}\n.active-tab-dropdown > #task-dropdown {\n  background-color: transparent;\n  filter: invert(36%) sepia(38%) saturate(7152%) hue-rotate(227deg)\n    brightness(101%) contrast(98%);\n}\n.dropdown-item:hover {\n  filter: none;\n  background-color: #e9ecef;\n}\n.selected-tag {\n  color: var(--color-info) !important;\n  border-bottom: 1px solid var(--color-info);\n  background-color: transparent;\n}\n.lbl-logout {\n  font-size: 16px;\n  color: var(--color-dark);\n  margin-left: 10px;\n  cursor: pointer;\n}\n\n.dropdown-menu:before {\n  position: absolute;\n  top: -7px;\n  right: 9px;\n  display: inline-block;\n  border-right: 7px solid transparent;\n  border-bottom: 7px solid #ccc;\n  border-left: 7px solid transparent;\n  border-bottom-color: rgba(0, 0, 0, 0.2);\n  content: "";\n}\n\n.dropdown-menu:after {\n  position: absolute;\n  top: -6px;\n  right: 10px;\n  display: inline-block;\n  border-right: 6px solid transparent;\n  border-bottom: 6px solid #ffffff;\n  border-left: 6px solid transparent;\n  content: "";\n}\n\n.taskDropdown > .dropdown-menu::before {\n  left: 10%;\n  right: 100%;\n}\n.taskDropdown > .dasboard-icon-dropdown {\n  margin-bottom: 5px;\n}\n.taskDropdown > .task-dropdown-icon {\n  margin-bottom: 1px;\n}\n.taskDropdown > .applications-icon-header {\n  width: 23px;\n  height: 23px;\n  margin-bottom: 5px;\n}\n.taskDropdown > .dropdown-menu::after {\n  left: 10%;\n  right: 100%;\n}\n\n.custom-profile {\n  position: absolute;\n  margin-left: 220px;\n  padding-bottom: 10px;\n  z-index: 10;\n}\n/* .d-md-none {\n  .dropup,\n  .dropright,\n  .dropdown,\n  .dropleft {\n    position: initial;\n  }\n  .nav-dropdown .dropdown-menu {\n    position: absolute;\n  }\n  .dropdown-menu:before {\n    position: absolute;\n    top: -6px;\n    right: 4px;\n    display: inline-block;\n    border-right: 7px solid transparent;\n    border-bottom: 7px solid #ccc;\n    border-left: 7px solid transparent;\n    border-bottom-color: rgba(0, 0, 0, 0.2);\n    content: "";\n  }\n\n  .dropdown-menu:after {\n    position: absolute;\n    top: -5px;\n    right: 5px;\n    display: inline-block;\n    border-right: 6px solid transparent;\n    border-bottom: 6px solid #ffffff;\n    border-left: 6px solid transparent;\n    content: "";\n  }\n}\n.lbl-app-nanme {\n  font-size: 20px;\n  color: #ffff;\n  margin-bottom: 0;\n  font-weight: bold;\n  margin-left: 20px;\n}\n.app-name {\n  color: $yellow;\n  margin: 0;\n}\n.nav-icons {\n  vertical-align: text-top;\n  margin-right: 3px;\n}\n.nav-dropdown .dropdown-menu {\n  height: auto !important;\n}\n.table-bordered thead th,\n.table-bordered thead td {\n  background-color: #f2f2f2 !important;\n}\n.navbar-dark.navbar-toggler {\n  border-color: white;\n} */\n.main-header {\n  margin-left: 15px !important;\n  display: flex;\n  margin-top: 10px;\n  margin-bottom: 25px;\n  height: 30px;\n  width: 100%;\n}\n@media (max-width: 768px) {\n  .main-header {\n    height: 70px;\n    flex-direction: row;\n    flex-wrap: wrap;\n  }\n}\n.back-icon {\n  display: flex;\n}\n.sub-container {\n  margin-left: 15px;\n}\n.task-head {\n  font-weight: bold;\n  font-size: 30px;\n  margin-left: 10px !important;\n}\n.icon-wp-forms {\n  height: 30px;\n}\n.forms-text {\n  vertical-align: bottom;\n  margin-left: 10px;\n  margin-bottom: 0px;\n}\n.task-head-icons {\n  height: 30px;\n  width: 30px;\n}\n.task-head-details {\n  font-weight: bold;\n  font-size: 30px;\n  margin-left: 10px !important;\n}\n.icon-wp-forms {\n  height: 30px;\n}\n.forms-text {\n  vertical-align: middle;\n  margin-left: 10px;\n}\n.btn-right {\n  float: right;\n  margin-left: auto;\n}\n.btn-center {\n  float: right;\n  margin-left: auto;\n}\n\n.btn.btn-link:focus,\n.btn.btn-link.focus {\n  box-shadow: none;\n}\n.div-center {\n  align-self: center;\n}\n.tooltip-inner {\n  color: black !important;\n  background-color: white !important;\n  border: 0.5px solid !important;\n  text-align: left;\n}\n\n.navbar-brand {\n  align-items: center;\n}\n\n.navbar-brand .img-fluid,\n.navbar-brand .img-thumbnail {\n  max-width: 100%;\n  height: 100%;\n}\n\nselect option:hover {\n  box-shadow: 0 0 10px 100px #000 inset;\n}\n.modal-dialog {\n  margin: 8.75rem auto !important;\n}\n\n#main {\n  background-color: #fff;\n  padding: 10px;\n  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2),\n    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);\n}\n\n#sidebar {\n  background: #fff;\n}\n\n.content {\n  background-color: #f8f8f8;\n}\n\n#sidebar ul li.active > a,\n#sidebar a[aria-expanded="true"] {\n  background: #fff;\n}\n\nheader nav {\n  border-bottom: #fff;\n}\n\n.topheading-border-bottom {\n  z-index: 2000;\n  border-bottom: 2px solid #4d61fc !important;\n  padding: 0 0.5rem !important;\n  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2),\n    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);\n}\n\n.rounded-circle {\n  border-radius: 50% !important;\n  border: 2px solid lightgrey;\n  height: 40px;\n  width: 40px;\n}\n\n.sort-span {\n  cursor: pointer;\n  border: 1px solid #0071eb;\n  border-radius: 0.25rem;\n  padding: 4px;\n  padding-left: 6px;\n  padding-top: 0px;\n  border-radius: 6px;\n  width: 35px;\n}\n\n.sort-span:hover {\n  background-color: #0071eb;\n}\n.sort-span:hover > .fa-lg-hover {\n  color: white;\n}\n\ndiv[disabled] {\n  pointer-events: none;\n  opacity: 0.7;\n}\n\n.hide-scroll {\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n}\n.classApplicationId {\n  width: 15%;\n}\n.form_select {\n  width: 15%;\n}\n.form_operation {\n  width: 30%;\n}\n.classApplicationName {\n  width: 20%;\n}\n.form_title {\n  width: 40%;\n}\n.navbar-light .navbar-nav .nav-link {\n  color: rgba(0, 0, 0, 0.9);\n}\n\n/* overwriting default styles */\n.MuiTab-wrapper {\n  font-size: 16px;\n}\n.formcomponents .formcomponent {\n  font-size: 1em;\n}\n.button_font {\n  font-size: 14px;\n  font-weight: bold;\n}\n.delete_button {\n  font-size: 25px;\n  color: red;\n  cursor: pointer;\n}\n\n.custom_primary_color {\n  /* color: #0000ff; */\n  color: #2A3F71 !important;\n}\n\n.tooltiptext {\n  color: #757575;\n}\n\n.select_download {\n  display: flex;\n  flex-direction: row;\n}\n.select_text {\n  font-weight: bold;\n}\n.select_input {\n  width: 15px;\n  height: 15px;\n}\n.form_check {\n  margin-bottom: 20px;\n}\na {\n  /* color: #0000ff; */\n  color: #2A3F71 !important;\n}\n.info-background {\n  background-color: #ffdbdb;\n}\n\n.formio-wizard-nav-container {\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n}\n.btn-wizard-nav-submit,\n.btn-wizard-nav-next,\n.btn-wizard-nav-previous {\n  margin-left: 5px;\n}\n\ndiv.upload {\n  background-color: rgb(239, 239, 239);\n  border: 1px solid #ddd;\n  border-radius: 5px;\n  display: inline-block;\n  height: 30px;\n  padding: 3px 3px 3px 3px;\n  position: relative;\n  width: 140px;\n  text-align: center;\n}\n\ndiv.upload:hover {\n  opacity: 0.95;\n}\n\ndiv.upload input[type="file"] {\n  display: input-block;\n  width: 100%;\n  height: 30px;\n  opacity: 0;\n  cursor: pointer;\n  position: absolute;\n  left: 0;\n}\n.uploadButton {\n  background-color: #425f9c;\n  border: none;\n  border-radius: 3px;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  height: 30px;\n  margin-right: 15px;\n  width: auto;\n  padding: 0 20px;\n  box-sizing: content-box;\n}\n\n.fileName {\n  font-family: Arial;\n  font-size: 14px;\n}\n\n.upload + .uploadButton {\n  height: 38px;\n}\n\n.admin-container > .header-container {\n  padding-top: 5rem !important;\n  margin-left: 3.938rem;\n  margin-right: 4.188rem;\n  padding-left: 1.938rem;\n  padding-right: 1.938rem;\n}\n\n.head-item {\n    color: #ABABAB;\n    cursor: pointer;\n    padding-bottom: 3rem;\n  }\n  \n  .head-active {\n    color: #212529;\n    border-bottom: 4px solid #4d61fc;\n  }\n  .padding-left-60 {\n    margin-left: 60px;\n  }\n  .padding-right-60 {\n    margin-left: -35px;\n  }\n.head-rule{\n    margin-top: -10px;\n    padding-top: -10px;\n  }\n  \n  .application-head\n  {\n      font-weight: bold;\n      font-size:26px;\n      display: flex;\n  }\n  .application-head-details\n  {\n      font-weight: bold;\n      font-size:30px;\n      margin-left: 10px !important;\n      display: inline-block;\n  }\n  .solid-list-icon {\n    height: 25px;\n    margin-top: 7px;\n  }\n  .application-text{\n    margin-left: 10px;\n  }\n  .application-count\n  {\n      font-size: 20px;\n      margin-top: 5px;\n      margin-left: 5px;\n  }\n  .main-header {\n    margin-left: 15px !important;\n    display: flex;\n    margin-top: 10px;\n    margin-bottom: 25px;\n    height: 30px;\n    width: 100%;\n  }\n  @media (max-width: 768px) {\n    .main-header{\n      height: 70px;\n      flex-direction: row;\n      flex-wrap: wrap;\n    }\n  }',
                    ],
                    sourceRoot: "",
                  },
                ]);
                const i = a;
              },
              645: (n) => {
                "use strict";
                n.exports = function (n) {
                  var o = [];
                  return (
                    (o.toString = function () {
                      return this.map(function (o) {
                        var r = n(o);
                        return o[2]
                          ? "@media ".concat(o[2], " {").concat(r, "}")
                          : r;
                      }).join("");
                    }),
                    (o.i = function (n, r, A) {
                      "string" == typeof n && (n = [[null, n, ""]]);
                      var t = {};
                      if (A)
                        for (var e = 0; e < this.length; e++) {
                          var a = this[e][0];
                          null != a && (t[a] = !0);
                        }
                      for (var i = 0; i < n.length; i++) {
                        var p = [].concat(n[i]);
                        (A && t[p[0]]) ||
                          (r &&
                            (p[2]
                              ? (p[2] = "".concat(r, " and ").concat(p[2]))
                              : (p[2] = r)),
                          o.push(p));
                      }
                    }),
                    o
                  );
                };
              },
              15: (n) => {
                "use strict";
                function o(n, o) {
                  (null == o || o > n.length) && (o = n.length);
                  for (var r = 0, A = new Array(o); r < o; r++) A[r] = n[r];
                  return A;
                }
                n.exports = function (n) {
                  var r,
                    A,
                    t =
                      ((A = 4),
                      (function (n) {
                        if (Array.isArray(n)) return n;
                      })((r = n)) ||
                        (function (n, o) {
                          var r =
                            n &&
                            (("undefined" != typeof Symbol &&
                              n[Symbol.iterator]) ||
                              n["@@iterator"]);
                          if (null != r) {
                            var A,
                              t,
                              e = [],
                              a = !0,
                              i = !1;
                            try {
                              for (
                                r = r.call(n);
                                !(a = (A = r.next()).done) &&
                                (e.push(A.value), !o || e.length !== o);
                                a = !0
                              );
                            } catch (n) {
                              ((i = !0), (t = n));
                            } finally {
                              try {
                                a || null == r.return || r.return();
                              } finally {
                                if (i) throw t;
                              }
                            }
                            return e;
                          }
                        })(r, A) ||
                        (function (n, r) {
                          if (n) {
                            if ("string" == typeof n) return o(n, r);
                            var A = Object.prototype.toString
                              .call(n)
                              .slice(8, -1);
                            return (
                              "Object" === A &&
                                n.constructor &&
                                (A = n.constructor.name),
                              "Map" === A || "Set" === A
                                ? Array.from(n)
                                : "Arguments" === A ||
                                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
                                      A,
                                    )
                                  ? o(n, r)
                                  : void 0
                            );
                          }
                        })(r, A) ||
                        (function () {
                          throw new TypeError(
                            "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                          );
                        })()),
                    e = t[1],
                    a = t[3];
                  if (!a) return e;
                  if ("function" == typeof btoa) {
                    var i = btoa(
                        unescape(encodeURIComponent(JSON.stringify(a))),
                      ),
                      p =
                        "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(
                          i,
                        ),
                      d = "/*# ".concat(p, " */"),
                      l = a.sources.map(function (n) {
                        return "/*# sourceURL="
                          .concat(a.sourceRoot || "")
                          .concat(n, " */");
                      });
                    return [e].concat(l).concat([d]).join("\n");
                  }
                  return [e].join("\n");
                };
              },
              379: (n) => {
                "use strict";
                var o = [];
                function r(n) {
                  for (var r = -1, A = 0; A < o.length; A++)
                    if (o[A].identifier === n) {
                      r = A;
                      break;
                    }
                  return r;
                }
                function A(n, A) {
                  for (var e = {}, a = [], i = 0; i < n.length; i++) {
                    var p = n[i],
                      d = A.base ? p[0] + A.base : p[0],
                      l = e[d] || 0,
                      c = "".concat(d, " ").concat(l);
                    e[d] = l + 1;
                    var C = r(c),
                      s = {
                        css: p[1],
                        media: p[2],
                        sourceMap: p[3],
                        supports: p[4],
                        layer: p[5],
                      };
                    if (-1 !== C) (o[C].references++, o[C].updater(s));
                    else {
                      var B = t(s, A);
                      ((A.byIndex = i),
                        o.splice(i, 0, {
                          identifier: c,
                          updater: B,
                          references: 1,
                        }));
                    }
                    a.push(c);
                  }
                  return a;
                }
                function t(n, o) {
                  var r = o.domAPI(o);
                  return (
                    r.update(n),
                    function (o) {
                      if (o) {
                        if (
                          o.css === n.css &&
                          o.media === n.media &&
                          o.sourceMap === n.sourceMap &&
                          o.supports === n.supports &&
                          o.layer === n.layer
                        )
                          return;
                        r.update((n = o));
                      } else r.remove();
                    }
                  );
                }
                n.exports = function (n, t) {
                  var e = A((n = n || []), (t = t || {}));
                  return function (n) {
                    n = n || [];
                    for (var a = 0; a < e.length; a++) {
                      var i = r(e[a]);
                      o[i].references--;
                    }
                    for (var p = A(n, t), d = 0; d < e.length; d++) {
                      var l = r(e[d]);
                      0 === o[l].references && (o[l].updater(), o.splice(l, 1));
                    }
                    e = p;
                  };
                };
              },
              569: (n) => {
                "use strict";
                var o = {};
                n.exports = function (n, r) {
                  var A = (function (n) {
                    if (void 0 === o[n]) {
                      var r = document.querySelector(n);
                      if (
                        window.HTMLIFrameElement &&
                        r instanceof window.HTMLIFrameElement
                      )
                        try {
                          r = r.contentDocument.head;
                        } catch (n) {
                          r = null;
                        }
                      o[n] = r;
                    }
                    return o[n];
                  })(n);
                  if (!A)
                    throw new Error(
                      "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.",
                    );
                  A.appendChild(r);
                };
              },
              216: (n) => {
                "use strict";
                n.exports = function (n) {
                  var o = document.createElement("style");
                  return (
                    n.setAttributes(o, n.attributes),
                    n.insert(o, n.options),
                    o
                  );
                };
              },
              565: (n, o, r) => {
                "use strict";
                n.exports = function (n) {
                  var o = r.nc;
                  o && n.setAttribute("nonce", o);
                };
              },
              795: (n) => {
                "use strict";
                n.exports = function (n) {
                  var o = n.insertStyleElement(n);
                  return {
                    update: function (r) {
                      !(function (n, o, r) {
                        var A = "";
                        (r.supports &&
                          (A += "@supports (".concat(r.supports, ") {")),
                          r.media && (A += "@media ".concat(r.media, " {")));
                        var t = void 0 !== r.layer;
                        (t &&
                          (A += "@layer".concat(
                            r.layer.length > 0 ? " ".concat(r.layer) : "",
                            " {",
                          )),
                          (A += r.css),
                          t && (A += "}"),
                          r.media && (A += "}"),
                          r.supports && (A += "}"));
                        var e = r.sourceMap;
                        (e &&
                          "undefined" != typeof btoa &&
                          (A +=
                            "\n/*# sourceMappingURL=data:application/json;base64,".concat(
                              btoa(
                                unescape(encodeURIComponent(JSON.stringify(e))),
                              ),
                              " */",
                            )),
                          o.styleTagTransform(A, n, o.options));
                      })(o, n, r);
                    },
                    remove: function () {
                      !(function (n) {
                        if (null === n.parentNode) return !1;
                        n.parentNode.removeChild(n);
                      })(o);
                    },
                  };
                };
              },
              589: (n) => {
                "use strict";
                n.exports = function (n, o) {
                  if (o.styleSheet) o.styleSheet.cssText = n;
                  else {
                    for (; o.firstChild; ) o.removeChild(o.firstChild);
                    o.appendChild(document.createTextNode(n));
                  }
                };
              },
              722: (n, o, r) => {
                const A = r(905).R;
                o.s = function (n) {
                  if ((n || (n = 1), !r.y.meta || !r.y.meta.url))
                    throw (
                      console.error("__system_context__", r.y),
                      Error(
                        "systemjs-webpack-interop was provided an unknown SystemJS context. Expected context.meta.url, but none was provided",
                      )
                    );
                  r.p = A(r.y.meta.url, n);
                };
              },
              905: (n, o, r) => {
                o.R = function (n, o) {
                  var r = document.createElement("a");
                  r.href = n;
                  for (
                    var A =
                        "/" === r.pathname[0] ? r.pathname : "/" + r.pathname,
                      t = 0,
                      e = A.length;
                    t !== o && e >= 0;

                  )
                    "/" === A[--e] && t++;
                  if (t !== o)
                    throw Error(
                      "systemjs-webpack-interop: rootDirectoryLevel (" +
                        o +
                        ") is greater than the number of directories (" +
                        t +
                        ") in the URL path " +
                        n,
                    );
                  var a = A.slice(0, e + 1);
                  return r.protocol + "//" + r.host + a;
                };
                Number.isInteger;
              },
            },
            r = {};
          function A(o) {
            var t = r[o];
            if (void 0 !== t) return t.exports;
            var e = (r[o] = { id: o, exports: {} });
            return (n[o](e, e.exports, A), e.exports);
          }
          ((A.y = o),
            (A.n = (n) => {
              var o = n && n.__esModule ? () => n.default : () => n;
              return (A.d(o, { a: o }), o);
            }),
            (A.d = (n, o) => {
              for (var r in o)
                A.o(o, r) &&
                  !A.o(n, r) &&
                  Object.defineProperty(n, r, { enumerable: !0, get: o[r] });
            }),
            (A.o = (n, o) => Object.prototype.hasOwnProperty.call(n, o)),
            (A.r = (n) => {
              ("undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(n, Symbol.toStringTag, {
                  value: "Module",
                }),
                Object.defineProperty(n, "__esModule", { value: !0 }));
            }),
            (A.p = ""),
            (A.nc = void 0));
          var t = {};
          return (
            (0, A(722).s)(1),
            (() => {
              "use strict";
              (A.r(t), A.d(t, { publicApiFunction: () => m }));
              var n = A(379),
                o = A.n(n),
                r = A(795),
                e = A.n(r),
                a = A(569),
                i = A.n(a),
                p = A(565),
                d = A.n(p),
                l = A(216),
                c = A.n(l),
                C = A(589),
                s = A.n(C),
                B = A(373),
                f = {};
              function m() {}
              ((f.styleTagTransform = s()),
                (f.setAttributes = d()),
                (f.insert = i().bind(null, "head")),
                (f.domAPI = e()),
                (f.insertStyleElement = c()),
                o()(B.Z, f),
                B.Z && B.Z.locals && B.Z.locals);
            })(),
            t
          );
        })(),
      );
    },
  };
});
//# sourceMappingURL=forms-flow-theme.js.map
