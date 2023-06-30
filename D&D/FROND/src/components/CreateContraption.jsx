import { useState } from "react";
import axios from "axios";
// import todoService from "../services/todo.service";

export default function CreateContraption({ getContraptions }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // await axios.post(`${import.meta.env.VITE_API_URL}/todos`, data);// supongo que al 5005 que es donde esta ek backend
      //   await todoService.create(data);
      await axios.post(`http://localhost:5005/api/contraptions`, data); // supongo que al 5005 que es donde esta ek backend

      getContraptions();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div>
      <h2>Crear artilugio</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="type">type</label>
          <textarea
            multiple
            type="text"
            name="type"
            value={data.type}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={data.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="quantity">quantity</label>
          <input
            type="number"
            name="quantity"
            value={data.quantity}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
}
