import React from "react";
// import FairyLights from "../components/FairyLights";
import Footer from "../components/Footer";
import "./blueprint.css";

export default function Blueprint() {
  return (
    <>
      {/* Fairy lights overlay (reuses your component) */}
      {/* <FairyLights /> */}

      <main className="blueprint-page">
        <div className="container">
          {/* Page Header */}
          <header className="page-header">
            <h1 className="page-title">The Blueprint</h1>
            <p className="page-subtitle">the girl who lives in the margins</p>
          </header>

          {/* Section 1: The Narrative */}
          <section className="section">
            <div className="section-title-container">
              <h2 className="section-title">The Girl Who Gives Love Freely</h2>
              <p className="section-subtitle">a story written in heartbreak and hope</p>
            </div>

            <div className="narrative-content">
              <div className="dreamcatcher-decoration dreamcatcher-left">✧</div>
              <div className="dreamcatcher-decoration dreamcatcher-right">✦</div>

              <p className="narrative-paragraph">
                <span className="highlight">My superpower is giving love to people.</span> Even when someone
                offers only the smallest effort, I meet them with warmth. Even when they hurt me, I can still care.
                That’s just how I’m built, someone who feels deeply, sometimes to the point of being overwhelmed. I
                don’t guard my heart behind walls; I offer it openly, knowing the risk, accepting the cost.
              </p>

              <p className="narrative-paragraph">
                Life has handed me moments that shattered me and moments that set me free. Loss taught me fearlessness.
                Heartbreak taught me that you cannot build homes inside other people. These lessons changed how I move
                through the world, they hardened some parts of me, but they also shaped my strength.
              </p>

              <p className="narrative-paragraph">
                The world can be unkind, and I’ve felt myself grow distant at times. There were days when I felt I had
                nothing left to give. Yet even then, I never stopped trying to meet people with love instead of
                bitterness. That empathetic part of me still exists, it’s quieter now, but it’s there, waiting to rise again.
              </p>

              <p className="narrative-paragraph">
                <span className="highlight">I’m still waiting for the day my soul feels whole again,</span> for someone
                or something to remind me that softness isn’t weakness. Until then, I’m building my own home, corner by
                corner, light by light, dream by dream. My world is beautifully chaotic, like me. And in that chaos,
                I’ve learned how to find peace.
              </p>
            </div>
          </section>

          {/* Closing Quote */}
          <div className="closing-quote">
            <p>
              "Chaotic, dreamy, and ambitious. I do not do anything because I keep procrastinating it, but yes,
              I am very ambitious and dreamy."
            </p>
            <div className="author">,  in her own words</div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
