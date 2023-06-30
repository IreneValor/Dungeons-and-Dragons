import React, { useState } from "react";
import EditContraptionForm from "./EditContraptionForm";

export default function ContraptionDetail({
  _id,
  name,
  type,
  description,
  quantity,
  done,
  getContraption,
}) {
  const [isEditing, setIsEditing] = useState(false);
  //me falta meter const [contraption, setContraption] = useState(null);
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFormClose = () => {
    setIsEditing(false);
  };

  const redirectToDetail = () => {
    setIsEditing(false);
  }; //PARA QUE REDIRECCIONE AL EDITAR

  return (
    <>
      <h1>Name: {name}</h1>
      <p>Type: {type}</p>
      <p>Description: {description}</p>
      <p>Quantity: {quantity}</p>

      {isEditing ? (
        <EditContraptionForm
          _id={_id}
          name={name}
          type={type}
          description={description}
          done={done}
          getContraption={getContraption}
          redirectToDetail={redirectToDetail}
          onClose={handleFormClose}
        />
      ) : (
        <>
          <label>
            Done:
            <input
              type="checkbox"
              checked={done}
              disabled
              onChange={() => {}}
            />
          </label>
          <button onClick={handleEditClick}>✏️</button>
        </>
      )}
    </>
  );
}
