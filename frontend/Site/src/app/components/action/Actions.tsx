import { IActions } from "./IActions";
import Dropdown from "react-bootstrap/Dropdown";
import './Actions.css';

const Actions: React.FC<IActions> = ({ label, items, onItemClick }) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-action" className="custom-action-btn">
            {label}
            </Dropdown.Toggle>
            <Dropdown.Menu className="custom-action-menu">
            {items.map((item, index) => (
                <Dropdown.Item key={index} onClick={() => onItemClick(item.value)} className="custom-action-item">
                {item.label}
                </Dropdown.Item>
            ))}
            </Dropdown.Menu>
        </Dropdown>
      );
  }

  export default Actions;