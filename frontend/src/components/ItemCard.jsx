import { Link } from "react-router-dom";
import { imageUrl } from "../services/api";

export default function ItemCard({ item }) {
  return (
    <article className="item-card">
      {item.image
        ? <img className="item-image" src={imageUrl(item.image)} alt={item.title} />
        : <div className="image-placeholder">No image provided</div>}
      <div className="card-content">
        <span className={`tag ${item.type.toLowerCase()}`}>{item.type}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="item-meta"><span>▦ {item.category}</span><span>⌖ {item.location}</span></div>
        <Link className="details-link" to={`/item/${item.id}`}>View details →</Link>
      </div>
    </article>
  );
}
