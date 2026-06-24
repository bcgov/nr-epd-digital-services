import { Components } from '@formio/js';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ChefsMapViewer } from './ChefsMapViewer';

const FieldComponent = Components.components.field;

class ChefsMapFormioComponent extends FieldComponent {
  reactRoot: Root | null = null;

  static schema(...extend: unknown[]) {
    return FieldComponent.schema(
      {
        type: 'map',
        label: 'Map',
        key: 'map',
        input: true,
        tableView: false,
      },
      ...extend,
    );
  }

  static get builderInfo() {
    return {
      title: 'Map',
      group: 'basic',
      icon: 'map',
      weight: 70,
      schema: ChefsMapFormioComponent.schema(),
    };
  }

  get defaultSchema() {
    return ChefsMapFormioComponent.schema();
  }

  render() {
    return super.render(
      '<div ref="chefsMapMount" class="chefs-map-formio-mount"></div>',
    );
  }

  attach(element: HTMLElement) {
    const attached = super.attach(element);
    this.loadRefs(element, { chefsMapMount: 'single' });
    this.mountMap();
    return attached;
  }

  mountMap() {
    if (!this.refs.chefsMapMount) {
      return;
    }
    if (!this.reactRoot) {
      this.reactRoot = createRoot(this.refs.chefsMapMount);
    }
    this.renderMap();
  }

  renderMap() {
    if (!this.reactRoot) {
      return;
    }
    this.reactRoot.render(
      createElement(ChefsMapViewer, { value: this.getValue() }),
    );
  }

  setValue(value: unknown, flags?: Record<string, unknown>) {
    const changed = super.setValue(value, flags);
    this.renderMap();
    return changed;
  }

  detach() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }
    return super.detach();
  }
}

let registered = false;

/** Register read-only CHEFS map renderer for Form.io (call once before rendering CHEFS forms). */
export function registerChefsMapComponent(): void {
  if (registered) {
    return;
  }
  Components.addComponent('map', ChefsMapFormioComponent);
  registered = true;
}
