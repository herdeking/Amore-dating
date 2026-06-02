import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --rose: #e8435a;
    --rose-dark: #c42d44;
    --rose-light: #fde8eb;
    --blush: #f9c8d0;
    --cream: #fdf6f0;
    --ink: #1a1018;
    --muted: #7a6070;
    --gold: #c9a84c;
    --surface: #fff8f5;
    --border: rgba(232,67,90,0.15);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 2rem; background: white;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(10px);
  }
  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 600;
    color: var(--rose); letter-spacing: -0.02em;
  }
  .nav-logo span { color: var(--gold); }
  .nav-tabs { display: flex; gap: 0.25rem; }
  .nav-tab {
    padding: 0.5rem 1rem; border-radius: 2rem;
    border: none; background: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    color: var(--muted); transition: all 0.2s; font-weight: 500;
  }
  .nav-tab.active { background: var(--rose); color: white; }
  .nav-tab:hover:not(.active) { background: var(--rose-light); color: var(--rose); }
  .nav-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    object-fit: cover; border: 2px solid var(--rose);
    cursor: pointer;
  }

  /* DISCOVER */
  .discover {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    padding: 2rem 1rem; gap: 1.5rem; max-width: 480px; margin: 0 auto; width: 100%;
  }

  .card-stack { position: relative; width: 100%; height: 520px; }

  .profile-card {
    position: absolute; width: 100%; height: 100%;
    border-radius: 24px; overflow: hidden;
    box-shadow: 0 20px 60px rgba(26,16,24,0.15);
    cursor: grab; user-select: none;
    transition: transform 0.1s ease;
    background: white;
  }
  .profile-card:nth-child(2) {
    transform: scale(0.96) translateY(16px);
    z-index: 0;
  }
  .profile-card:nth-child(3) {
    transform: scale(0.92) translateY(32px);
    z-index: -1;
  }
  .profile-card.top { z-index: 10; }
  .profile-card.fly-left {
    animation: flyLeft 0.4s ease forwards;
  }
  .profile-card.fly-right {
    animation: flyRight 0.4s ease forwards;
  }

  @keyframes flyLeft {
    to { transform: translateX(-150%) rotate(-20deg); opacity: 0; }
  }
  @keyframes flyRight {
    to { transform: translateX(150%) rotate(20deg); opacity: 0; }
  }

  .card-photo { width: 100%; height: 65%; object-fit: cover; display: block; }
  .card-photo-placeholder {
    width: 100%; height: 65%; display: flex; align-items: center; justify-content: center;
    font-size: 5rem;
  }

  .card-info { padding: 1.25rem 1.5rem; }
  .card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 600; line-height: 1;
  }
  .card-age { color: var(--rose); margin-left: 0.4rem; font-weight: 300; }
  .card-loc { color: var(--muted); font-size: 0.8rem; margin-top: 0.3rem; }
  .card-bio { font-size: 0.85rem; color: var(--ink); margin-top: 0.6rem; line-height: 1.5; }
  .card-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.75rem; }
  .card-tag {
    padding: 0.2rem 0.65rem; border-radius: 2rem;
    background: var(--rose-light); color: var(--rose);
    font-size: 0.72rem; font-weight: 500;
  }

  .card-overlay-like {
    position: absolute; top: 1rem; left: 1rem;
    background: #22c55e; color: white;
    font-weight: 700; font-size: 1.2rem;
    padding: 0.4rem 1rem; border-radius: 8px;
    border: 3px solid white; transform: rotate(-15deg);
    opacity: 0; transition: opacity 0.2s;
    letter-spacing: 0.1em;
  }
  .card-overlay-nope {
    position: absolute; top: 1rem; right: 1rem;
    background: var(--rose); color: white;
    font-weight: 700; font-size: 1.2rem;
    padding: 0.4rem 1rem; border-radius: 8px;
    border: 3px solid white; transform: rotate(15deg);
    opacity: 0; transition: opacity 0.2s;
    letter-spacing: 0.1em;
  }

  .swipe-actions {
    display: flex; justify-content: center; gap: 1.5rem; align-items: center;
  }
  .action-btn {
    width: 56px; height: 56px; border-radius: 50%; border: 2px solid;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; cursor: pointer; transition: all 0.2s;
    background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  .action-btn.nope { border-color: var(--rose); color: var(--rose); }
  .action-btn.nope:hover { background: var(--rose); color: white; transform: scale(1.1); }
  .action-btn.like { border-color: #22c55e; color: #22c55e; }
  .action-btn.like:hover { background: #22c55e; color: white; transform: scale(1.1); }
  .action-btn.super { border-color: var(--gold); color: var(--gold); }
  .action-btn.super:hover { background: var(--gold); color: white; transform: scale(1.1); }

  .match-popup {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(26,16,24,0.85); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .match-card {
    background: white; border-radius: 28px;
    padding: 2.5rem 2rem; text-align: center;
    max-width: 340px; width: 90%;
    animation: slideUp 0.4s ease;
  }
  @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .match-hearts { font-size: 3rem; animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  .match-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem; font-weight: 600; color: var(--rose);
    margin: 0.75rem 0 0.5rem;
  }
  .match-sub { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
  .match-avatars { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem; }
  .match-avatar {
    width: 70px; height: 70px; border-radius: 50%;
    border: 3px solid var(--rose); font-size: 2.5rem;
    display: flex; align-items: center; justify-content: center;
    background: var(--rose-light);
  }
  .match-btn {
    width: 100%; padding: 0.85rem; border-radius: 50px;
    border: none; background: var(--rose); color: white;
    font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 1rem;
    cursor: pointer; transition: background 0.2s; margin-bottom: 0.75rem;
  }
  .match-btn:hover { background: var(--rose-dark); }
  .match-btn.ghost {
    background: transparent; border: 2px solid var(--border); color: var(--muted);
  }

  /* MATCHES */
  .matches-page { padding: 1.5rem 1.5rem; max-width: 600px; margin: 0 auto; width: 100%; }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;
  }
  .new-matches {
    display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem;
    scrollbar-width: none; margin-bottom: 1.5rem;
  }
  .new-match {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.4rem; cursor: pointer; flex-shrink: 0;
  }
  .new-match-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    border: 3px solid var(--rose); font-size: 2rem;
    display: flex; align-items: center; justify-content: center;
    background: var(--rose-light); position: relative;
  }
  .new-match-avatar::after {
    content: ''; position: absolute; bottom: 2px; right: 2px;
    width: 12px; height: 12px; background: #22c55e;
    border-radius: 50%; border: 2px solid white;
  }
  .new-match-name { font-size: 0.75rem; color: var(--muted); }

  .conversations { display: flex; flex-direction: column; gap: 0; }
  .convo-item {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.9rem 0; border-bottom: 1px solid var(--border);
    cursor: pointer; transition: background 0.15s;
  }
  .convo-item:hover { background: var(--rose-light); margin: 0 -1rem; padding: 0.9rem 1rem; border-radius: 12px; }
  .convo-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    font-size: 1.8rem; display: flex; align-items: center;
    justify-content: center; background: var(--rose-light);
    flex-shrink: 0;
  }
  .convo-info { flex: 1; min-width: 0; }
  .convo-name { font-weight: 500; font-size: 0.95rem; }
  .convo-preview { color: var(--muted); font-size: 0.82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .convo-meta { text-align: right; }
  .convo-time { color: var(--muted); font-size: 0.75rem; }
  .convo-unread {
    width: 18px; height: 18px; background: var(--rose); color: white;
    border-radius: 50%; font-size: 0.7rem; font-weight: 600;
    display: flex; align-items: center; justify-content: center;
    margin-left: auto; margin-top: 4px;
  }

  /* CHAT */
  .chat-page { display: flex; flex-direction: column; height: calc(100vh - 58px); max-width: 600px; margin: 0 auto; width: 100%; }
  .chat-header {
    display: flex; align-items: center; gap: 1rem;
    padding: 1rem 1.5rem; background: white;
    border-bottom: 1px solid var(--border);
  }
  .chat-back {
    background: none; border: none; cursor: pointer;
    color: var(--rose); font-size: 1.2rem;
  }
  .chat-name { font-weight: 500; }
  .chat-status { font-size: 0.75rem; color: #22c55e; }
  .chat-messages {
    flex: 1; overflow-y: auto; padding: 1rem 1.5rem;
    display: flex; flex-direction: column; gap: 0.6rem;
    background: var(--cream);
    scrollbar-width: none;
  }
  .msg-row { display: flex; }
  .msg-row.me { justify-content: flex-end; }
  .msg-bubble {
    max-width: 70%; padding: 0.65rem 1rem;
    border-radius: 18px; font-size: 0.88rem; line-height: 1.5;
  }
  .msg-row:not(.me) .msg-bubble { background: white; border-bottom-left-radius: 4px; }
  .msg-row.me .msg-bubble { background: var(--rose); color: white; border-bottom-right-radius: 4px; }
  .msg-time { font-size: 0.7rem; color: var(--muted); margin-top: 0.2rem; text-align: center; align-self: center; }
  .chat-input-row {
    display: flex; gap: 0.75rem; padding: 1rem 1.5rem;
    background: white; border-top: 1px solid var(--border);
    align-items: center;
  }
  .chat-input {
    flex: 1; border: 1.5px solid var(--border); border-radius: 50px;
    padding: 0.6rem 1rem; font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; outline: none; background: var(--cream);
    transition: border-color 0.2s;
  }
  .chat-input:focus { border-color: var(--rose); }
  .chat-send {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--rose); border: none; cursor: pointer;
    color: white; font-size: 1rem; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .chat-send:hover { background: var(--rose-dark); }

  /* PROFILE */
  .profile-page { padding: 2rem 1.5rem; max-width: 500px; margin: 0 auto; width: 100%; }
  .profile-hero { text-align: center; margin-bottom: 2rem; }
  .profile-big-avatar {
    width: 100px; height: 100px; border-radius: 50%; border: 4px solid var(--rose);
    font-size: 3.5rem; display: flex; align-items: center; justify-content: center;
    background: var(--rose-light); margin: 0 auto 1rem;
  }
  .profile-hero-name {
    font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 600;
  }
  .profile-hero-sub { color: var(--muted); font-size: 0.9rem; margin-top: 0.25rem; }
  .profile-stats {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem; margin-bottom: 2rem;
  }
  .stat-box {
    background: white; border-radius: 16px; padding: 1rem;
    text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 600; color: var(--rose); }
  .stat-label { font-size: 0.72rem; color: var(--muted); margin-top: 0.1rem; }
  .profile-section { margin-bottom: 1.5rem; }
  .profile-section-title { font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; }
  .profile-field {
    background: white; border-radius: 14px; padding: 0.85rem 1rem;
    margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .field-icon { font-size: 1.1rem; }
  .field-label { font-size: 0.75rem; color: var(--muted); }
  .field-val { font-size: 0.9rem; font-weight: 500; }
  .premium-banner {
    background: linear-gradient(135deg, #c9a84c, #e8b84b);
    border-radius: 20px; padding: 1.25rem 1.5rem;
    color: white; display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .premium-title { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; }
  .premium-sub { font-size: 0.8rem; opacity: 0.9; margin-top: 0.2rem; }
  .premium-btn {
    background: white; color: var(--gold); border: none;
    padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600;
    font-size: 0.82rem; cursor: pointer; white-space: nowrap;
  }

  .empty-state { text-align: center; padding: 3rem 1rem; color: var(--muted); }
  .empty-state-icon { font-size: 3rem; margin-bottom: 1rem; }
  .empty-state-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--ink); }
  .empty-state-sub { font-size: 0.85rem; margin-top: 0.5rem; }
`;

// === DATA ===
const profiles = [
  {
    id: 1,
    name: "Sophia",
    age: 27,
    emoji: "👩‍🦰",
    location: "New York, NY",
    bio: "Art director by day, pasta enthusiast by night. Looking for someone to explore hidden NYC gems with.",
    tags: ["Art", "Foodie", "Travel", "Music"],
    bg: "#fde8eb",
  },
  {
    id: 2,
    name: "Zara",
    age: 25,
    emoji: "👩‍🦱",
    location: "Brooklyn, NY",
    bio: "Yoga teacher & plant mom. My heart belongs to the mountains and strong espresso.",
    tags: ["Yoga", "Nature", "Coffee", "Books"],
    bg: "#e8f0fe",
  },
  {
    id: 3,
    name: "Mia",
    age: 29,
    emoji: "👩‍🦳",
    location: "Manhattan, NY",
    bio: "Startup founder, dog lover. Let's debate philosophy over wine then dance until 2am.",
    tags: ["Tech", "Dogs", "Wine", "Dancing"],
    bg: "#e8fbe8",
  },
  {
    id: 4,
    name: "Elena",
    age: 26,
    emoji: "🧑‍🦲",
    location: "Queens, NY",
    bio: "Marine biologist saving the oceans one reef at a time. Also makes incredible tacos.",
    tags: ["Ocean", "Science", "Cooking", "Surfing"],
    bg: "#fff3e0",
  },
  {
    id: 5,
    name: "Jade",
    age: 28,
    emoji: "👱‍♀️",
    location: "Jersey City, NJ",
    bio: "Jazz musician & midnight baker. If you can't handle me at my flour-covered worst, you don't deserve me at my concert best.",
    tags: ["Jazz", "Baking", "Music", "Cats"],
    bg: "#f3e5f5",
  },
];

const myMatches = [
  { id: 10, name: "Ava", emoji: "🌸" },
  { id: 11, name: "Luna", emoji: "🌙" },
  { id: 12, name: "Iris", emoji: "🌺" },
  { id: 13, name: "Nova", emoji: "⭐" },
];

const initConvos = [
  {
    id: 20,
    name: "Ava",
    emoji: "🌸",
    last: "Haha omg yes!! When are you free?",
    time: "2m",
    unread: 2,
    msgs: [
      {
        from: "them",
        text: "Hey! So I heard you like jazz too? 🎷",
        time: "3:12 PM",
      },
      {
        from: "me",
        text: "YES! I'm literally obsessed. Favorite artist?",
        time: "3:14 PM",
      },
      {
        from: "them",
        text: "Miles Davis obviously but also Norah Jones lately",
        time: "3:15 PM",
      },
      {
        from: "me",
        text: "Norah Jones is perfection. We should go to a live show sometime!",
        time: "3:17 PM",
      },
      {
        from: "them",
        text: "Haha omg yes!! When are you free?",
        time: "3:18 PM",
      },
    ],
  },
  {
    id: 21,
    name: "Luna",
    emoji: "🌙",
    last: "That hiking trail sounds amazing!",
    time: "1h",
    unread: 0,
    msgs: [
      {
        from: "me",
        text: "Hey Luna! Great matching with you 😊",
        time: "Yesterday",
      },
      {
        from: "them",
        text: "Same! Love your hiking photos btw",
        time: "Yesterday",
      },
      {
        from: "me",
        text: "Thanks! There's a great trail in Harriman, ever been?",
        time: "Yesterday",
      },
      {
        from: "them",
        text: "That hiking trail sounds amazing!",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 22,
    name: "Iris",
    emoji: "🌺",
    last: "I make the best tiramisu, just saying 😏",
    time: "3h",
    unread: 1,
    msgs: [
      {
        from: "them",
        text: "Do you actually cook or is that just your bio? 👀",
        time: "10am",
      },
      { from: "me", text: "Haha I make decent pasta! You?", time: "10:05am" },
      {
        from: "them",
        text: "I make the best tiramisu, just saying 😏",
        time: "10:10am",
      },
    ],
  },
];

export default function DatingApp() {
  const [tab, setTab] = useState("discover");
  const [cards, setCards] = useState(profiles);
  const [showMatch, setShowMatch] = useState(null);
  const [flyDir, setFlyDir] = useState(null);
  const [convos, setConvos] = useState(initConvos);
  const [activeChat, setActiveChat] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const msgEndRef = useRef(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView();
  }, [activeChat, convos]);

  const handleSwipe = (dir) => {
    if (!cards.length) return;
    setFlyDir(dir);
    setTimeout(() => {
      const top = cards[0];
      setCards((prev) => prev.slice(1));
      setFlyDir(null);
      if (dir === "right" && Math.random() > 0.4) {
        setShowMatch(top);
      }
    }, 400);
  };

  const sendMsg = () => {
    if (!chatInput.trim() || !activeChat) return;
    setConvos((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              last: chatInput,
              unread: 0,
              msgs: [
                ...c.msgs,
                { from: "me", text: chatInput, time: "Just now" },
              ],
            }
          : c
      )
    );
    setActiveChat((prev) => ({
      ...prev,
      msgs: [...prev.msgs, { from: "me", text: chatInput, time: "Just now" }],
    }));
    setChatInput("");
    // Fake reply
    setTimeout(() => {
      const replies = [
        "That's so interesting! Tell me more 😊",
        "Haha love that!",
        "Okay yes I'm totally in 🙌",
        "You're so funny omg 😂",
        "Wait really?? That's wild",
        "I feel the same way honestly ❤️",
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setConvos((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? {
                ...c,
                last: reply,
                msgs: [
                  ...c.msgs,
                  { from: "them", text: reply, time: "Just now" },
                ],
              }
            : c
        )
      );
      setActiveChat((prev) => ({
        ...prev,
        msgs: [...prev.msgs, { from: "them", text: reply, time: "Just now" }],
      }));
    }, 1200);
  };

  const openChat = (convo) => {
    setConvos((prev) =>
      prev.map((c) => (c.id === convo.id ? { ...c, unread: 0 } : c))
    );
    setActiveChat(convo);
    setTab("chat");
  };

  return (
    <>
      <style>{style}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            Amore<span>.</span>
          </div>
          {activeChat && tab === "chat" ? (
            <div className="nav-tabs">
              <button
                className="nav-tab"
                onClick={() => {
                  setActiveChat(null);
                  setTab("matches");
                }}
              >
                ← Back
              </button>
            </div>
          ) : (
            <div className="nav-tabs">
              {["discover", "matches", "profile"].map((t) => (
                <button
                  key={t}
                  className={`nav-tab ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t === "discover"
                    ? "✨ Discover"
                    : t === "matches"
                    ? "💌 Matches"
                    : "👤 Profile"}
                </button>
              ))}
            </div>
          )}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--rose-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              border: "2px solid var(--rose)",
              cursor: "pointer",
            }}
            onClick={() => setTab("profile")}
          >
            😊
          </div>
        </nav>

        {/* DISCOVER */}
        {tab === "discover" && (
          <div className="discover">
            {cards.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🌹</div>
                <div className="empty-state-title">You've seen everyone!</div>
                <div className="empty-state-sub">
                  Come back later for new faces
                </div>
              </div>
            ) : (
              <>
                <div className="card-stack">
                  {cards.slice(0, 3).map((p, i) => (
                    <div
                      key={p.id}
                      className={`profile-card ${i === 0 ? "top" : ""} ${
                        i === 0 && flyDir === "left" ? "fly-left" : ""
                      } ${i === 0 && flyDir === "right" ? "fly-right" : ""}`}
                    >
                      <div
                        className="card-photo-placeholder"
                        style={{ background: p.bg }}
                      >
                        {p.emoji}
                      </div>
                      {i === 0 && (
                        <div
                          className="card-overlay-like"
                          style={{ opacity: flyDir === "right" ? 1 : 0 }}
                        >
                          LIKE
                        </div>
                      )}
                      {i === 0 && (
                        <div
                          className="card-overlay-nope"
                          style={{ opacity: flyDir === "left" ? 1 : 0 }}
                        >
                          NOPE
                        </div>
                      )}
                      <div className="card-info">
                        <div>
                          <span className="card-name">{p.name}</span>
                          <span className="card-name card-age">{p.age}</span>
                        </div>
                        <div className="card-loc">📍 {p.location}</div>
                        <div className="card-bio">{p.bio}</div>
                        <div className="card-tags">
                          {p.tags.map((t) => (
                            <span key={t} className="card-tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="swipe-actions">
                  <button
                    className="action-btn nope"
                    onClick={() => handleSwipe("left")}
                  >
                    ✕
                  </button>
                  <button
                    className="action-btn super"
                    onClick={() => handleSwipe("right")}
                  >
                    ⭐
                  </button>
                  <button
                    className="action-btn like"
                    onClick={() => handleSwipe("right")}
                  >
                    ♥
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* MATCHES */}
        {tab === "matches" && !activeChat && (
          <div className="matches-page">
            <div className="section-title">New Matches</div>
            <div className="new-matches">
              {myMatches.map((m) => (
                <div
                  key={m.id}
                  className="new-match"
                  onClick={() =>
                    openChat({
                      id: m.id + 100,
                      name: m.name,
                      emoji: m.emoji,
                      last: "You matched!",
                      unread: 0,
                      msgs: [
                        {
                          from: "them",
                          text: `Hey! We matched 🎉 How's your day going?`,
                          time: "Just now",
                        },
                      ],
                    })
                  }
                >
                  <div className="new-match-avatar">{m.emoji}</div>
                  <div className="new-match-name">{m.name}</div>
                </div>
              ))}
            </div>
            <div className="section-title">Messages</div>
            <div className="conversations">
              {convos.map((c) => (
                <div
                  key={c.id}
                  className="convo-item"
                  onClick={() => openChat(c)}
                >
                  <div className="convo-avatar">{c.emoji}</div>
                  <div className="convo-info">
                    <div className="convo-name">{c.name}</div>
                    <div className="convo-preview">{c.last}</div>
                  </div>
                  <div className="convo-meta">
                    <div className="convo-time">{c.time}</div>
                    {c.unread > 0 && (
                      <div className="convo-unread">{c.unread}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHAT */}
        {tab === "chat" && activeChat && (
          <div className="chat-page">
            <div className="chat-header">
              <button
                className="chat-back"
                onClick={() => {
                  setActiveChat(null);
                  setTab("matches");
                }}
              >
                ←
              </button>
              <div
                className="convo-avatar"
                style={{ width: 40, height: 40, fontSize: "1.4rem" }}
              >
                {activeChat.emoji}
              </div>
              <div>
                <div className="chat-name">{activeChat.name}</div>
                <div className="chat-status">● Online</div>
              </div>
            </div>
            <div className="chat-messages">
              {activeChat.msgs.map((m, i) => (
                <div
                  key={i}
                  className={`msg-row ${m.from === "me" ? "me" : ""}`}
                >
                  <div className="msg-bubble">{m.text}</div>
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>
            <div className="chat-input-row">
              <input
                className="chat-input"
                placeholder="Say something sweet..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
              />
              <button className="chat-send" onClick={sendMsg}>
                ➤
              </button>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <div className="profile-page">
            <div className="profile-hero">
              <div className="profile-big-avatar">😊</div>
              <div className="profile-hero-name">Alex Rivera</div>
              <div className="profile-hero-sub">28 · New York, NY</div>
            </div>
            <div className="profile-stats">
              <div className="stat-box">
                <div className="stat-num">47</div>
                <div className="stat-label">Likes</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">12</div>
                <div className="stat-label">Matches</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">8</div>
                <div className="stat-label">Chats</div>
              </div>
            </div>
            <div className="premium-banner">
              <div>
                <div className="premium-title">✨ Amore Gold</div>
                <div className="premium-sub">
                  See who liked you & unlimited swipes
                </div>
              </div>
              <button className="premium-btn">Upgrade</button>
            </div>
            <div className="profile-section">
              <div className="profile-section-title">About Me</div>
              <div className="profile-field">
                <span className="field-icon">💼</span>
                <div>
                  <div className="field-label">Job</div>
                  <div className="field-val">Product Designer at Figma</div>
                </div>
              </div>
              <div className="profile-field">
                <span className="field-icon">🎓</span>
                <div>
                  <div className="field-label">Education</div>
                  <div className="field-val">NYU · Graphic Design</div>
                </div>
              </div>
              <div className="profile-field">
                <span className="field-icon">📍</span>
                <div>
                  <div className="field-label">Location</div>
                  <div className="field-val">New York, NY</div>
                </div>
              </div>
              <div className="profile-field">
                <span className="field-icon">🌍</span>
                <div>
                  <div className="field-label">Looking for</div>
                  <div className="field-val">Something serious</div>
                </div>
              </div>
            </div>
            <div className="profile-section">
              <div className="profile-section-title">My Interests</div>
              <div className="card-tags" style={{ paddingBottom: "1rem" }}>
                {[
                  "Design",
                  "Travel",
                  "Coffee",
                  "Film",
                  "Hiking",
                  "Cooking",
                  "Jazz",
                  "Reading",
                ].map((t) => (
                  <span key={t} className="card-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MATCH POPUP */}
        {showMatch && (
          <div className="match-popup" onClick={() => setShowMatch(null)}>
            <div className="match-card" onClick={(e) => e.stopPropagation()}>
              <div className="match-hearts">💖</div>
              <div className="match-title">It's a Match!</div>
              <div className="match-sub">
                You and {showMatch.name} liked each other
              </div>
              <div className="match-avatars">
                <div className="match-avatar">😊</div>
                <div className="match-avatar">{showMatch.emoji}</div>
              </div>
              <button
                className="match-btn"
                onClick={() => {
                  const newConvo = {
                    id: Date.now(),
                    name: showMatch.name,
                    emoji: showMatch.emoji,
                    last: "You matched! Say hi 👋",
                    time: "now",
                    unread: 1,
                    msgs: [
                      {
                        from: "them",
                        text: `Hey! We matched 🎉 You seem really interesting!`,
                        time: "Just now",
                      },
                    ],
                  };
                  setConvos((prev) => [newConvo, ...prev]);
                  setShowMatch(null);
                  openChat(newConvo);
                }}
              >
                💬 Send a Message
              </button>
              <button
                className="match-btn ghost"
                onClick={() => setShowMatch(null)}
              >
                Keep Swiping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
