
import baseEditForm from 'formiojs/components/_classes/component/Component.form';

const settingsForm = (...extend) => {
  return baseEditForm([
    {
      key: 'display',
      components: [
        {
          // You can ignore existing fields.
          key: 'placeholder',
          ignore: true,
        },
      ]
    },
    {
      key: 'data',
      components: [{
        // Or add your own. The syntax is form.io component definitions.
        type: 'tags',
        storeas: 'array',
        input: true,
        label: 'file to be uploaded',
        weight: 20,
        key: 'fileUpload', // This will be available as component.topic
        
      }],
    },
    {
      key: 'validation',
      components: [],
    },
    {
      key: 'api',
      components: [],
    },
    {
      key: 'conditional',
      components: [],
    },
    {
      key: 'logic',
      components: [],
    },
  ], ...extend);
};

export default settingsForm;

