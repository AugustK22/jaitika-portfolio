import React from "react";
// import FairyLights from "../components/FairyLights";
import Footer from "../components/Footer";
import "./sphere.css";

export default function Sphere() {
  const handlePrint = () => window.print();

  return (
    <>
      {/* <FairyLights /> */}

      <main className="sphere-page">
        <div className="container">
          {/* Header */}
          <header className="page-header" id="sphere">
            <div className="kicker">the sphere</div>
            <h1>Merging Food Technology with Creative Storytelling.</h1>
            <div className="subtitle">Chaotic · Dreamy · Ambitious — professionally tidy</div>
            <p className="intro">
              A focused, recruiter-friendly snapshot of Jaitika’s professional self. Clean sections, aligned
              timeline, and the same cozy-chaos aesthetic — tuned down just enough for the boardroom.
            </p>
          </header>

          {/* Contact slab */}
          <section className="contact-slab" aria-label="Contact & actions">
            <div className="contact-grid">
              <div className="c-item">
                <strong>Jaitika Singh Rathore</strong>
                <small>New Delhi, Delhi</small>
              </div>
              <div className="c-item">
                <strong>Phone</strong>
                <small>
                  <a href="tel:+918287659143">+91 82876 59143</a>
                </small>
              </div>
              <div className="c-item">
                <strong>Email</strong>
                <small>
                  <a href="mailto:jaitika.ug300@lic.du.ac.in">jaitika.ug300@lic.du.ac.in</a>
                </small>
              </div>
              <div className="c-item">
                <strong>Availability</strong>
                <small>Open to on-site &amp; hybrid internships</small>
              </div>
            </div>

            <div className="cta">
              <a
                className="pill secondary"
                href="https://www.linkedin.com/in/jaitika-singh-rathore-918648318/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="pill"
                href="mailto:jaitika.ug300@lic.du.ac.in?subject=Internship%20Opportunity%20for%20Jaitika%20Singh%20Rathore"
              >
                Email
              </a>
              <button className="pill" type="button" onClick={handlePrint}>
                Download PDF
              </button>
            </div>
          </section>

          {/* Main grid */}
          <section className="grid">
            {/* Education */}
            <div className="card" aria-label="Education">
              <h2>Education</h2>
              <div className="line" />
              <div className="timeline">
                <div className="tl-row">
                  <div className="tl-when">2024 – Present</div>
                  <div className="tl-body">
                    <h3>B.Sc. in Food Technology — Lady Irwin College, University of Delhi</h3>
                    <div className="sub">
                      Undergraduate coursework in Food Technology; marketing-leaning projects and campus outreach.
                    </div>
                    <div className="sub">
                      <span className="badge">Sem I CGPA: 8.68</span>
                      <span className="badge">Sem II CGPA: 7.55</span>
                    </div>
                  </div>
                  <span className="tl-dot" aria-hidden="true" />
                </div>

                <div className="tl-row">
                  <div className="tl-when">2009 – 2024</div>
                  <div className="tl-body">
                    <h3>MBS International School — Dwarka Sector 11, New Delhi</h3>
                    <div className="sub">
                      Class XII (CBSE): <strong>89.8%</strong> · Class X (CBSE): <strong>88.8%</strong>
                    </div>
                    <div className="sub">
                      <span className="badge">Centum in Hindustani Music (Melodic Instrumental)</span>
                    </div>
                  </div>
                  <span className="tl-dot" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="card" aria-label="Skills">
              <h2>Skills</h2>
              <div className="line" />
              <div className="skill-list">
                <div className="skill">
                  <div className="skill-title">Communication &amp; Storytelling</div>
                  <div className="skill-desc">
                    Bilingual (English/Hindi), persuasive presentations, translating technical concepts into
                    memorable narratives.
                  </div>
                </div>
                <div className="skill">
                  <div className="skill-title">Marketing &amp; Branding</div>
                  <div className="skill-desc">
                    Content curation, promotion, and community engagement across social platforms and events; brand
                    voice &amp; tone.
                  </div>
                </div>
                <div className="skill">
                  <div className="skill-title">Interpersonal &amp; Team</div>
                  <div className="skill-desc">
                    Networking, collaboration, and audience engagement; dependable contributor who shows up
                    consistently.
                  </div>
                </div>
                <div className="skill">
                  <div className="skill-title">Adaptability &amp; Creativity</div>
                  <div className="skill-desc">
                    Exploring design trends and tools; consumer-psychology curious; fast learning with taste.
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership & roles */}
            <div className="card" aria-label="Leadership & Campus Roles">
              <h2>Leadership &amp; Campus Roles</h2>
              <div className="line" />
              <div className="list">
                <div className="item">
                  <h3>Co-Head, Marketing — Food Technology Professional Chapter</h3>
                  <p>
                    Lady Irwin College · Led content and outreach for departmental initiatives; strengthened
                    student–industry interface.
                  </p>
                </div>
                <div className="item">
                  <h3>Social Media Dept. Member — Nrityanjali (ICFW Dance Society)</h3>
                  <p>Curated posts, covered events, and amplified cultural programming for campus audiences.</p>
                </div>
                <div className="item">
                  <h3>PR Team Member — SPICMACAY, LIC Chapter</h3>
                  <p>Supported communication for heritage arts events; community engagement and event promotion.</p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="card" aria-label="Highlights">
              <h2>Highlights</h2>
              <div className="line" />
              <div className="list">
                <div className="item">
                  <h3>What I’m learning</h3>
                  <p>
                    Brand building for food &amp; beverage, audience research, visual storytelling, and
                    data-informed content strategy.
                  </p>
                </div>
                <div className="item">
                  <h3>What I bring</h3>
                  <p>
                    Warm, reliable communication; taste and restraint; the ability to make technical work feel human
                    and memorable.
                  </p>
                </div>
                <div className="item">
                  <h3>Languages</h3>
                  <p>
                    <span className="badge">Hindi — Well versed</span>
                    <span className="badge">English — Well versed</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="cta-panel" aria-label="Call to action">
            <h3>
              Seeking internships to bring innovative marketing strategies to the food technology industry.
            </h3>
            <p>
              Let’s connect if you’re building brands with taste — and want someone who can translate labs,
              labels, and logistics into stories people actually care about.
            </p>
            <div className="actions">
              <a
                className="pill secondary"
                href="https://www.linkedin.com/in/jaitika-singh-rathore-918648318/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
              <a
                className="pill"
                href="mailto:jaitika.ug300@lic.du.ac.in?subject=Internship%20Opportunity%20for%20Jaitika%20Singh%20Rathore"
              >
                Email Jaitika
              </a>
            </div>
          </section>

          {/* Local footer text handled by global Footer */}
        </div>
      </main>

      <Footer />
    </>
  );
}
