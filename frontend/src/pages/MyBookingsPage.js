import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const BOOKING_API = "http://localhost:1530/booking";
const TOURS_API   = "http://localhost:1530/tours";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop";

export default function MyBookingsPage() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [tourMap, setTourMap] = useState({}); // title -> tour data
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ bookAt: "", guestSize: "" });

  // fetch bookings + tours
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    (async () => {
      try {
        // 1) my bookings
        const r1 = await fetch(`${BOOKING_API}/me`, { credentials: "include" });
        const d1 = await r1.json();
        if (!r1.ok || !d1.success) throw new Error(d1.message || "Failed to fetch bookings");
        const myBookings = Array.isArray(d1.data) ? d1.data : [];
        setBookings(myBookings);

        // 2) tours (for photo/city/price)
        const r2 = await fetch(TOURS_API);
        const d2 = await r2.json();
        if (r2.ok && d2.success && Array.isArray(d2.data)) {
          const map = {};
          for (const t of d2.data) map[t.title] = t; // title -> tour
          setTourMap(map);
        }
      } catch (e) {
        setErr(e.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // edit helpers
  const startEdit = (b) => {
    if ((b.status || "").toLowerCase() === "cancelled") return;
    setEditingId(b._id);
    setForm({ bookAt: toInputDate(b.bookAt), guestSize: String(b.guestSize ?? "") });
  };
  const cancelEdit = () => { setEditingId(null); setForm({ bookAt: "", guestSize: "" }); };

  const saveEdit = async (id) => {
    try {
      setErr("");
      const payload = {};
      if (form.bookAt) payload.bookAt = form.bookAt; // yyyy-mm-dd
      if (form.guestSize) payload.guestSize = Number(form.guestSize);

      const res = await fetch(`${BOOKING_API}/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Update failed");

      setBookings((prev) => prev.map((x) => (x._id === id ? data.data : x)));
      cancelEdit();
    } catch (e) {
      setErr(e.message || "Update failed");
    }
  };

  // soft cancel
  const cancelBooking = async (id) => {
    try {
      if (!window.confirm("Cancel this booking?")) return;
      const res = await fetch(`${BOOKING_API}/${id}/cancel`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Changed plans" }), // optional
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Cancel failed");

      setBookings((prev) => prev.map((x) => (x._id === id ? data.data : x)));
      if (editingId === id) cancelEdit();
    } catch (e) {
      setErr(e.message || "Cancel failed");
    }
  };

  // hard delete
  const deleteBooking = async (id) => {
    try {
      if (!window.confirm("Permanently delete this booking? This cannot be undone.")) return;
      const res = await fetch(`${BOOKING_API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Delete failed");

      setBookings((prev) => prev.filter((x) => x._id !== id));
      if (editingId === id) cancelEdit();
    } catch (e) {
      setErr(e.message || "Delete failed");
    }
  };

  if (!user) return <div className="p-4">Please log in to view your bookings.</div>;
  if (loading) return <div className="p-4">Loading bookings…</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>You don’t have any bookings yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => {
            const isEditing = editingId === b._id;
            const isCancelled = (b.status || "").toLowerCase() === "cancelled";

            // match tour by name; fallback if not found
            const t = tourMap[b.tourName] || {};
            const photo = t.photo || FALLBACK_IMG;
            const city  = t.city || "-";
            const price = t.price;

            return (
              <article
                key={b._id}
                className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow transition ${
                  isCancelled ? "opacity-75" : ""
                }`}
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={photo}
                    alt={b.tourName}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">{b.tourName}</h2>
                      <p className="text-sm opacity-80">{city}</p>
                      <p className="text-sm opacity-80">Guests: {b.guestSize}</p>
                      <p className="text-sm opacity-80">Date: {safeDate(b.bookAt)}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-xl font-bold">
                        {price != null ? `$${price}` : "—"}
                      </span>
                      <span
                        className={`inline-block mt-1 text-xs px-2 py-1 rounded-full border ${
                          isCancelled ? "opacity-70" : "opacity-90"
                        }`}
                      >
                        {b.status ? b.status : "confirmed"}
                      </span>
                    </div>
                  </div>

                  {!isEditing ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(b)}
                        disabled={isCancelled}
                        className={`px-3 py-2 rounded-xl border hover:shadow ${
                          isCancelled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => cancelBooking(b._id)}
                        disabled={isCancelled}
                        className={`px-3 py-2 rounded-xl border hover:shadow text-red-600 ${
                          isCancelled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Cancel booking
                      </button>
                      <button
                        onClick={() => deleteBooking(b._id)}
                        className="px-3 py-2 rounded-xl border hover:shadow text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <label className="flex flex-col">
                          <span className="text-sm opacity-80">Date</span>
                          <input
                            type="date"
                            value={form.bookAt}
                            onChange={(e) => setForm((f) => ({ ...f, bookAt: e.target.value }))}
                            className="border rounded-md px-3 py-2"
                          />
                        </label>
                        <label className="flex flex-col">
                          <span className="text-sm opacity-80">Guest Size</span>
                          <input
                            type="number"
                            min="1"
                            value={form.guestSize}
                            onChange={(e) => setForm((f) => ({ ...f, guestSize: e.target.value }))}
                            className="border rounded-md px-3 py-2"
                          />
                        </label>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => saveEdit(b._id)}
                          className="px-3 py-2 rounded-xl border hover:shadow bg-black text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-2 rounded-xl border hover:shadow"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function safeDate(d) {
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString();
}

function toInputDate(d) {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
