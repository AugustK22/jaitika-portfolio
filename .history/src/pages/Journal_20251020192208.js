import React, { useEffect, useMemo, useRef, useState } from "react";
import { Lock, Plus, ChevronDown, ChevronUp, LogOut, Edit2, Trash2, Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import "./journal.css";
import { useNavigate } from "react-router-dom";
import '../index.css';
import ReflectionPanel from "../components/ReflectionPanel";


const BACKGROUND_STAR_COUNT = 1200;
const MIDGROUND_STAR_COUNT = 600;
const FOREGROUND_STAR_COUNT = 200;
const DUST_PARTICLE_COUNT = 1500;

function drawSkyGradient(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#0a0e1a");
  gradient.addColorStop(0.3, "#131824");
  gradient.addColorStop(0.6, "#1a1f2e");
  gradient.addColorStop(1, "#0d1117");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawMilkyWayPatches(ctx, width, height) {
  const patches = [
    { x: width * 0.3, y: height * 0.25, size: width * 0.4, intensity: 0.025 },
    { x: width * 0.5, y: height * 0.35, size: width * 0.5, intensity: 0.035 },
    { x: width * 0.6, y: height * 0.45, size: width * 0.35, intensity: 0.028 },
    { x: width * 0.4, y: height * 0.5, size: width * 0.3, intensity: 0.02 },
    { x: width * 0.7, y: height * 0.3, size: width * 0.25, intensity: 0.022 },
    { x: width * 0.35, y: height * 0.4, size: width * 0.28, intensity: 0.018 }
  ];

  patches.forEach((patch) => {
    const gradient = ctx.createRadialGradient(
      patch.x, patch.y, 0,
      patch.x, patch.y, patch.size
    );

    gradient.addColorStop(0, `rgba(220, 210, 190, ${patch.intensity})`);
    gradient.addColorStop(0.3, `rgba(180, 170, 160, ${patch.intensity * 0.7})`);
    gradient.addColorStop(0.6, `rgba(130, 140, 150, ${patch.intensity * 0.4})`);
    gradient.addColorStop(1, "rgba(80, 90, 100, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  });

  const clouds = [
    { x: width * 0.25, y: height * 0.35, w: width * 0.15, h: height * 0.2 },
    { x: width * 0.55, y: height * 0.4, w: width * 0.2, h: height * 0.15 },
    { x: width * 0.45, y: height * 0.28, w: width * 0.12, h: height * 0.18 },
    { x: width * 0.65, y: height * 0.38, w: width * 0.18, h: height * 0.12 }
  ];

  clouds.forEach((cloud) => {
    const gradient = ctx.createRadialGradient(
      cloud.x, cloud.y, 0,
      cloud.x, cloud.y, Math.max(cloud.w, cloud.h)
    );

    gradient.addColorStop(0, "rgba(150, 145, 140, 0.015)");
    gradient.addColorStop(0.5, "rgba(120, 125, 135, 0.01)");
    gradient.addColorStop(1, "rgba(100, 105, 120, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  });
}

class Star {
  constructor(layer, state) {
    this.layer = layer;
    this.state = state;
    this.assignAppearance();
    this.resetPosition();
  }

  assignAppearance() {
    const rand = Math.random();
    if (rand > 0.97) {
      this.size = 0.6 + Math.random() * 0.8;
      this.brightness = 0.4 + Math.random() * 0.25;
      this.type = "bright";
    } else if (rand > 0.85) {
      this.size = 0.4 + Math.random() * 0.5;
      this.brightness = 0.25 + Math.random() * 0.2;
      this.type = "medium";
    } else {
      this.size = 0.2 + Math.random() * 0.3;
      this.brightness = 0.15 + Math.random() * 0.2;
      this.type = "dim";
    }

    const temp = Math.random();
    if (temp > 0.9) {
      this.color = { r: 200, g: 215, b: 235 };
    } else if (temp > 0.1) {
      this.color = { r: 235, g: 235, b: 240 };
    } else {
      this.color = { r: 240, g: 230, b: 215 };
    }

    this.baseSpeed = this.layer === "bg" ? 0.008 : this.layer === "mid" ? 0.015 : 0.022;
    this.shouldTwinkle = Math.random() > 0.8;
    this.twinkleSpeed = 0.15 + Math.random() * 0.2;
    this.twinkleOffset = Math.random() * Math.PI * 2;
    this.twinkleAmount = 0.08;
  }

  resetPosition() {
    const { width, height } = this.state;
    this.x = Math.random() * width * 1.2 - width * 0.1;
    this.y = Math.random() * height;
  }

  update() {
    this.x += this.baseSpeed;
    if (this.x > this.state.width + 20) {
      this.x = -20;
      this.y = Math.random() * this.state.height;
    }
  }

  draw(ctx, currentTime) {
    let alpha = this.brightness;
    if (this.shouldTwinkle) {
      const twinkle = Math.sin(currentTime * this.twinkleSpeed + this.twinkleOffset);
      alpha = this.brightness * (1 - this.twinkleAmount + twinkle * this.twinkleAmount);
    }

    if (this.type === "bright" && this.size > 0.9) {
      const glowSize = this.size * 2.5;
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, glowSize
      );

      gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.3})`);
      gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.1})`);
      gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  clampToBounds() {
    const { width, height } = this.state;
    if (this.y > height) {
      this.y = Math.random() * height;
    }
    if (this.x > width + 20) {
      this.x = Math.random() * width;
    }
  }
}

class DustParticle {
  constructor(state) {
    this.state = state;
    this.size = Math.random() * 0.8;
    this.opacity = Math.random() * 0.03 + 0.01;
    this.speed = 0.003 + Math.random() * 0.007;

    const colorVariation = Math.random();
    if (colorVariation > 0.7) {
      this.color = { r: 170, g: 160, b: 145 };
    } else if (colorVariation > 0.4) {
      this.color = { r: 140, g: 145, b: 155 };
    } else {
      this.color = { r: 130, g: 135, b: 145 };
    }

    this.resetPosition();
  }

  resetPosition() {
    const { width, height } = this.state;
    this.x = Math.random() * width * 1.2 - width * 0.1;
    this.y = height * 0.2 + Math.random() * height * 0.6;
  }

  update() {
    this.x += this.speed;
    if (this.x > this.state.width + 5) {
      this.x = -5;
    }
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  clampToBounds() {
    const { width, height } = this.state;
    if (this.y > height) {
      this.y = height * 0.2 + Math.random() * height * 0.6;
    }
    if (this.x > width + 5) {
      this.x = Math.random() * width;
    }
  }
}

function StarryBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    const state = { width: 0, height: 0 };
    const setCanvasSize = () => {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      canvas.width = state.width;
      canvas.height = state.height;
    };

    setCanvasSize();

    const backgroundStars = Array.from({ length: BACKGROUND_STAR_COUNT }, () => new Star("bg", state));
    const midgroundStars = Array.from({ length: MIDGROUND_STAR_COUNT }, () => new Star("mid", state));
    const foregroundStars = Array.from({ length: FOREGROUND_STAR_COUNT }, () => new Star("fg", state));
    const dustParticles = Array.from({ length: DUST_PARTICLE_COUNT }, () => new DustParticle(state));

    let time = 0;

    const renderFrame = () => {
      time += 0.005;
      ctx.clearRect(0, 0, state.width, state.height);
      drawSkyGradient(ctx, state.width, state.height);
      drawMilkyWayPatches(ctx, state.width, state.height);

      dustParticles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      backgroundStars.forEach((star) => {
        star.update();
        star.draw(ctx, time);
      });

      midgroundStars.forEach((star) => {
        star.update();
        star.draw(ctx, time);
      });

      foregroundStars.forEach((star) => {
        star.update();
        star.draw(ctx, time);
      });

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    animationRef.current = requestAnimationFrame(renderFrame);

    const handleResize = () => {
      setCanvasSize();
      [...backgroundStars, ...midgroundStars, ...foregroundStars].forEach((star) => {
        star.clampToBounds();
      });
      dustParticles.forEach((particle) => {
        particle.clampToBounds();
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="starry-background" aria-hidden="true">
      <canvas ref={canvasRef} id="stars" className="starry-canvas" />
      {/* Placeholder for your tree PNG - replace src with your image */}
      {/* <img id="trees" className="starry-trees" src="your-tree-silhouette.png" alt="Trees" /> */}
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
  const [keyExists, setKeyExists] = useState(null);

  const [entries, setEntries] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ title: "", subtitle: "", content: "", type: "memory-post" });

  // Search, Sort, and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterEmotion, setFilterEmotion] = useState("all");

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
      checkKeyExists();
    }
  }, []);

  const checkKeyExists = async () => {
    try {
      const passkeyRef = ref(database, "settings/passkey");
      const snap = await get(passkeyRef);
      setKeyExists(snap.exists());
      setLoading(false);
    } catch (e) {
      console.error("Error checking key:", e);
      setLoading(false);
    }
  };

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
    if (!passkey.trim()) {
      setError("Please enter a passkey.");
      return;
    }
    try {
      const passkeyRef = ref(database, "settings/passkey");
      const snap = await get(passkeyRef);

      if (!snap.exists()) {
        // No key exists, store whatever user entered as the permanent key
        await set(passkeyRef, passkey);
        setAuthenticated(true);
        sessionStorage.setItem("blogAuthenticated", "true");
        wireEntries();
      } else {
        // Key exists, verify it matches
        const serverKey = snap.val();
        if (passkey === serverKey) {
          setAuthenticated(true);
          sessionStorage.setItem("blogAuthenticated", "true");
          wireEntries();
        } else {
          setError("Invalid passkey. Try again.");
        }
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

  const filteredEntries = useMemo(() => {
    let result = [...entries];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.subtitle?.toLowerCase().includes(query) ||
          e.content.toLowerCase().includes(query)
      );
    }

    if (filterEmotion !== "all") {
      result = result.filter((e) => e.type === filterEmotion);
    }

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
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate("/"));
  const goHome = () => navigate("/");

  if (firebaseError) {
    return (
      <main className="journal-page">
        <StarryBackground />
        <button className="journal-back" onClick={goBack} type="button" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
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
        <StarryBackground />
        <button className="journal-back" onClick={goBack} type="button" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="journal-page">
        <StarryBackground />
        <button className="journal-back" onClick={goBack} type="button" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>

        <div className="container center">
          <div className="gate">
            <div className="gate-icon">
              <Lock />
            </div>
            <h1 className="title">Late Night Thoughts</h1>
            <p className="subtitle">enter passkey to continue</p>

            {keyExists === false && (
              <div className="welcome-message">
                <p>
                  Welcome, Jaitika. This is your sacred space. Choose a passkey that only you will know, it becomes your permanent key. We won't see it, no one else can access it. This sanctuary is entirely yours. Create something meaningful.
                </p>
              </div>
            )}

            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              placeholder={keyExists === false ? "Create your passkey" : "Enter passkey"}
              className="input"
            />
            {error && <p className="error">{error}</p>}

            <button className="btn primary" onClick={handleAuth}>
              {keyExists === false ? "Set Passkey" : "Access Journal"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="journal-page">
      <StarryBackground />
      <button className="journal-back" onClick={goBack} type="button" aria-label="Go back">
        <ArrowLeft size={20} />
      </button>

      <div className="container">
        <div className="topbar">
          <div className="brand">LNT</div>
          <div className="topbar-actions">
            <button className="btn ghost" onClick={goHome} title="Back to Home">
              ← Home
            </button>
            <button className="logout" onClick={logout} title="Logout">
              <LogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <header className="hero">
          <h1>Late Night Thoughts</h1>
          <p className="tagline">where vulnerability lives and hearts speak</p>
          <p className="lede">
            This is where I write at 2 AM when the world is quiet and my heart is too loud. Unfiltered pieces of me, 
            the breakdowns, the breakthroughs, the tiny pivots that change everything.
          </p>
        </header>

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

                  {isOpen && (
                    <ReflectionPanel
                      entryId={entry.id}
                      entryContent={entry.content}
                    />
                  )}

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
