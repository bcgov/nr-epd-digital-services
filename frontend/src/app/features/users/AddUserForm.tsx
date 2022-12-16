import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewUser } from "./UsersSlice";
import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AppDispatch } from "../../Store";
import { User } from "./dto/User";

const AddUserForm = () => {
  const [name, setName] = useState("GraphQLTest");
  const [email, setEmail] = useState("graph@q.l");
  const navigate = useNavigate();

  //const [addRequestStatus, setAddRequestStatus] = useState("idle")

  const dispatch = useDispatch<AppDispatch>();

  const onNameChanged = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const onSaveClicked = () => {
    if (name !== "" && email !== "") {
      const tempUser = new User();
      tempUser.name = name;
      //setAddRequestStatus('pending')
      dispatch(addNewUser(tempUser)).unwrap();
      setName("");
      setEmail("");
      navigate("/users");
    }
  };

  return (
    <section>
      <NavLink to="/dashboard">Dashboard</NavLink>
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
        <label htmlFor="email">Email:</label>
        <button type="button" onClick={onSaveClicked}>
          Save User
        </button>
      </form>
    </section>
  );
};

export default AddUserForm;
