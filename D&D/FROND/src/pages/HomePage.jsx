import axios from "axios";
import { useEffect, useState } from "react";
import Contraption from "../components/Contraption";
import CreateContraption from "../components/CreateContraption";

function HomePage() {
  const [contraptions, setContraptions] = useState(null);
  const [showCreateContraption, setShowCreateContraption] = useState(false);

  useEffect(() => {
    getContraptions();
  }, []);

  const getContraptions = async () => {
    try {
      const res = await axios.get("http://localhost:5005/api/contraptions");
      setContraptions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContraption = async (id) => {
    try {
      await axios.delete(`http://localhost:5005/api/contraptions/${id}`);
      getContraptions();
    } catch (error) {
      console.log(error);
    }
  };

  const renderContraptions = () => {
    return contraptions.map((contraption) => (
      <Contraption
        deleteContraption={deleteContraption}
        key={contraption._id}
        {...contraption}
      />
    ));
  };

  const handleAddContraption = () => {
    setShowCreateContraption(true);
  };

  const handleCancelAddContraption = () => {
    setShowCreateContraption(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        {!showCreateContraption && contraptions && (
          <div style={{ textAlign: "right" }}>
            <button onClick={handleAddContraption}>Añadir artilugio</button>
          </div>
        )}

        {showCreateContraption && (
          <div>
            <CreateContraption
              getContraptions={getContraptions}
              onCancel={handleCancelAddContraption}
            />
          </div>
        )}

        <div>
          {!contraptions ? (
            <div style={{ textAlign: "center" }}>
              <p>nada</p>
            </div>
          ) : contraptions && contraptions.length ? (
            <div>{renderContraptions()}</div>
          ) : (
            <p>No hay datos</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
