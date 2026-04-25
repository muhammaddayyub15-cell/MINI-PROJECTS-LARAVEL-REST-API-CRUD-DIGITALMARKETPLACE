import { useState } from "react";

function MovieForm({ onSubmit, initialData = null }) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    poster_url: initialData?.poster_url || "",
    rating: initialData?.rating || "",
    categories: initialData?.categories || "[]", // ← plural, JSON string
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="flex flex-col gap-3">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 text-white border rounded bg-white/10 border-white/20"
        />
        <input
          name="poster_url"
          placeholder="Poster URL"
          value={form.poster_url}
          onChange={handleChange}
          className="w-full p-2 text-white border rounded bg-white/10 border-white/20"
        />
        <input
          name="rating"
          placeholder="Rating (0-10)"
          value={form.rating}
          onChange={handleChange}
          className="w-full p-2 text-white border rounded bg-white/10 border-white/20"
        />
        <input
          name="categories"
          placeholder='Categories, contoh: ["Action","Drama"]'
          value={form.categories}
          onChange={handleChange}
          className="w-full p-2 text-white border rounded bg-white/10 border-white/20"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 text-white border rounded bg-white/10 border-white/20"
        />
        <button className="w-full py-2 mt-1 font-semibold bg-green-600 rounded">
          Save Movie
        </button>
      </div>
    </form>
  );
}

export default MovieForm;