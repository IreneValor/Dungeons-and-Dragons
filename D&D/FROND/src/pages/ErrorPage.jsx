import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div>
      <h1>Pagina no encontrada</h1>
      <Link to="/">Volver a Home</Link>
    </div>
  );
}
