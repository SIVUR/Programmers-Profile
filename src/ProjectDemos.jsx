import * as React from "react";
import { useEffect, useState } from "react";

function useSavedList(storageKey) {
    const [items, setItems] = useState(() => {
        const saved = window.localStorage.getItem(storageKey);
        if (!saved) return [];

        try {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error(`Could not read saved ${storageKey} data.`, error);
            return [];
        }
    });

    useEffect(() => {
        window.localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, storageKey]);

    return [items, setItems];
}

function DemoNotice() {
    return (
        <p className="demo-notice">
            Demo mode · Your changes are saved in this browser only.
        </p>
    );
}

export function StudentDemo() {
    const [students, setStudents] = useSavedList("portfolio-students");
    const [name, setName] = useState("");
    const [course, setCourse] = useState("");
    const [error, setError] = useState("");

    function addStudent(event) {
        event.preventDefault();
        if (!name.trim() || !course.trim()) {
            setError("Enter both a student name and course.");
            return;
        }
        setStudents((current) => [
            ...current,
            { id: crypto.randomUUID(), name: name.trim(), course: course.trim() },
        ]);
        setName("");
        setCourse("");
        setError("");
    }

    return (
        <div className="demo-app">
            <DemoNotice />
            <form className="demo-form" onSubmit={addStudent}>
                <label>
                    Student name
                    <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Alex Rivera" />
                </label>
                <label>
                    Course
                    <input value={course} onChange={(event) => setCourse(event.target.value)} placeholder="e.g. Information Technology" />
                </label>
                <button className="btn btn-primary" type="submit">Add student</button>
            </form>
            {error && <p className="demo-error" role="alert">{error}</p>}
            <div className="demo-list">
                {students.length === 0 ? (
                    <p className="demo-empty">No students yet. Add one above to try it out.</p>
                ) : students.map((student) => (
                    <div className="demo-list-row" key={student.id}>
                        <span><strong>{student.name}</strong><small>{student.course}</small></span>
                        <button className="demo-remove" type="button" aria-label={`Remove ${student.name}`} onClick={() => setStudents((current) => current.filter((item) => item.id !== student.id))}>Remove</button>
                    </div>
                ))}
            </div>
            <p className="demo-summary">{students.length} {students.length === 1 ? "student" : "students"}</p>
        </div>
    );
}

export function LibraryDemo() {
    const [books, setBooks] = useSavedList("portfolio-library-books");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [error, setError] = useState("");

    function addBook(event) {
        event.preventDefault();
        if (!title.trim() || !author.trim()) {
            setError("Enter both a book title and author.");
            return;
        }
        setBooks((current) => [
            ...current,
            { id: crypto.randomUUID(), title: title.trim(), author: author.trim(), borrowed: false },
        ]);
        setTitle("");
        setAuthor("");
        setError("");
    }

    return (
        <div className="demo-app">
            <DemoNotice />
            <form className="demo-form" onSubmit={addBook}>
                <label>Book title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. The Pragmatic Programmer" /></label>
                <label>Author<input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="e.g. Andy Hunt" /></label>
                <button className="btn btn-primary" type="submit">Add book</button>
            </form>
            {error && <p className="demo-error" role="alert">{error}</p>}
            <div className="demo-list">
                {books.length === 0 ? (
                    <p className="demo-empty">No books yet. Add a book to start your catalog.</p>
                ) : books.map((book) => (
                    <div className="demo-list-row" key={book.id}>
                        <span><strong>{book.title}</strong><small>by {book.author} · {book.borrowed ? "Borrowed" : "Available"}</small></span>
                        <div className="demo-row-actions">
                            <button className="demo-remove" type="button" onClick={() => setBooks((current) => current.map((item) => item.id === book.id ? { ...item, borrowed: !item.borrowed } : item))}>{book.borrowed ? "Return" : "Borrow"}</button>
                            <button className="demo-remove" type="button" aria-label={`Remove ${book.title}`} onClick={() => setBooks((current) => current.filter((item) => item.id !== book.id))}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <p className="demo-summary">{books.filter((book) => !book.borrowed).length} available · {books.filter((book) => book.borrowed).length} borrowed</p>
        </div>
    );
}

export function TaskDemo() {
    const [tasks, setTasks] = useSavedList("portfolio-tasks");
    const [taskText, setTaskText] = useState("");
    const [error, setError] = useState("");

    function addTask(event) {
        event.preventDefault();
        if (!taskText.trim()) {
            setError("Write a task before adding it.");
            return;
        }
        setTasks((current) => [...current, { id: crypto.randomUUID(), text: taskText.trim(), done: false }]);
        setTaskText("");
        setError("");
    }

    return (
        <div className="demo-app">
            <DemoNotice />
            <form className="demo-form demo-form-inline" onSubmit={addTask}>
                <label>New task<input value={taskText} onChange={(event) => setTaskText(event.target.value)} placeholder="What do you need to do?" /></label>
                <button className="btn btn-primary" type="submit">Add task</button>
            </form>
            {error && <p className="demo-error" role="alert">{error}</p>}
            <div className="demo-list">
                {tasks.length === 0 ? (
                    <p className="demo-empty">Your list is clear. Add a task to get started.</p>
                ) : tasks.map((task) => (
                    <div className="demo-list-row" key={task.id}>
                        <label className={`demo-task-label${task.done ? " is-done" : ""}`}>
                            <input type="checkbox" checked={task.done} onChange={() => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))} />
                            <span>{task.text}</span>
                        </label>
                        <button className="demo-remove" type="button" aria-label={`Remove ${task.text}`} onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))}>Remove</button>
                    </div>
                ))}
            </div>
            <p className="demo-summary">{tasks.filter((task) => task.done).length} of {tasks.length} complete</p>
        </div>
    );
}

const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Freezing fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Heavy rain showers",
    95: "Thunderstorm",
};

export function WeatherDemo() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function searchWeather(event) {
        event.preventDefault();
        const searchCity = city.trim();
        if (!searchCity) {
            setError("Enter a city name to search.");
            return;
        }

        setLoading(true);
        setError("");
        setWeather(null);
        try {
            const locationResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1&language=en&format=json`,
            );
            if (!locationResponse.ok) throw new Error("Could not find weather service.");
            const locationData = await locationResponse.json();
            const location = locationData.results?.[0];
            if (!location) {
                setError(`No location found for “${searchCity}”. Check the spelling and try again.`);
                return;
            }

            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`,
            );
            if (!weatherResponse.ok) throw new Error("Could not load the current weather.");
            const weatherData = await weatherResponse.json();
            setWeather({ location, current: weatherData.current });
        } catch (requestError) {
            console.error("Weather lookup failed.", requestError);
            setError(requestError.message || "Weather lookup failed. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="demo-app">
            <p className="demo-notice">Live weather · Requires an internet connection · Data by Open-Meteo</p>
            <form className="demo-form demo-form-inline" onSubmit={searchWeather}>
                <label>Search a city<input value={city} onChange={(event) => setCity(event.target.value)} placeholder="e.g. Manila" /></label>
                <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Loading…" : "Get weather"}</button>
            </form>
            {error && <p className="demo-error" role="alert">{error}</p>}
            {weather && (
                <div className="weather-result" aria-live="polite">
                    <div><p className="section-kicker">{weather.location.name}{weather.location.country ? `, ${weather.location.country}` : ""}</p><p className="weather-condition">{weatherDescriptions[weather.current.weather_code] || "Current conditions"}</p></div>
                    <strong className="weather-temperature">{Math.round(weather.current.temperature_2m)}°</strong>
                    <div className="weather-details">
                        <span>Feels like <strong>{Math.round(weather.current.apparent_temperature)}°C</strong></span>
                        <span>Humidity <strong>{weather.current.relative_humidity_2m}%</strong></span>
                        <span>Wind <strong>{weather.current.wind_speed_10m} km/h</strong></span>
                    </div>
                </div>
            )}
        </div>
    );
}

export function ExpenseDemo() {
    const [expenses, setExpenses] = useSavedList("portfolio-expenses");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [error, setError] = useState("");
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const formatAmount = (value) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value);

    function addExpense(event) {
        event.preventDefault();
        const parsedAmount = Number(amount);
        if (!description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            setError("Enter a description and an amount greater than zero.");
            return;
        }
        setExpenses((current) => [
            ...current,
            { id: crypto.randomUUID(), description: description.trim(), amount: parsedAmount, category },
        ]);
        setDescription("");
        setAmount("");
        setError("");
    }

    return (
        <div className="demo-app">
            <DemoNotice />
            <div className="expense-total"><span>Total recorded</span><strong>{formatAmount(total)}</strong></div>
            <form className="demo-form expense-form" onSubmit={addExpense}>
                <label>Description<input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="e.g. Lunch" /></label>
                <label>Amount (PHP)<input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /></label>
                <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Food</option><option>Transport</option><option>School</option><option>Other</option></select></label>
                <button className="btn btn-primary" type="submit">Add expense</button>
            </form>
            {error && <p className="demo-error" role="alert">{error}</p>}
            <div className="demo-list">
                {expenses.length === 0 ? (
                    <p className="demo-empty">No expenses recorded. Add one to see the total update.</p>
                ) : expenses.map((expense) => (
                    <div className="demo-list-row" key={expense.id}>
                        <span><strong>{expense.description}</strong><small>{expense.category}</small></span>
                        <span className="expense-row-amount">{formatAmount(expense.amount)}</span>
                        <button className="demo-remove" type="button" aria-label={`Remove ${expense.description}`} onClick={() => setExpenses((current) => current.filter((item) => item.id !== expense.id))}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function PortfolioDemo({ githubUrl, facebookUrl, emailAddress }) {
    return (
        <div className="demo-app portfolio-demo">
            <p className="demo-notice">This is my portfolio site—the live project you’re currently viewing.</p>
            <div className="portfolio-demo-card">
                <span className="eyebrow"><span className="eyebrow-dot" />IT STUDENT · ASPIRING WEB DEVELOPER</span>
                <h3>Bagoyboy Benjamin Jr.</h3>
                <p>I’m learning to build accessible, responsive web experiences with React.</p>
                <div className="portfolio-demo-links">
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook ↗</a>
                    <a href={`mailto:${emailAddress}`}>Email ↗</a>
                </div>
            </div>
        </div>
    );
}
