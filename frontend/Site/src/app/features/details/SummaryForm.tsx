import React, { FC, useState } from "react";
import { FormFieldType, IFormField } from "../../components/form/IForm";
import Form from "../../components/form/Form";
import { Sites } from "../site/dto/Site";
import "./SummaryForm.css"

interface SummaryFormProps{
    sitesDetails: Sites,
    edit: boolean
}

const SummaryForm:FC<SummaryFormProps> = ({sitesDetails, edit}) => {
    console.log("sitesDetails",sitesDetails)
  const formRows: IFormField[][] = [
    [
      {
        type: FormFieldType.Text,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "id",
        value: sitesDetails?.id,
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        customLabelCss: 'custom-lbl-text',
        customInputTextCss:'custom-input-text',
      },
    ],
    [
      {
        type: FormFieldType.Group,
        label: "Latitude (D, M, S)",
        value: "",
        children: [
          {
            type: FormFieldType.Text,
            label: "Deg",
            placeholder: "Deg",
            graphQLPropertyName: "latDegrees",
            value: "",
            suffix: "d ",
            validation: {
              pattern: /^[0-9.\s]*$/,
              customMessage:
                "Latitude Degrees can only contain numbers and decimal points",
            },
            allowNumbersOnly: true,
            customLabelCss: 'custom-lbl-text',
            customInputTextCss:'custom-input-text',
          },
          {
            type: FormFieldType.Text,
            label: "Min",
            placeholder: "Min",
            graphQLPropertyName: "latMinutes",
            value: "",
            suffix: "m ",
            validation: {
              pattern: /^[0-9.\s]*$/,
              customMessage:
                "Latitude Minutes can only contain numbers and decimal points",
            },
            allowNumbersOnly: true,
            customLabelCss: 'custom-lbl-text',
            customInputTextCss:'custom-input-text',
          },
          {
            type: FormFieldType.Text,
            label: "Sec",
            placeholder: "Sec",
            graphQLPropertyName: "latSeconds",
            value: "",
            suffix: "s ",
            validation: {
              pattern: /^[0-9.\s]*$/,
              customMessage:
                "Latitude Seconds can only contain numbers and decimal points",
            },
            allowNumbersOnly: true,
            customLabelCss: 'custom-lbl-text',
            customInputTextCss:'custom-input-text',
          },
        ],
      },

      {
        type: FormFieldType.Group,
        label: "Longitude (D, M, S)",
        value: "",
        children: [
          {
            type: FormFieldType.Text,
            label: "Deg",
            placeholder: "Deg",
            graphQLPropertyName: "longDegrees",
            value: "",
            validation: {
              pattern: /^[0-9.\s]*$/,
              customMessage:
                "Longitude Degrees can only contain numbers and decimal points",
            },
            allowNumbersOnly: true,
          },
          {
            type: FormFieldType.Text,
            label: "Min",
            placeholder: "Min",
            graphQLPropertyName: "longMinutes",
            value: "",
            validation: {
              pattern: /^[0-9.\s]*$/,
              customMessage:
                "Longitude Minutes can only contain numbers and decimal points",
            },
            allowNumbersOnly: true,
          },
          {
            type: FormFieldType.Text,
            label: "Sec",
            placeholder: "Sec",
            graphQLPropertyName: "longSeconds",
            value: "",
            validation: {
              pattern: /^[0-9.\s]*$/,
              customMessage:
                "Longitude Seconds can only contain numbers and decimal points",
            },
            allowNumbersOnly: true,
          },
        ],
      },
    ],
    [
      {
        type: FormFieldType.Text,
        label: "Site Address",
        placeholder: "Site Address",
        graphQLPropertyName: "addrLine_1",
        value: sitesDetails?.address,
      },
      {
        type: FormFieldType.Text,
        label: "Region",
        placeholder: "Region",
        graphQLPropertyName: "region",
        value: "",
      },
    ],
    [
      {
        type: FormFieldType.Text,
        label: "Common Name",
        placeholder: "Common Name",
        graphQLPropertyName: "commonName",
        value: "",
      },
    ],
    [
      {
        type: FormFieldType.Text,
        label: "Location Description",
        placeholder: "Location Description",
        graphQLPropertyName: "generalDescription",
        value: "",
      },
    ],
    [
      {
        type: FormFieldType.Text,
        label: "Site Risk Classification",
        placeholder: "Site Risk Classification",
        graphQLPropertyName: "siteRiskCode",
        value: "",
      },
    ],
  ];

  const [formData, setFormData] = useState<{
    [key: string]: any | [Date, Date];
  }>({});

  return (
    <form onSubmit={() => {}}>
      <Form editMode={edit}
        formRows={formRows}
        formData={sitesDetails}
        handleInputChange={() => {}}
      />
    </form>
  );
};

export default SummaryForm;
