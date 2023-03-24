import { Components } from "formiojs";
//import L from 'leaflet';

export default class MapComponent extends Components.components.base {
  static schema(...extend) {
    return Components.components.base.schema({
      type: 'map',
      label: 'Map',
      key: 'map',
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Map',
      group: 'advanced',
      icon: 'fa fa-map',
      schema: MapComponent.schema(),
    };
  }
  init(){
    super.init();
  }
    // this.map = L.map(this.element.querySelector('#map')).setView(this.component.center, this.component.zoom);
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    // }).addTo(this.map);
    // this.marker = L.marker(this.component.center).addTo(this.map);
    // this.map.on('click', (event) => {
    //   this.setValue(event.latlng);
    //   this.marker.setLatLng(event.latlng);
    // });

  render() {
    return <div>This is a map component!</div>;
  }
}