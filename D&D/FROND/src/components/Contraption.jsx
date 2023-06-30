import { Link } from "react-router-dom";

export default function Contraption({
  _id,
  name,
  type,
  description,
  quantity,
  done,
  getContraption,
  deleteContraption,
}) {
  return (
    <div>
      <h1>Name:{name}</h1>

      <button onClick={() => deleteContraption(_id)}>🗑</button>
      <Link to={`/contraptions/${_id}`}>
        <button>ver detalles</button>
      </Link>
    </div>
  );
}
