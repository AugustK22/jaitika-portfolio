import React, { useEffect, useMemo, useState } from "react";
import { Lock, Plus, ChevronDown, ChevronUp, LogOut, Edit2, Trash2, Search, SlidersHorizontal } from "lucide-react";
import "./journal.css";
import { useNavigate } from "react-router-dom";

function Stars({ count = 80 }) {
  const stars = useMemo(() => (
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: (Math.random() * 3).toFixed(2)
    }))
  ), [count]);
  return (
    <div className="stars" aria-hidden="true">
      {stars.map(s => (
        <span
          key={s.id}
          className="star"
          style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}


// --- Firebase (modular SDK) with graceful fallback to window.firebase ---
let initializeApp, getDatabase, ref, set, get, remove, onValue;
try {
  ({ initializeApp } = await import("firebase/app"));
  ({ getDatabase, ref, set, get, remove, onValue } = await import("firebase/database"));
} catch {
  initializeApp = window?.firebase?.initializeApp;
  getDatabase = window?.firebaseDatabase?.getDatabase;
  ({ ref, set, get, remove, onValue } = window?.firebaseDatabase ?? {});
}

const firebaseConfig = {
  apiKey: "AIzaSyC8lRd_rq5WWly4nE1-fVWNmDHWW9UVgx8",
  authDomain: "js-castle.firebaseapp.com",
  databaseURL: "https://js-castle-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "js-castle",
  storageBucket: "js-castle.firebasestorage.app",
  messagingSenderId: "270553123263",
  appId: "1:270553123263:web:7c16052915360a21a6f90a",
  measurementId: "G-TCGW4B73F5",
};

let app, database;
try {
  if (!initializeApp) throw new Error("Firebase SDK not found");
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (e) {
  console.error("Firebase init error:", e);
}

export default function Journal() {
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(!database);
  const [authenticated, setAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const [entries, setEntries] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ title: "", subtitle: "", content: "", type: "memory-post" });

  // Search, Sort, and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterEmotion, setFilterEmotion] = useState("all");

  const stars = useMemo(() => Array.from({ length: 80 }), []);

  useEffect(() => {
    if (!database) {
      setFirebaseError(true);
      setLoading(false);
      return;
    }
    const isAuth = sessionStorage.getItem("blogAuthenticated") === "true";
    if (isAuth) {
      setAuthenticated(true);
      wireEntries();
    } else {
      setLoading(false);
    }
  }, []);

  const wireEntries = () => {
    const entriesRef = ref(database, "entries");
    onValue(
      entriesRef,
      (snap) => {
        if (!snap.exists()) {
          setEntries([]);
          setLoading(false);
          return;
        }
        const data = snap.val();
        const list = Object.entries(data)
          .map(([id, v]) => ({ id, ...v }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setEntries(list);
        setLoading(false);
      },
      () => {
        setEntries([]);
        setLoading(false);
      }
    );
  };

  const handleAuth = async () => {
    setError("");
    if (!database) {
      setError("Firebase not configured.");
      return;
    }
    try {
      const passkeyRef = ref(database, "settings/passkey");
      const snap = await get(passkeyRef);
      const demo = "midnight2025";
      const serverKey = snap.exists() ? snap.val() : demo;

      if (passkey === serverKey) {
        if (!snap.exists()) await set(passkeyRef, demo);
        setAuthenticated(true);
        sessionStorage.setItem("blogAuthenticated", "true");
        wireEntries();
      } else {
        setError("Invalid passkey. Try again.");
      }
    } catch (e) {
      console.error("Auth error:", e);
      setError("Authentication failed. Try again.");
    }
  };

  const saveEntry = async () => {
    if (!draft.title || !draft.content) {
      setError("Title and content are required.");
      return;
    }
    if (!database) {
      setError("Firebase not configured.");
      return;
    }
    try {
      const id = editing?.id || Date.now().toString();
      const payload = {
        title: draft.title,
        subtitle: draft.subtitle,
        content: draft.content,
        type: draft.type,
        timestamp: editing?.timestamp || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await set(ref(database, `entries/${id}`), payload);
      setDraft({ title: "", subtitle: "", content: "", type: "memory-post" });
      setEditing(null);
      setShowForm(false);
      setError("");
    } catch (e) {
      console.error("Save error:", e);
      setError("Failed to save entry.");
    }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    if (!database) {
      setError("Firebase not configured.");
      return;
    }
    try {
      await remove(ref(database, `entries/${id}`));
    } catch (e) {
      console.error("Delete error:", e);
      setError("Failed to delete entry.");
    }
  };

  const startEdit = (entry) => {
    setEditing(entry);
    setDraft({ title: entry.title, subtitle: entry.subtitle, content: entry.content, type: entry.type });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const truncate = (txt) => {
    const lines = txt.split("\n").slice(0, 4).join("\n");
    return lines.length < txt.length ? `${lines}…` : lines;
  };

  // Filter, search, and sort entries
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.subtitle?.toLowerCase().includes(query) ||
          e.content.toLowerCase().includes(query)
      );
    }

    // Apply emotion filter
    if (filterEmotion !== "all") {
      result = result.filter((e) => e.type === filterEmotion);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [entries, searchQuery, sortBy, filterEmotion]);

  const logout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem("blogAuthenticated");
    setPasskey("");
  };
  const navigate = useNavigate();
const goHome = () => navigate("/");


  // Loading state
  if (firebaseError) {
    return (
      <main className="journal-page">
        <div className="container center">
          <div className="notice">
            <h2>Firebase Not Configured</h2>
            <p>Install the SDK and configure your environment variables.</p>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="journal-page">
        <Stars />
      </main>
    );
  }

  // Auth gate
  if (!authenticated) {
    return (
      <main className="journal-page">
        <Stars />

        <div className="container center">
          <div className="gate">
            <div className="gate-icon">
              <Lock />
            </div>
            <h1 className="title">Late Night Thoughts</h1>
            <p className="subtitle">enter passkey to continue</p>

            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              placeholder="Enter passkey"
              className="input"
            />
            {error && <p className="error">{error}</p>}

            <button className="btn primary" onClick={handleAuth}>
              Access Journal
            </button>

            <p className="hint">Demo passkey: midnight2025</p>
          </div>
        </div>
      </main>
    );
  }

  // Main journal interface
  return (
    <main className="journal-page">
      <Stars />

      <div className="container">
        {/* Top bar */}
        <div className="topbar">
  <div className="brand">LNT</div>

  <div className="topbar-actions">
    <button className="btn ghost" onClick={goHome} title="Back to Home">
      ⬅ Home
    </button>

    <button className="logout" onClick={logout} title="Logout">
      <LogOut />
      <span>Logout</span>
    </button>
  </div>
</div>

        {/* Hero */}
        <header className="hero">
          <h1>Late Night Thoughts</h1>
          <p className="tagline">where vulnerability lives and hearts speak</p>
          <p className="lede">
            This is where I write at 2 AM when the world is quiet and my heart is too loud. Unfiltered pieces of me—
            the breakdowns, the breakthroughs, the tiny pivots that change everything.
          </p>
        </header>

        {/* Composer */}
        <div className="composer-wrap">
          <div className="card composer">
            <button
              className="btn primary new-btn"
              onClick={() => {
                setShowForm((v) => !v);
                if (showForm) {
                  setEditing(null);
                  setDraft({ title: "", subtitle: "", content: "", type: "memory-post" });
                  setError("");
                }
              }}
            >
              <Plus />
              <span>{showForm ? "Cancel Entry" : "Create a New Entry"}</span>
            </button>

            {showForm && (
              <div className="form-content">
                <h3>{editing ? "Edit Entry" : "New Entry Details"}</h3>
                <input
                  className="input title-input"
                  placeholder="Entry Title"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="Subtitle (optional)"
                  value={draft.subtitle}
                  onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                />
                <select
                  className="input"
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                >
                  <option value="memory-post">Memory (Pink)</option>
                  <option value="philosophy-post">Philosophy (Teal)</option>
                  <option value="freedom-post">Freedom (Gold)</option>
                </select>
                <textarea
                  className="input area"
                  rows={12}
                  placeholder="Write your thoughts…"
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                />
                {error && <p className="error">{error}</p>}
                <div className="row">
                  <button className="btn primary" onClick={saveEntry}>
                    {editing ? "Update Entry" : "Publish Entry"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search, Sort, and Filter Controls */}
        <div className="controls-wrap">
          <div className="card controls">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                className="input search-input"
                placeholder="Search entries by title, subtitle, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filters-row">
              <div className="filter-group">
                <SlidersHorizontal className="filter-icon" />
                <select
                  className="input select-input"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="title">Sort: By Title (A-Z)</option>
                </select>
              </div>

              <div className="filter-group">
                <select
                  className="input select-input"
                  value={filterEmotion}
                  onChange={(e) => setFilterEmotion(e.target.value)}
                >
                  <option value="all">Filter: All Emotions</option>
                  <option value="memory-post">Filter: Memories</option>
                  <option value="philosophy-post">Filter: Philosophy</option>
                  <option value="freedom-post">Filter: Freedom</option>
                </select>
              </div>
            </div>

            {(searchQuery || filterEmotion !== "all") && (
              <div className="results-count">
                Showing {filteredEntries.length} of {entries.length} entries
              </div>
            )}
          </div>
        </div>

        {/* Entries */}
        <div className="stack">
          {filteredEntries.length === 0 ? (
            <div className="empty">
              {searchQuery || filterEmotion !== "all" 
                ? "No entries match your search or filter criteria..."
                : "No entries yet. Start writing your thoughts…"}
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isOpen = !!expanded[entry.id];
              const accent =
                entry.type === "memory-post" ? "accent-pink" : entry.type === "philosophy-post" ? "accent-teal" : "accent-gold";
              return (
                <article key={entry.id} className={`card entry ${accent}`}>
                  <div className="entry-head">
                    <div className="entry-titles">
                      <h2>{entry.title}</h2>
                      {entry.subtitle && (
                        <p className="muted">
                          <span aria-hidden>🌙</span> {entry.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="entry-actions">
                      <button className="icon-btn" title="Edit" onClick={() => startEdit(entry)}>
                        <Edit2 />
                      </button>
                      <button className="icon-btn" title="Delete" onClick={() => deleteEntry(entry.id)}>
                        <Trash2 />
                      </button>
                    </div>
                  </div>

                  <div className={`entry-body ${isOpen ? "open" : ""}`}>
                    <pre className="content">{isOpen ? entry.content : truncate(entry.content)}</pre>
                  </div>

                  <button className="readmore" onClick={() => toggleExpand(entry.id)}>
                    {isOpen ? (
                      <>
                        <ChevronUp /> Collapse
                      </>
                    ) : (
                      <>
                        <ChevronDown /> Read More
                      </>
                    )}
                  </button>
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}