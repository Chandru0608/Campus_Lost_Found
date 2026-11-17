import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { claimItem, fetchItem, imageUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchItem(id).then(setItem).catch(e => setError(e.message));
  }, [id]);

  async function markClaimed() {
    if (!window.confirm("Mark this item as claimed and archive it?")) return;
    try {
      await claimItem(id);
      navigate("/");
    } 
    catch (e) { 
      setError(e.message); 
    }
  }

  if (error) return <main className="container"><p className="error">{error}</p><Link to="/">Go back</Link></main>;
  if (!item) return <main className="container">Loading item...</main>;

  return (
    <main className="details-page">
      <Link to="/" className="back-link">← Back to board</Link>
      <div className="details-layout">
        {item.image ? <img src={imageUrl(item.image)} alt={item.title} /> :
          <div className="image-placeholder large">No image provided</div>}
        <div className="details-content">
          <span className={`tag ${item.type.toLowerCase()}`}>{item.type}</span>
          <h1>{item.title}</h1><p>{item.description}</p>
          <dl>
            <dt>Category</dt><dd>{item.category}</dd>
            <dt>Location</dt><dd>{item.location}</dd>
            <dt>Contact</dt><dd>{item.contact}</dd>
            <dt>Reported</dt><dd>{new Date(item.createdAt).toLocaleString()}</dd>
          </dl>
          {item.status === "Active" ? (user ?
            <button className="primary-button" onClick={markClaimed}>Mark as claimed / archive</button> :
            <p><Link to="/login" state={{ from: `/item/${id}` }}>Log in</Link> to mark this item as claimed.</p>) :
            <p>This item has been claimed.</p>}
        </div>
      </div>
    </main>
  );
}
