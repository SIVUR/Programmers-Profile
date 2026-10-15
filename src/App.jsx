import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
    ExpenseDemo,
    LibraryDemo,
    PortfolioDemo,
    StudentDemo,
    TaskDemo,
    WeatherDemo,
} from "./ProjectDemos.jsx";

const skills = ["HTML", "CSS", "JavaScript", "React.js", "PHP", "MySQL"];

const projects = [
    {
        number: "01",
        category: "Database",
        name: "Student Management System",
        description:
            "Add and remove student records in this browser-based management demo.",
    },
    {
        number: "02",
        category: "Web",
        name: "Personal Portfolio",
        description:
            "The responsive portfolio you’re viewing, with my skills, projects, and contact links.",
    },
    {
        number: "03",
        category: "Database",
        name: "Library Database",
        description:
            "Add books to a local catalog and mark them borrowed or available.",
    },
    {
        number: "04",
        category: "Web",
        name: "Task Tracker",
        description:
            "Add tasks, mark them complete, and keep your list saved in this browser.",
    },
    {
        number: "05",
        category: "Web",
        name: "Weather Dashboard",
        description:
            "Look up current temperature, humidity, and wind for a city using live weather data.",
    },
    {
        number: "06",
        category: "Database",
        name: "Expense Tracker",
        description:
            "Record expenses by category and see your total update instantly.",
    },
];

const githubUrl = "https://github.com/SIVUR";
const facebookUrl = "https://www.facebook.com/BenjzBagsbunnyJr/";
const emailAddress = "benjbagoyboy@gmail.com";

function ProjectDemoDialog({ project, onClose }) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        function closeOnEscape(event) {
            if (event.key === "Escape") onClose();
        }

        window.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [onClose]);

    const demos = {
        "Student Management System": <StudentDemo />,
        "Personal Portfolio": (
            <PortfolioDemo
                githubUrl={githubUrl}
                facebookUrl={facebookUrl}
                emailAddress={emailAddress}
            />
        ),
        "Library Database": <LibraryDemo />,
        "Task Tracker": <TaskDemo />,
        "Weather Dashboard": <WeatherDemo />,
        "Expense Tracker": <ExpenseDemo />,
    };

    return (
        <div
            className="demo-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                className="demo-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="demo-dialog-title"
            >
                <div className="demo-dialog-heading">
                    <div>
                        <p className="section-kicker">WORKING PROJECT DEMO</p>
                        <h2 id="demo-dialog-title">{project.name}</h2>
                    </div>
                    <button className="demo-close" type="button" onClick={onClose} aria-label="Close project demo" autoFocus>
                        ×
                    </button>
                </div>
                {demos[project.name]}
            </section>
        </div>
    );
}

function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState(
        () =>
            window.localStorage.getItem("portfolio-theme") === "light"
                ? "light"
                : "dark",
    );
    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        window.localStorage.setItem("portfolio-theme", theme);
    }, [theme]);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top site-nav" aria-label="Main navigation">
            <div className="container">
                <a className="navbar-brand brand" href="#home" onClick={closeMenu}>
                    Benjz<span>.</span>
                </a>
                <button
                    className="navbar-toggler nav-toggle"
                    type="button"
                    aria-controls="site-navigation"
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div
                    className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
                    id="site-navigation"
                >
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">
                        {[
                            ["About", "#about"],
                            ["Skills", "#skills"],
                            ["Projects", "#projects"],
                            ["Contact", "#contact"],
                        ].map(([label, href]) => (
                            <li className="nav-item" key={href}>
                                <a className="nav-link nav-item-link" href={href} onClick={closeMenu}>
                                    {label}
                                </a>
                            </li>
                        ))}
                        <li className="nav-item">
                            <button
                                className="btn theme-toggle"
                                type="button"
                                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                                aria-pressed={theme === "light"}
                                onClick={() =>
                                    setTheme((currentTheme) =>
                                        currentTheme === "dark" ? "light" : "dark",
                                    )
                                }
                            >
                                <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
                                <span className="theme-toggle-label">
                                    {theme === "dark" ? "Light mode" : "Dark mode"}
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

function App() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeProject, setActiveProject] = useState(null);
    const closeProject = useCallback(() => setActiveProject(null), []);

    const visibleProjects = projects.filter(
        (project) =>
            activeCategory === "All" || project.category === activeCategory,
    );

    useEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion || !("IntersectionObserver" in window)) {
            return undefined;
        }

        document.documentElement.classList.add("motion-ready");
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 },
        );

        document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

        return () => {
            revealObserver.disconnect();
            document.documentElement.classList.remove("motion-ready");
        };
    }, [activeCategory]);

    return (
        <>
            <Navigation />

            <main>
                <section className="hero-section" id="home">
                    <div className="container">
                        <div className="row align-items-center gy-5">
                            <div className="col-lg-7 hero-copy reveal">
                                <p className="eyebrow"><span className="eyebrow-dot" />Hello, welcome to my portfolio</p>
                                <h1>
                                    Building my path
                                    <br />
                                    <span>one line of code</span>
                                    <br />
                                    at a time.
                                </h1>
                                <p className="hero-intro">
                                    I’m <strong>Bagoyboy Benjamin Jr.</strong>, an IT student and
                                    aspiring web developer who enjoys turning ideas into useful,
                                    thoughtful web experiences.
                                </p>
                                <div className="hero-actions d-flex flex-wrap gap-3">
                                    <a className="btn btn-primary btn-lg" href="#projects">
                                        Explore my work <span aria-hidden="true">↗</span>
                                    </a>
                                    <a className="btn btn-outline-light btn-lg" href="#contact">
                                        Get in touch
                                    </a>
                                </div>
                                <p className="hero-role">Aspiring Web Developer <span>· IT Student</span></p>
                            </div>

                            <div className="col-lg-5 reveal">
                                <div className="portrait-panel">
                                    <div className="portrait-glow" />
                                    <img
                                        className="portrait-image"
                                        src={new URL("../Trap.jpg.jpg", import.meta.url).href}
                                        alt="Portrait of Bagoyboy Benjamin Jr."
                                    />
                                    <div className="portrait-label">
                                        <span className="availability-dot" />
                                        <span>Curious mind. Growing developer.</span>
                                    </div>
                                    <span className="portrait-index">IT STUDENT · WEB DEVELOPER</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-space" id="about">
                    <div className="container">
                        <div className="row g-5 align-items-start">
                            <div className="col-lg-4 reveal">
                                <p className="section-kicker">01 / About me</p>
                                <h2 className="section-title">
                                    Learning by
                                    <br />
                                    <span>building.</span>
                                </h2>
                            </div>
                            <div className="col-lg-7 offset-lg-1 reveal">
                                <p className="about-lead">
                                    I’m an IT student and aspiring programmer with a growing
                                    interest in web development.
                                </p>
                                <p className="section-copy">
                                    I enjoy learning how websites work, solving problems with
                                    code, and creating projects that make everyday tasks a
                                    little easier. I’m building my skills one idea and one
                                    project at a time.
                                </p>
                                <div className="about-note">
                                    <span className="note-mark" aria-hidden="true">✳</span>
                                    <span>Curious, consistent, and always ready to learn something new.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-space section-muted" id="skills">
                    <div className="container">
                        <div className="section-heading-row reveal">
                            <div>
                                <p className="section-kicker">02 / What I work with</p>
                                <h2 className="section-title">Skills in progress<span>.</span></h2>
                            </div>
                            <p className="section-copy heading-aside">
                                The tools I’m learning and using as I grow as a developer.
                            </p>
                        </div>
                        <div className="row g-3 skills-grid">
                            {skills.map((skill, index) => (
                                <div className="col-6 col-md-4" key={skill}>
                                    <div className="skill-tile reveal">
                                        <span className="skill-number">0{index + 1}</span>
                                        <span className="skill-symbol" aria-hidden="true">
                                            {["</>", "#", "JS", "R", "PHP", "DB"][index]}
                                        </span>
                                        <h3>{skill}</h3>
                                        <span className="skill-status">Learning</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section-space" id="projects">
                    <div className="container">
                        <div className="section-heading-row reveal">
                            <div>
                                <p className="section-kicker">03 / Selected work</p>
                                <h2 className="section-title">School projects<span>.</span></h2>
                            </div>
                            <p className="section-copy heading-aside">
                                Small steps, practical ideas, and plenty of room to grow.
                            </p>
                        </div>
                        <div className="project-filters" aria-label="Filter projects by type">
                            {["All", "Web", "Database"].map((category) => (
                                <button
                                    className={`project-filter${activeCategory === category ? " is-active" : ""}`}
                                    type="button"
                                    key={category}
                                    aria-pressed={activeCategory === category}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                            <span className="project-count" aria-live="polite">
                                {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}
                            </span>
                        </div>
                        <div className="row g-4">
                            {visibleProjects.map((project) => (
                                <div className="col-md-6 col-lg-4" key={project.number}>
                                    <article className="project-card reveal">
                                        <div className="project-card-top">
                                            <span>PROJECT / {project.number}</span>
                                            <span className="project-category">{project.category}</span>
                                        </div>
                                        <h3>{project.name}</h3>
                                        <p>{project.description}</p>
                                        <button
                                            className="text-link project-launch"
                                            type="button"
                                            onClick={() => setActiveProject(project)}
                                        >
                                            Try live demo <span aria-hidden="true">↗</span>
                                        </button>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="contact-section section-space" id="contact">
                    <div className="container">
                        <div className="contact-panel reveal">
                            <div className="row align-items-end gy-4">
                                <div className="col-lg-7">
                                    <p className="section-kicker">04 / Get in touch</p>
                                    <h2 className="contact-title">
                                        Let’s make
                                        <br />
                                        something <span>great.</span>
                                    </h2>
                                    <p className="section-copy">
                                        Have an idea, opportunity, or just want to say hello?
                                        I’d be happy to hear from you.
                                    </p>
                                </div>
                                <div className="col-lg-5">
                                    <div className="contact-links">
                                        <a href={`mailto:${emailAddress}`} className="contact-link">
                                            <span>Email</span><strong>{emailAddress}</strong><span aria-hidden="true">↗</span>
                                        </a>
                                        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="contact-link">
                                            <span>GitHub</span><strong>BagoyboyBenjzJr</strong><span aria-hidden="true">↗</span>
                                        </a>
                                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="contact-link">
                                            <span>Facebook</span><strong>BagoyboyBenjzJr</strong><span aria-hidden="true">↗</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="site-footer">
                <div className="container d-flex flex-column flex-sm-row justify-content-between gap-2">
                    <span>© {new Date().getFullYear()} Bagoyboy Benjamin Jr.</span>
                    <a href="#home">Back to top ↑</a>
                </div>
            </footer>
            {activeProject && (
                <ProjectDemoDialog project={activeProject} onClose={closeProject} />
            )}
        </>
    );
}

export default App;
