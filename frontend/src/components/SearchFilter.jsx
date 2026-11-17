export default function SearchFilter({ filters, setFilters }) {
  const update = (key, value) => setFilters(old => ({ ...old, [key]: value }));
  return (
    <section className="filters">
      <input
        aria-label="Search items"
        placeholder="Search by item name or description..."
        value={filters.search}
        onChange={e => update("search", e.target.value)}
      />
      <select value={filters.category} onChange={e => update("category", e.target.value)}>
        <option value="">All categories</option>
        {["Electronics", "Books", "ID Cards", "Clothing", "Accessories", "Keys", "Other"].map(c =>
          <option key={c}>{c}</option>)}
      </select>
      <input placeholder="Filter by location" value={filters.location}
        onChange={e => update("location", e.target.value)} />
      <select value={filters.type} onChange={e => update("type", e.target.value)}>
        <option value="">Lost & Found</option><option>Lost</option><option>Found</option>
      </select>
      <button className="secondary-button" onClick={() =>
        setFilters({ search: "", category: "", location: "", type: "" })}>Clear</button>
    </section>
  );
}
