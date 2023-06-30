import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import ContraptionDetail from "../components/ContraptionDetail";
// import todoService from "../services/todo.service";
import ContraptionDetail from "../components/contraptionDetail";

export default function ContraptionDetailPage() {
  const { id } = useParams();
  const [contraption, setContraption] = useState(null);

  const getContraption = async () => {
    try {
      // const res = await axios.get(`${import.meta.env.VITE_API_URL}/todos/${id}`);
      // const res = await todoService.getOne(id);
      const res = await axios.get(
        `http://localhost:5005/api/contraptions/${id}`
      );
      setContraption(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContraption();
  }, [id]);

  return (
    <div>
      <h1>detalle card</h1>
      {contraption ? (
        <ContraptionDetail getContraption={getContraption} {...contraption} />
      ) : (
        <p>no hay datos</p>
      )}
    </div>
  );
}
