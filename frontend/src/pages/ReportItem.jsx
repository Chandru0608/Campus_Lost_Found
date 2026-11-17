import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reportItem } from "../services/api";

export default function ReportItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: "", location: "",
    type: "Lost", contact: ""
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);
    try {
      await reportItem(data);
      navigate("/");
    } 
    catch (err) { 
      setError(err.message); 
    }
    finally { 
      setBusy(false); 
    }
  }

  return (
    <main className="form-page">
      <div className="form-intro"><p className="eyebrow">HELP YOUR COMMUNITY</p>
        <h1>Report an item</h1><p>Share the details so the right person can find it.</p></div>
      <form className="report-form" onSubmit={submit}>
        <div className="form-row">
          <label>Report type
            <select name="type" value={form.type} onChange={update}>
              <option>Lost</option><option>Found</option>
            </select>
          </label>
          <label>Item category
            <select name="category" value={form.category} onChange={update} required>
              <option value="">Select category</option>
              {["Electronics", "Books", "ID Cards", "Clothing", "Accessories", "Keys", "Other"].map(c =>
                <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <label>Item name<input name="title" value={form.title} onChange={update}
          placeholder="e.g. Black water bottle" required maxLength="80" /></label>
        <label>Description<textarea name="description" value={form.description} onChange={update}
          placeholder="Describe the item and any identifying details..." required rows="4" maxLength="1000" /></label>
        <label>Location<input name="location" value={form.location} onChange={update}
          placeholder="e.g. Main library, Block A" required /></label>
        <label>Contact information<input name="contact" value={form.contact} onChange={update}
          placeholder="Email or phone number" required /></label>
        <label>Item photograph (optional)
          <input type="file" accept="image/png,image/jpeg,image/webp"
            onChange={e => setImage(e.target.files?.[0] || null)} />
          <small>JPG, PNG or WEBP. Maximum 5 MB.</small>
        </label>
        {error && <p className="error">{error}</p>}
        <button className="primary-button" disabled={busy}>{busy ? "Submitting..." : "Submit report"}</button>
      </form>
    </main>
  );
}
