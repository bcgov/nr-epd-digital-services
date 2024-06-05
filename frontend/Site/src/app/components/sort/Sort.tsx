import Form from "../form/Form";
import { ISort } from "./ISort";
import { notationSortBy } from "./SortConfig";

const Sort: React.FC<ISort> = ({ formData, editMode, handleSortChange }) => {
    return (
      <Form
        formRows={notationSortBy} // Import or define notationSortBy as necessary
        formData={formData}
        editMode={editMode} // You might want to make this dynamic based on your requirements
        handleInputChange={handleSortChange}
        aria-label="Sort By Form"
      />
    );
  };
  
  export default Sort;