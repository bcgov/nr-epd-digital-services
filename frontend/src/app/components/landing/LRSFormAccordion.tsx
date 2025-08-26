import { Accordion } from "react-bootstrap";
import "./LRSFormAccordion.css";

export type LRSForm = {
  name: string;
  copy: string;
  url: string;
};

export const LRSFormAccordion = (forms: Array<LRSForm>): JSX.Element => {
  const accordionItems = forms.map((form, key) =>
    AccordionItem(form, key.toString()),
  );
  return <Accordion>{accordionItems}</Accordion>;
};

const AccordionItem = (form: LRSForm, key: string): JSX.Element => {
  return (
    <Accordion.Item
      id="accordion-item"
      className=" my-4 border"
      key={key}
      eventKey={key}
    >
      <Accordion.Header
        id="accordion-item-header"
        className="accordion-item-header"
      >
        {form.name}
      </Accordion.Header>
      <Accordion.Body id="accordion-item-body">
        <p>
          {form.copy}
          <br />
          <a href={form.url}> Please Click Here for the form </a>
        </p>
      </Accordion.Body>
    </Accordion.Item>
  );
};
