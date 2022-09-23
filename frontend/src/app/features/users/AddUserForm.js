import { useState } from "react";
import { useDispatch } from "react-redux";
import { userAdded } from "./UsersSlice";
import React from "react";

const AddUserForm = () => {
  const [name, setName] = useState("");

  const dispatch = useDispatch();

  const onNameChanged = (event) => setName(event.target.value);

  const onSaveClicked = () => {
    if (name) {
      dispatch(userAdded(name));
    }
  };

  return (
    <section>
      <h2>Add New User</h2>
      <form>
        <label htmlFor="userName">User Name:</label>
        <input
          type="text"
          name="userName"
          id="userName"
          value={name}
          onChange={onNameChanged}
        ></input>
        <button type="button" onClick={onSaveClicked}>
          Save User
        </button>
      </form>
    </section>
  );
};

export default AddUserForm;
