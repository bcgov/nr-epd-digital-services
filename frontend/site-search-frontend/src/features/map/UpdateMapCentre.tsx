import { useMap } from "react-leaflet/hooks";

export default function UpdateMapCentre(props) {
    const map = useMap();
    map.panTo(props.mapCentre);
    // map.setZoom(props.zoom)
    // map.setView(props.mapCentre, props.zoom)
    return null;
  }