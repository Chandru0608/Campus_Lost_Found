import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";
import SearchFilter from "../components/SearchFilter";
import { fetchItems } from "../services/api";

export default function Home() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "", location: "", type: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setItems(await fetchItems(filters));
        setError("");
      } 
      catch (e) { 
        setError(e.message); 
      }
      finally { 
        setLoading(false); 
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">YOUR CAMPUS COMMUNITY</p>
        <h1>Lost something?<br /><span>Find it here.</span></h1>
        <p>A simple place for students to report lost belongings and reunite people with their things.</p>
      </section>
      <div className="section-heading">
        <div><p className="eyebrow">COMMUNITY BOARD</p><h2>Recently reported items</h2></div>
        <span className="count">{items.length} active items</span>
      </div>
      <SearchFilter filters={filters} setFilters={setFilters} />
      {error && <p className="error">{error}. Make sure the backend is running.</p>}
      {loading ? <p>Loading items...</p> :
        items.length ? <div className="item-grid">{items.map(item =>
          <ItemCard key={item.id} item={item} />)}</div> :
          <div className="empty"><h3>No items found</h3><p>Try another search or report an item.</p></div>}
    </main>
  );
}
