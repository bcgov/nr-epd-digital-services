"""Helper module for PDF export."""

import json
import os
import urllib.parse
import uuid
from typing import Any, Tuple, Union

import requests
from flask import current_app
from formsflow_api_utils.services import FormioService
from formsflow_api_utils.utils import HTTP_TIMEOUT
from formsflow_api_utils.utils.pdf import get_pdf_from_html, pdf_response
from nested_lookup import get_occurrences_and_values

from formsflow_documents.utils import DocUtils


class PDFService:
    """Helper class for pdf generation."""

    __slots__ = (
        "__is_form_adaptor",
        "__custom_submission_url",
        "__form_io_url",
        "__host_name",
        "__chrome_driver_path",
        "form_id",
        "submission_id",
        "formio",
        "__webapi_url",
        "__is_bundle",
        "__mapper_id",
    )

    def __init__(
        self,
        form_id: str,
        submission_id: str,
        is_bundle: bool = False,
        mapper_id: int = None,
    ) -> None:
        """
        Initializes PDFService.

        form_id: formid corresponding to the PDF
        submission_id: submissionid corresponding to the PDF.
        """
        self.__is_form_adaptor = current_app.config.get("CUSTOM_SUBMISSION_ENABLED")
        self.__custom_submission_url = current_app.config.get("CUSTOM_SUBMISSION_URL")
        self.__form_io_url = current_app.config.get("FORMIO_URL")
        self.__host_name = current_app.config.get("FORMSFLOW_DOC_API_URL")
        self.__chrome_driver_path = current_app.config.get("CHROME_DRIVER_PATH")
        self.form_id = form_id
        self.submission_id = submission_id
        self.formio = FormioService()
        self.__webapi_url = current_app.config.get("FORMSFLOW_API_URL")
        self.__is_bundle = is_bundle
        self.__mapper_id = mapper_id

    def __is_form_adapter(self) -> bool:
        """Returns whether th eapplication is using a form adaptor."""
        return self.__is_form_adaptor

    def __get_custom_submission_url(self) -> str:
        """Returns the custom submission url based on config."""
        return self.__custom_submission_url

    def __get_formio_url(self) -> str:
        """Returns the formio url based on config."""
        return self.__form_io_url

    def __get_formio_access_token(self) -> Any:
        """Returns formio access token."""
        return self.formio.get_formio_access_token()

    def __get_submission_data(self) -> Any:
        """Returns the submission data from formio."""
        formio_get_payload = {"form_id": self.form_id, "sub_id": self.submission_id}
        return self.formio.get_submission(
            formio_get_payload, self.__get_formio_access_token()
        )

    def __get_form_data(self) -> Any:
        """Returns the form data from formio."""
        return self.formio.get_form_by_id(
            self.form_id, self.__get_formio_access_token()
        )

    def __get_form(self, query_params) -> Any:
        """Returns the form data from formio."""
        return self.formio.get_form(query_params, self.__get_formio_access_token())

    def __get_chrome_driver_path(self) -> str:
        """Returns the configured chrome driver path."""
        return self.__chrome_driver_path

    def __get_headers(self, token):
        """Returns the headers."""
        return {"Authorization": token, "content-type": "application/json"}

    def __fetch_bundle_forms(self, token: str, submission_data) -> Any:
        """Returns the formids of the bundle."""
        url = f"{self.__webapi_url}/form/{self.__mapper_id}/bundles/execute-rules"
        headers = self.__get_headers(token)
        payload = {"data": submission_data.get("data")}
        current_app.logger.debug(f"API call to execute rules endpoint..{url}")
        response = requests.post(
            url, headers=headers, timeout=HTTP_TIMEOUT, data=json.dumps(payload)
        )
        current_app.logger.debug(f"Execute rules response {response}")
        data = []
        if response.status_code == 200:
            data = response.json()
        return data

    def __fetch_bundle_form_data(self, token, submission_data) -> Any:
        """Returns bundle form data & form order map."""
        bundle_forms = self.__fetch_bundle_forms(token, submission_data)
        form_ids = [form["formId"] for form in bundle_forms]
        # Initialize an empty list to store the results
        form_data = []
        # Iterate through form_ids and call self.formio.get_form_by_id for each
        for form_id in form_ids:
            form = self.formio.get_form_by_id(form_id, self.__get_formio_access_token())
            form_data.append(form)        
        # Dictionary to map formId to formOrder
        form_order_map = {form["formId"]: form["formOrder"] for form in bundle_forms}
        return form_data, form_order_map          

    def __fetch_custom_submission_data(self, token: str) -> Any:
        """Returns the submission data from form adapter."""
        sub_url = self.__get_custom_submission_url()
        submission_url = (
            f"{sub_url}/form/" + self.form_id + "/submission/" + self.submission_id
        )
        current_app.logger.debug(f"Fetching custom submission data..{submission_url}")
        headers = self.__get_headers(token)
        response = requests.get(submission_url, headers=headers, timeout=HTTP_TIMEOUT)
        current_app.logger.debug(
            f"Custom submission response code: {response.status_code}"
        )
        data = {}
        if response.status_code == 200:
            data = response.json()
        return data

    def __get_form_and_submission_urls(self, token: str) -> Tuple[str, str, str]:
        """Returns the appropriate form url and submission data based on the config."""
        form_io_url = self.__get_formio_url()
        current_app.logger.debug("Fetching form and submission data..")
        if self.__is_form_adapter():
            form_url = form_io_url + "/form/" + self.form_id
            submission_data = self.__fetch_custom_submission_data(token)
        else:
            form_url = (
                form_io_url
                + "/form/"
                + self.form_id
                + "/submission/"
                + self.submission_id
            )
            submission_data = self.__get_submission_data() if self.__is_bundle else None
        return (form_url, submission_data)

    def __get_template_params(  # pylint:disable=too-many-locals
        self,
        token: str,
    ) -> dict:
        """Returns the jinja template parameters for pdf export with formio renderer."""
        form_io_url = self.__get_formio_url()
        (form_url, submission_data) = self.__get_form_and_submission_urls(token)
        ordered_form_components = []
        if self.__is_bundle:
            current_app.logger.debug("Fetching form components for bundle..")
            form_components, form_order_map = self.__fetch_bundle_form_data(
                token, submission_data
            )
            # Add formOrder to each form component
            for form in form_components:
                form_id = form.get("_id")
                form_component = {
                    "form_order": form_order_map.get(form_id),
                    "form_component": form["components"],
                }
                ordered_form_components.append(form_component)
        return {
            "form": {
                "base_url": form_io_url,
                "project_url": form_io_url,
                "form_url": form_url,
                "token": self.__get_formio_access_token(),
                "form_adapter": self.__is_form_adapter(),
                "is_bundle": self.__is_bundle,
                "bundle_forms": ordered_form_components,
                "submission_data": submission_data,
            }
        }

    @staticmethod
    def __generate_template_name() -> str:
        """Generate unique template name."""
        return f"{str(uuid.uuid4())}.html"

    @staticmethod
    def __generate_template_variables_name() -> str:
        """Generate unique template variable name."""
        return f"{str(uuid.uuid4())}.json"

    @staticmethod
    def __get_template_path() -> str:
        """Returns the path to template directory."""
        path = os.path.dirname(__file__)
        path = path.replace("services", "templates")
        return path

    def __generate_pdf_file_name(self) -> str:
        """Generated the PDF file name."""
        return "Application_" + self.form_id + "_" + self.submission_id + "_export.pdf"

    def __get_render_url(
        self,
        template_name: Union[str, None] = None,
        template_variable_name: Union[str, None] = None,
    ) -> str:
        """Returns the render URL."""
        url = (
            self.__host_name
            + "/form/"
            + self.form_id
            + "/submission/"
            + self.submission_id
            + "/render"
        )

        params = []
        if self.__is_bundle:
            params.append("is_bundle=true")
            params.append(f"mapper_id={self.__mapper_id}")
        if template_name:
            params.append(f"template_name={self.__url_encode(template_name)}")
        if template_variable_name:
            params.append(
                f"template_variable={self.__url_encode(template_variable_name)}"
            )

        if params:
            url += "?" + "&".join(params)
        current_app.logger.debug(f"Render URL {url}")
        return url

    @staticmethod
    def __get_render_args(
        timezone: str, token: str, use_template: bool = False
    ) -> dict:
        """Returns PDF render arguments."""
        args = {"wait": "completed", "timezone": timezone, "auth_token": token}
        if use_template:
            del args["wait"]
        return args

    @staticmethod
    def __url_encode(payload: str) -> str:
        """Escapes url unsafe characters."""
        return urllib.parse.quote(payload)

    def __read_json(self, file_name: str) -> Any:
        """Reads the json file contents to a variable."""
        path = self.__get_template_path()
        with open(f"{path}/{file_name}", encoding="utf-8") as file:
            data = json.load(file)
            file.close()
            return data

    def get_render_status(
        self, token: str, template_name: Union[str, None] = None
    ) -> int:
        """Returns the render status code."""
        res = requests.get(
            url=self.__get_render_url(template_name),
            headers={"Authorization": token},
            timeout=HTTP_TIMEOUT,
        )
        return res.status_code

    def __format_data(self, form_data, submission_data):
        """Helper function to format the data for a form."""
        formatted_data = {"data": {}}

        for key, value in submission_data["data"].items():
            key_formatted = get_occurrences_and_values([form_data], value=key)[key].get(
                "values"
            )
            key_formatted = (
                key_formatted[0].get("label", "") if len(key_formatted) > 0 else None
            )
            if key_formatted is None:
                continue
            value_formatted = value
            if value and DocUtils.is_camel_case(value):
                value_formatted = get_occurrences_and_values([form_data], value=value)[
                    value
                ].get("values")
                value_formatted = (
                    value_formatted[0].get("label", "")
                    if len(value_formatted) > 0
                    else value
                )
            formatted_data["data"][key] = {
                "label": key_formatted,
                "value": value_formatted,
            }

        return formatted_data

    def __get_formatted_data(self, form_data, submission_data):
        """Returns the presentable data from the submission data for a single form."""
        formatted_data = self.__format_data(form_data, submission_data)
        return {"form": {"form": form_data, "data": formatted_data["data"]}}

    def __get_formatted_data_bundle(
        self, form_data_list, submission_data, form_order_map
    ):
        """Handles multiple forms and formats their submission data.

        {"form": [{"form1": {"form": form_data, "data": {}}}, {"form2": {"form": form_data, "data": {}}}]
        """
        submission_data_formatted = {"form": []}

        # Sort form_data_list based on formOrder
        form_data_list_sorted = sorted(
            form_data_list, key=lambda x: form_order_map.get(x["_id"], float("inf"))
        )

        for form_index, form_data in enumerate(form_data_list_sorted):
            form_key = f"form{form_index + 1}"
            formatted_data = self.__format_data(form_data, submission_data)
            submission_data_formatted["form"].append(
                {form_key: {"form": form_data, "data": formatted_data["data"]}}
            )
        return submission_data_formatted

    def get_render_data(  # pylint: disable=too-many-arguments
        self,
        use_template: bool,
        template_variable_name: Union[str, None],
        token: str,
    ) -> Any:
        """
        Returns the render data for the pdf template.

        use_template: boolean, whether to use a template for generating pdf.
        template_variable_name: template variable file name for requests with
        template variable payload.
        token: token for the template parameters when using formio renderer.
        Raw data will be passed to the template if the export is using any
        form of template. Else default formio renderer will be used where
        only the formio render parameters will be passed to the template.
        """
        if not use_template:
            return self.__get_template_params(
                token=token,
            )
        if template_variable_name:
            return self.__read_json(template_variable_name)

        submission_data = (
            self.__fetch_custom_submission_data(token)
            if self.__is_form_adapter()
            else self.__get_submission_data()
        )
        form_order_map = {}
        if self.__is_bundle:
            form_data, form_order_map = self.__fetch_bundle_form_data(
                token, submission_data
            )
        else:
            form_data = self.__get_form_data()
        formattted_data = (
            self.__get_formatted_data_bundle(form_data, submission_data, form_order_map)
            if self.__is_bundle
            else self.__get_formatted_data(form_data, submission_data)
        )
        return formattted_data

    def __write_to_file(
        self, template_name: str, content: Union[str, dict], is_json: bool = False
    ) -> None:
        """Write data to file."""
        path = self.__get_template_path()
        with open(f"{path}/{template_name}", "w", encoding="utf-8") as file:
            # disabling pylint warning since it is a function call
            json.dump(  # pylint: disable=expression-not-assigned
                content, file
            ) if is_json else file.write(content)
            file.close()

    def create_template(
        self, template: str, template_var: dict = None
    ) -> Tuple[str, Union[str, None]]:
        """
        Creates a temporary template in the template directory.

        template: base64 encoded template, supported template formats: jinja
        """
        template_name = self.__generate_template_name()
        template_var_name = (
            self.__generate_template_variables_name() if template_var else None
        )
        decoded_template = DocUtils.b64decode(template)
        self.__write_to_file(template_name, content=decoded_template)
        if template_var:
            self.__write_to_file(template_var_name, content=template_var, is_json=True)
        return (template_name, template_var_name)

    def search_template(self, file_name: str) -> bool:
        """
        Check if the given file exists in the template directory.

        file_name: name of the file to check with extension.
        """
        path = self.__get_template_path()
        current_app.logger.info("Searching for template...")
        return os.path.isfile(f"{path}/{file_name}")

    def delete_template(self, file_name: str) -> None:
        """
        Delete the given file from template directory.

        file_name: name of the file with extension.
        """
        try:
            path = self.__get_template_path()
            os.remove(f"{path}/{file_name}")
        except BaseException as err:  # pylint: disable=broad-except
            current_app.logger.error(err)
            current_app.logger.error(
                f"Failed to delete template: {file_name} not found"
            )

    def generate_pdf(  # pylint: disable=too-many-arguments
        self,
        timezone: str,
        token: str,
        template_name: Union[str, None] = None,
        template_variable_name: str = None,
    ) -> Any:
        """Generates PDF from HTML."""
        pdf = get_pdf_from_html(
            self.__get_render_url(template_name, template_variable_name),
            self.__get_chrome_driver_path(),
            args=self.__get_render_args(timezone, token, bool(template_name)),
        )
        return pdf_response(pdf, self.__generate_pdf_file_name()) if pdf else False
