/// <reference lib="dom" />

/* ==========================================================
   Modern Interactive Quiz Application - TypeScript
   Compile with:  tsc app.ts   (creates app.js)

   Features:
   - 5 categories (HTML, CSS, JavaScript, TypeScript, Web Dev)
   - 10 advanced software-engineering questions per category
   - No repeated questions within a category until all are exhausted
   - Persistent average score across all quizzes (localStorage)
   - Category-specific quiz flow
   ========================================================== */

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface QuizCategory {
    name: string;
    icon: string;
    color: string;
    questions: QuizQuestion[];
}

interface QuizResult {
    category: string;
    score: number;
    total: number;
    percentage: number;
    date: string;
}

const QUESTIONS_PER_QUIZ = 5;
const STORAGE_KEY = "quiz-scores";

/* ----------------------------------------------------------
   Question bank: 10 advanced software-engineering questions per category
   ---------------------------------------------------------- */
const categories: QuizCategory[] = [
    {
        name: "HTML",
        icon: "🌐",
        color: "#fb923c",
        questions: [
            {
                question: "What is the purpose of the `loading=\"lazy\"` attribute on an `` element?",
                options: [
                    "Defers loading offscreen images until they are near the viewport",
                    "Makes the image load immediately before other content",
                    "Disables image loading entirely",
                    "Converts the image to a CSS background"
                ],
                correctAnswer: "Defers loading offscreen images until they are near the viewport"
            },
            {
                question: "Which HTML element best represents a self-contained composition that could be independently syndicated?",
                options: ["<section>", "<article>", "<aside>", "<div>"],
                correctAnswer: "<article>"
            },
            {
                question: "What does the `async` attribute on a `<script>` tag do?",
                options: [
                    "Executes the script as soon as it downloads, without blocking HTML parsing",
                    "Delays script execution until the page fully loads",
                    "Prevents the script from running",
                    "Runs the script only on mobile devices"
                ],
                correctAnswer: "Executes the script as soon as it downloads, without blocking HTML parsing"
            },
            {
                question: "Which ARIA attribute communicates whether a collapsible section is currently expanded?",
                options: ["aria-label", "aria-expanded", "aria-hidden", "aria-controls"],
                correctAnswer: "aria-expanded"
            },
            {
                question: "What is the correct DOCTYPE declaration for HTML5?",
                options: ["<!DOCTYPE html>", "<!DOCTYPE HTML PUBLIC...>", "<html5>", "<doctype html>"],
                correctAnswer: "<!DOCTYPE html>"
            },
            {
                question: "What does the `sandbox` attribute on an `<iframe>` restrict?",
                options: [
                    "Capabilities of the embedded content (scripts, forms, popups, etc.)",
                    "The iframe's width and height",
                    "The iframe's z-index stacking order",
                    "The iframe's CSS animations"
                ],
                correctAnswer: "Capabilities of the embedded content (scripts, forms, popups, etc.)"
            },
            {
                question: "Which HTML element defines a clickable image map with clickable regions?",
                options: ["<map>", "<area>", "<img>", "<svg>"],
                correctAnswer: "<map>"
            },
            {
                question: "What is the key semantic difference between `<section>` and `<div>`?",
                options: [
                    "`<section>` represents a thematic grouping of content; `<div>` is a generic container",
                    "`<section>` is invisible; `<div>` is visible",
                    "`<section>` only works in HTML5; `<div>` works in HTML4",
                    "There is no difference"
                ],
                correctAnswer: "`<section>` represents a thematic grouping of content; `<div>` is a generic container"
            },
            {
                question: "Which meta tag controls viewport scaling and layout on mobile devices?",
                options: [
                    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
                    "<meta name=\"keywords\" content=\"...\">",
                    "<meta name=\"author\" content=\"...\">",
                    "<meta http-equiv=\"refresh\">"
                ],
                correctAnswer: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
            },
            {
                question: "Which attribute specifies a regular expression that an `<input>` value must match?",
                options: ["pattern", "placeholder", "maxlength", "autocomplete"],
                correctAnswer: "pattern"
            }
        ]
    },
    {
        name: "CSS",
        icon: "🎨",
        color: "#a78bfa",
        questions: [
            {
                question: "What is CSS specificity?",
                options: [
                    "A weight assigned to CSS rules based on selector types that determines which rule wins",
                    "The speed at which CSS loads",
                    "The number of CSS files on a page",
                    "A browser feature that disables stylesheets"
                ],
                correctAnswer: "A weight assigned to CSS rules based on selector types that determines which rule wins"
            },
            {
                question: "Which of the following creates a new stacking context?",
                options: [
                    "An element with `opacity: 0.5` and `position: relative`",
                    "An element with `color: red`",
                    "An element with `font-size: 16px`",
                    "An element with `margin: 0`"
                ],
                correctAnswer: "An element with `opacity: 0.5` and `position: relative`"
            },
            {
                question: "What is the difference between `display: none` and `visibility: hidden`?",
                options: [
                    "`none` removes the element from layout; `hidden` keeps its space but makes it invisible",
                    "They are identical",
                    "`hidden` removes from layout; `none` keeps space",
                    "Only `none` works on print media"
                ],
                correctAnswer: "`none` removes the element from layout; `hidden` keeps its space but makes it invisible"
            },
            {
                question: "What does `flex: 1 1 auto` expand to?",
                options: [
                    "flex-grow: 1, flex-shrink: 1, flex-basis: auto",
                    "flex-grow: auto, flex-shrink: 1, flex-basis: 1",
                    "flex-grow: 1, flex-shrink: auto, flex-basis: 1",
                    "flex-grow: auto, flex-shrink: auto, flex-basis: auto"
                ],
                correctAnswer: "flex-grow: 1, flex-shrink: 1, flex-basis: auto"
            },
            {
                question: "Which CSS feature allows defining reusable named values throughout a stylesheet?",
                options: ["CSS custom properties (variables)", "!important", "@media", "::before"],
                correctAnswer: "CSS custom properties (variables)"
            },
            {
                question: "What is BEM methodology?",
                options: [
                    "A CSS class-naming convention: Block Element Modifier",
                    "A JavaScript build tool",
                    "An HTML5 doctype variant",
                    "A CSS reset library"
                ],
                correctAnswer: "A CSS class-naming convention: Block Element Modifier"
            },
            {
                question: "Which pseudo-class targets an element that is the only child of its parent?",
                options: [":only-child", ":first-child", ":last-child", ":nth-child(1)"],
                correctAnswer: ":only-child"
            },
            {
                question: "What does `grid-template-areas` define?",
                options: [
                    "Named grid areas that grid items can be placed into using `grid-area`",
                    "The background image of a grid container",
                    "The number of columns in a grid",
                    "The gap between grid rows"
                ],
                correctAnswer: "Named grid areas that grid items can be placed into using `grid-area`"
            },
            {
                question: "Which property controls whether flex items wrap onto multiple lines?",
                options: ["flex-wrap", "flex-flow", "flex-direction", "justify-content"],
                correctAnswer: "flex-wrap"
            },
            {
                question: "What is the initial value of the CSS `position` property?",
                options: ["static", "relative", "absolute", "fixed"],
                correctAnswer: "static"
            }
        ]
    },
    {
        name: "JavaScript",
        icon: "⚡",
        color: "#facc15",
        questions: [
            {
                question: "What is the JavaScript event loop?",
                options: [
                    "A mechanism that processes asynchronous callbacks from the task queue once the call stack is empty",
                    "A loop that iterates over array elements",
                    "A CSS animation timing function",
                    "An HTML form validation technique"
                ],
                correctAnswer: "A mechanism that processes asynchronous callbacks from the task queue once the call stack is empty"
            },
            {
                question: "What does `const` declare in JavaScript?",
                options: [
                    "A block-scoped binding that cannot be reassigned",
                    "A global variable",
                    "A function that runs once",
                    "A CSS custom property"
                ],
                correctAnswer: "A block-scoped binding that cannot be reassigned"
            },
            {
                question: "What is a closure?",
                options: [
                    "A function that retains access to its lexical scope even when executed outside that scope",
                    "A function that closes the browser tab",
                    "A CSS property that hides content",
                    "An HTML tag that closes itself"
                ],
                correctAnswer: "A function that retains access to its lexical scope even when executed outside that scope"
            },
            {
                question: "What does `typeof null` return?",
                options: ["\"object\"", "\"null\"", "\"undefined\"", "\"number\""],
                correctAnswer: "\"object\""
            },
            {
                question: "What does `Promise.all()` do?",
                options: [
                    "Waits for all promises to resolve, or rejects immediately if any reject",
                    "Resolves as soon as the first promise resolves",
                    "Runs promises sequentially one at a time",
                    "Cancels all pending promises"
                ],
                correctAnswer: "Waits for all promises to resolve, or rejects immediately if any reject"
            },
            {
                question: "What is event bubbling?",
                options: [
                    "An event propagates from the target element up through its ancestors",
                    "An event disappears after the first handler runs",
                    "An event only fires on the deepest element",
                    "An event is captured only at the window level"
                ],
                correctAnswer: "An event propagates from the target element up through its ancestors"
            },
            {
                question: "What is the difference between `==` and `===` in JavaScript?",
                options: [
                    "`==` performs type coercion before comparing; `===` compares without coercion",
                    "They are identical",
                    "`===` performs type coercion; `==` does not",
                    "`==` is faster than `===`"
                ],
                correctAnswer: "`==` performs type coercion before comparing; `===` compares without coercion"
            },
            {
                question: "In `const obj = { value: 1 }; obj.method = function() { return this.value; };`, what is `this` inside `method` when called as `obj.method()`?",
                options: ["obj", "window/globalThis", "undefined", "the function itself"],
                correctAnswer: "obj"
            },
            {
                question: "What does `Array.prototype.map()` return?",
                options: [
                    "A new array with the results of applying a function to each element",
                    "The same array mutated in place",
                    "A single reduced value",
                    "A boolean"
                ],
                correctAnswer: "A new array with the results of applying a function to each element"
            },
            {
                question: "What is hoisting in JavaScript?",
                options: [
                    "Variable and function declarations are moved to the top of their scope before execution",
                    "Elements float to the top of the page",
                    "CSS variables are loaded before HTML",
                    "A network preloading technique"
                ],
                correctAnswer: "Variable and function declarations are moved to the top of their scope before execution"
            }
        ]
    },
    {
        name: "TypeScript",
        icon: "📘",
        color: "#60a5fa",
        questions: [
            {
                question: "What is a TypeScript interface?",
                options: [
                    "A contract that describes the shape of an object",
                    "A CSS layout system",
                    "A JavaScript build command",
                    "An HTML form element"
                ],
                correctAnswer: "A contract that describes the shape of an object"
            },
            {
                question: "What is a generic type parameter?",
                options: [
                    "A placeholder type that makes functions and components reusable across different types",
                    "A fixed string type",
                    "A CSS variable",
                    "A HTML data attribute"
                ],
                correctAnswer: "A placeholder type that makes functions and components reusable across different types"
            },
            {
                question: "What does `Partial<T>` do?",
                options: [
                    "Makes all properties of type `T` optional",
                    "Makes all properties of type `T` required",
                    "Removes all properties from type `T`",
                    "Converts type `T` to a string"
                ],
                correctAnswer: "Makes all properties of type `T` optional"
            },
            {
                question: "What is a key difference between `interface` and `type` in TypeScript?",
                options: [
                    "`interface` supports declaration merging and `extends`; `type` can represent unions and primitives",
                    "They are identical in all respects",
                    "`type` supports declaration merging; `interface` does not",
                    "`interface` cannot be used for objects"
                ],
                correctAnswer: "`interface` supports declaration merging and `extends`; `type` can represent unions and primitives"
            },
            {
                question: "What does `keyof T` return?",
                options: [
                    "A union of the string literal keys of type `T`",
                    "The values of type `T`",
                    "The length of type `T`",
                    "A boolean indicating if `T` is an object"
                ],
                correctAnswer: "A union of the string literal keys of type `T`"
            },
            {
                question: "What is a discriminant (tagged) union?",
                options: [
                    "A union type where members share a common literal property used to narrow types",
                    "A union of only string types",
                    "A CSS feature for coloured borders",
                    "A JavaScript loop construct"
                ],
                correctAnswer: "A union type where members share a common literal property used to narrow types"
            },
            {
                question: "What does `Readonly<T>` do?",
                options: [
                    "Makes all properties of type `T` read-only",
                    "Makes type `T` immutable at runtime",
                    "Prevents type `T` from being exported",
                    "Converts type `T` to a constant"
                ],
                correctAnswer: "Makes all properties of type `T` read-only"
            },
            {
                question: "What are TypeScript decorators?",
                options: [
                    "Special declarations attached to classes, methods, properties, or parameters",
                    "CSS class names prefixed with `@`",
                    "HTML custom elements",
                    "JavaScript template literals"
                ],
                correctAnswer: "Special declarations attached to classes, methods, properties, or parameters"
            },
            {
                question: "What does the `never` type represent?",
                options: [
                    "A value that never occurs, used for exhaustive type checks",
                    "A variable that has not been initialized",
                    "An optional property",
                    "A CSS animation that never runs"
                ],
                correctAnswer: "A value that never occurs, used for exhaustive type checks"
            },
            {
                question: "What is type narrowing?",
                options: [
                    "Refining a broad type to a more specific type using type guards",
                    "Removing types from a union",
                    "Converting all types to strings",
                    "A build optimisation that removes unused code"
                ],
                correctAnswer: "Refining a broad type to a more specific type using type guards"
            }
        ]
    },
    {
        name: "Web Dev",
        icon: "🖥️",
        color: "#34d399",
        questions: [
            {
                question: "What does HTTP status code 429 indicate?",
                options: [
                    "Too Many Requests (rate limiting)",
                    "Not Found",
                    "Internal Server Error",
                    "Unauthorized"
                ],
                correctAnswer: "Too Many Requests (rate limiting)"
            },
            {
                question: "What is CORS?",
                options: [
                    "Cross-Origin Resource Sharing, a browser security mechanism that restricts cross-domain requests",
                    "A CSS layout technique",
                    "A JavaScript data structure",
                    "An HTML5 form attribute"
                ],
                correctAnswer: "Cross-Origin Resource Sharing, a browser security mechanism that restricts cross-domain requests"
            },
            {
                question: "What does DNS stand for?",
                options: ["Domain Name System", "Data Network Service", "Digital Name Server", "Domain Node System"],
                correctAnswer: "Domain Name System"
            },
            {
                question: "What is REST?",
                options: [
                    "Representational State Transfer, an architectural style for networked applications",
                    "A CSS framework",
                    "A JavaScript testing library",
                    "A database query language"
                ],
                correctAnswer: "Representational State Transfer, an architectural style for networked applications"
            },
            {
                question: "What does CI/CD stand for?",
                options: [
                    "Continuous Integration / Continuous Deployment",
                    "Customer Interface / Content Delivery",
                    "Code Inspection / Code Delivery",
                    "Cache Invalidation / Content Distribution"
                ],
                correctAnswer: "Continuous Integration / Continuous Deployment"
            },
            {
                question: "What is OAuth 2.0?",
                options: [
                    "An authorization framework enabling third-party applications to access user resources",
                    "An encryption algorithm",
                    "A CSS preprocessor",
                    "An HTML form validation method"
                ],
                correctAnswer: "An authorization framework enabling third-party applications to access user resources"
            },
            {
                question: "What is a CDN?",
                options: [
                    "Content Delivery Network, distributed servers that deliver content based on geographic proximity",
                    "A CSS grid system",
                    "A JavaScript bundler",
                    "A database index type"
                ],
                correctAnswer: "Content Delivery Network, distributed servers that deliver content based on geographic proximity"
            },
            {
                question: "What does JWT stand for?",
                options: ["JSON Web Token", "Java Web Tool", "Just Web Transfer", "JSON Web Tool"],
                correctAnswer: "JSON Web Token"
            },
            {
                question: "What is idempotency in API design?",
                options: [
                    "Making the same request multiple times produces the same result as making it once",
                    "API responses are always random",
                    "APIs require authentication on every call",
                    "APIs only support GET requests"
                ],
                correctAnswer: "Making the same request multiple times produces the same result as making it once"
            },
            {
                question: "What is the purpose of a reverse proxy?",
                options: [
                    "Forwards client requests to backend servers, providing load balancing, caching, and security",
                    "Converts HTML to PDF",
                    "Validates CSS syntax",
                    "Compresses images on the client"
                ],
                correctAnswer: "Forwards client requests to backend servers, providing load balancing, caching, and security"
            }
        ]
    },
    {
        name: "DevOps",
        icon: "🚀",
        color: "#10b981",
        questions: [
            {
                question: "What is the primary purpose of a multi-stage build in Docker?",
                options: [
                    "To reduce the final image size by copying only necessary artifacts from intermediate build stages",
                    "To run multiple containers simultaneously",
                    "To build images on multiple CPU architectures at once",
                    "To automatically deploy containers to the cloud"
                ],
                correctAnswer: "To reduce the final image size by copying only necessary artifacts from intermediate build stages"
            },
            {
                question: "What is Kubernetes' primary scheduling and deployment unit?",
                options: ["A Pod", "A Node", "A Service", "A Namespace"],
                correctAnswer: "A Pod"
            },
            {
                question: "What is a Helm chart?",
                options: [
                    "A package of pre-configured Kubernetes resources",
                    "A Docker image scanner",
                    "A CI/CD pipeline configuration",
                    "A cloud billing report"
                ],
                correctAnswer: "A package of pre-configured Kubernetes resources"
            },
            {
                question: "What is infrastructure as code (IaC)?",
                options: [
                    "Managing infrastructure through machine-readable definition files rather than manual processes",
                    "Writing CSS for infrastructure dashboards",
                    "A JavaScript framework for servers",
                    "An HTML templating language"
                ],
                correctAnswer: "Managing infrastructure through machine-readable definition files rather than manual processes"
            },
            {
                question: "What is the key difference between a container and a virtual machine?",
                options: [
                    "Containers share the host OS kernel; VMs virtualize hardware with a full guest OS",
                    "Containers are always slower than VMs",
                    "VMs cannot run Linux; containers can",
                    "There is no difference"
                ],
                correctAnswer: "Containers share the host OS kernel; VMs virtualize hardware with a full guest OS"
            },
            {
                question: "What is a canary deployment?",
                options: [
                    "Rolling a release to a small subset of users first, then expanding if healthy",
                    "Deploying to all users simultaneously",
                    "Deploying only on weekends",
                    "Testing only on the developer's machine"
                ],
                correctAnswer: "Rolling a release to a small subset of users first, then expanding if healthy"
            },
            {
                question: "What is a service mesh used for?",
                options: [
                    "Managing service-to-service communication, observability, and security",
                    "Rendering 3D graphics in the browser",
                    "Compressing database backups",
                    "Generating HTML forms"
                ],
                correctAnswer: "Managing service-to-service communication, observability, and security"
            },
            {
                question: "What is the purpose of a Kubernetes liveness probe?",
                options: [
                    "To determine if a container is running and should be restarted if unresponsive",
                    "To check the CPU usage of a node",
                    "To validate DNS resolution",
                    "To measure network latency between pods"
                ],
                correctAnswer: "To determine if a container is running and should be restarted if unresponsive"
            },
            {
                question: "What is GitOps?",
                options: [
                    "Using Git as the single source of truth for declarative infrastructure and applications",
                    "A Git branching strategy for hotfixes",
                    "A tool for merging pull requests",
                    "A GitHub authentication method"
                ],
                correctAnswer: "Using Git as the single source of truth for declarative infrastructure and applications"
            },
            {
                question: "What is a `.dockerignore` file used for?",
                options: [
                    "To exclude files and directories from the Docker build context",
                    "To ignore runtime errors in containers",
                    "To skip Docker image security scans",
                    "To disable Docker logging"
                ],
                correctAnswer: "To exclude files and directories from the Docker build context"
            }
        ]
    }
];

/* ----------------------------------------------------------
   State
   ---------------------------------------------------------- */
let currentQuestion: number = 0;
let score: number = 0;
let selectedAnswer: string | null = null;
let hasAnswered: boolean = false;
let activeCategory: QuizCategory | null = null;
let activeQuestions: QuizQuestion[] = [];

/* ----------------------------------------------------------
   DOM Elements
   ---------------------------------------------------------- */
const welcomeScreen: HTMLElement | null = document.getElementById("welcome-screen");
const quizScreen: HTMLElement | null = document.getElementById("quiz-screen");
const resultsScreen: HTMLElement | null = document.getElementById("results-screen");
const categoryBadgeElement: HTMLElement | null = document.getElementById("category-badge");
const progressText: HTMLElement | null = document.getElementById("progress-text");
const progressFill: HTMLElement | null = document.getElementById("progress-fill");
const scoreValue: HTMLElement | null = document.getElementById("score-value");
const questionTextElement: HTMLElement | null = document.getElementById("question-text");
const optionsContainer: HTMLElement | null = document.getElementById("options-container");
const feedbackElement: HTMLElement | null = document.getElementById("feedback");
const submitButton: HTMLButtonElement | null =
    document.getElementById("submit-btn") as HTMLButtonElement | null;
const nextButton: HTMLButtonElement | null =
    document.getElementById("next-btn") as HTMLButtonElement | null;
const startButton: HTMLButtonElement | null =
    document.getElementById("start-btn") as HTMLButtonElement | null;
const newQuizButton: HTMLButtonElement | null =
    document.getElementById("new-quiz-btn") as HTMLButtonElement | null;
const shareButton: HTMLButtonElement | null =
    document.getElementById("share-btn") as HTMLButtonElement | null;
const finalScoreElement: HTMLElement | null = document.getElementById("final-score");
const finalPercentageElement: HTMLElement | null = document.getElementById("final-percentage");
const resultMessageElement: HTMLElement | null = document.getElementById("result-message");
const averageValueElement: HTMLElement | null = document.getElementById("average-value");
const averageCountElement: HTMLElement | null = document.getElementById("average-count");
const resultsAverageValueElement: HTMLElement | null =
    document.getElementById("results-average-value");
const categoryItems: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>("[data-category]");

/* ----------------------------------------------------------
   Persistence helpers (localStorage)
   ---------------------------------------------------------- */
function getSeenQuestions(categoryName: string): Set<number> {
    const raw = localStorage.getItem(`quiz-seen-${categoryName}`);
    return raw ? new Set(JSON.parse(raw)) : new Set<number>();
}

function markQuestionsSeen(categoryName: string, indices: number[]): void {
    const seen = getSeenQuestions(categoryName);
    indices.forEach((i: number): void => {
        seen.add(i);
    });
    localStorage.setItem(`quiz-seen-${categoryName}`, JSON.stringify([...seen]));
}

function getQuizResults(): QuizResult[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveQuizResult(result: QuizResult): void {
    const results = getQuizResults();
    results.push(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

function getAverageScore(): { percentage: number; count: number } {
    const results = getQuizResults();
    if (results.length === 0) {
        return { percentage: 0, count: 0 };
    }
    const sum: number = results.reduce((acc: number, r: QuizResult): number => acc + r.percentage, 0);
    return { percentage: Math.round(sum / results.length), count: results.length };
}

function renderAverageScore(): void {
    const { percentage, count } = getAverageScore();
    if (averageValueElement) {
        averageValueElement.textContent = count === 0 ? "--%" : `${percentage}%`;
    }
    if (averageCountElement) {
        averageCountElement.textContent =
            count === 0 ? "No quizzes completed yet." : `${count} quiz${count === 1 ? "" : "s"} completed`;
    }
    if (resultsAverageValueElement) {
        resultsAverageValueElement.textContent = count === 0 ? "--%" : `${percentage}%`;
    }
}

/* ----------------------------------------------------------
   Helper functions
   ---------------------------------------------------------- */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled: T[] = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function showScreen(screen: "welcome" | "quiz" | "results"): void {
    if (welcomeScreen) {
        welcomeScreen.classList.toggle("hidden", screen !== "welcome");
        welcomeScreen.classList.toggle("active", screen === "welcome");
    }
    if (quizScreen) {
        quizScreen.classList.toggle("hidden", screen !== "quiz");
        quizScreen.classList.toggle("active", screen === "quiz");
    }
    if (resultsScreen) {
        resultsScreen.classList.toggle("hidden", screen !== "results");
        resultsScreen.classList.toggle("active", screen === "results");
    }
}

function updateScoreDisplay(): void {
    if (scoreValue) {
        scoreValue.textContent = String(score);
    }
}

function updateProgress(): void {
    const percent: number = ((currentQuestion + 1) / QUESTIONS_PER_QUIZ) * 100;
    if (progressText) {
        progressText.textContent = `Question ${String(currentQuestion + 1).padStart(2, "0")} / ${QUESTIONS_PER_QUIZ}`;
    }
    if (progressFill) {
        progressFill.style.width = `${percent}%`;
    }
}

function showFeedback(message: string, type: "correct" | "incorrect" | ""): void {
    if (!feedbackElement) {
        return;
    }
    feedbackElement.innerHTML = "";
    feedbackElement.className = "feedback";
    if (type !== "") {
        feedbackElement.classList.add(type);
    }
    if (message) {
        const line: HTMLParagraphElement = document.createElement("p");
        line.textContent = message;
        feedbackElement.appendChild(line);
    }
}

function setButtonEnabled(button: HTMLButtonElement | null, enabled: boolean): void {
    if (!button) {
        return;
    }
    button.disabled = !enabled;
    button.setAttribute("aria-disabled", String(!enabled));
}

function createOptionCard(optionText: string, optionIndex: number, letter: string): HTMLLabelElement {
    const inputId: string = `option-${optionIndex}`;

    const label: HTMLLabelElement = document.createElement("label");
    label.className = "option-card";
    label.htmlFor = inputId;

    const input: HTMLInputElement = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.id = inputId;
    input.value = optionText;

    input.addEventListener("change", (): void => {
        selectAnswer(optionText);
    });

    const letterSpan: HTMLSpanElement = document.createElement("span");
    letterSpan.className = "option-letter";
    letterSpan.textContent = letter;

    const textSpan: HTMLSpanElement = document.createElement("span");
    textSpan.className = "option-text";
    textSpan.textContent = optionText;

    const radioCircle: HTMLSpanElement = document.createElement("span");
    radioCircle.className = "radio-circle";

    label.appendChild(letterSpan);
    label.appendChild(textSpan);
    label.appendChild(radioCircle);
    label.appendChild(input);

    return label;
}

function selectCategoryQuestions(category: QuizCategory): QuizQuestion[] {
    const seen: Set<number> = getSeenQuestions(category.name);
    const unseen = category.questions
        .map((q, i) => ({ q, i }))
        .filter((item): boolean => !seen.has(item.i));

    // If every question has been seen, reset the seen set for this category.
    const pool = unseen.length > 0 ? unseen : category.questions.map((q, i) => ({ q, i }));

    const shuffled = shuffleArray(pool);
    const selected = shuffled.slice(0, QUESTIONS_PER_QUIZ);

    // Mark selected questions as seen so they won't repeat this category.
    markQuestionsSeen(category.name, selected.map((item): number => item.i));

    return selected.map((item): QuizQuestion => item.q);
}

/* ----------------------------------------------------------
   Quiz flow functions
   ---------------------------------------------------------- */
function startQuiz(category: QuizCategory): void {
    activeCategory = category;
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    hasAnswered = false;
    activeQuestions = selectCategoryQuestions(category);

    if (categoryBadgeElement) {
        categoryBadgeElement.textContent = `${category.name} Quiz`;
    }
    updateScoreDisplay();
    showScreen("quiz");
    displayQuestion(currentQuestion);
}

function displayQuestion(index: number): void {
    const current: QuizQuestion | undefined = activeQuestions[index];
    if (!current || !questionTextElement || !optionsContainer) {
        return;
    }

    selectedAnswer = null;
    hasAnswered = false;
    showFeedback("", "");
    setButtonEnabled(submitButton, false);
    setButtonEnabled(nextButton, false);

    updateProgress();
    questionTextElement.textContent = current.question;

    optionsContainer.innerHTML = "";
    const letters: string[] = ["A", "B", "C", "D"];
    for (let i = 0; i < current.options.length; i++) {
        const letter: string = letters[i] || String(i + 1);
        optionsContainer.appendChild(createOptionCard(current.options[i], i, letter));
    }
}

function selectAnswer(answer: string): void {
    if (hasAnswered) {
        return;
    }
    selectedAnswer = answer;
    setButtonEnabled(submitButton, true);
    refreshSelectedStyles();
    showFeedback("", "");
}

function refreshSelectedStyles(): void {
    if (!optionsContainer) {
        return;
    }
    const inputs: NodeListOf<HTMLInputElement> =
        optionsContainer.querySelectorAll("input[type='radio']");
    inputs.forEach((input: HTMLInputElement): void => {
        const card: HTMLElement | null = input.parentElement as HTMLElement | null;
        if (card) {
            card.classList.toggle("selected", input.checked);
        }
    });
}

function submitAnswer(): void {
    if (hasAnswered) {
        return;
    }
    if (selectedAnswer === null) {
        showFeedback("Please select an answer first.", "incorrect");
        return;
    }

    const current: QuizQuestion | undefined = activeQuestions[currentQuestion];
    if (!current) {
        return;
    }

    hasAnswered = true;
    const isCorrect: boolean = selectedAnswer === current.correctAnswer;

    if (isCorrect) {
        score++;
        updateScoreDisplay();
        showFeedback("Correct! 🎉", "correct");
    } else {
        showFeedback(`Not quite! The correct answer is "${current.correctAnswer}".`, "incorrect");
    }

    highlightOptions(current.correctAnswer);
    setButtonEnabled(submitButton, false);
    setButtonEnabled(nextButton, true);
}

function highlightOptions(correctAnswer: string): void {
    if (!optionsContainer) {
        return;
    }
    const inputs: NodeListOf<HTMLInputElement> =
        optionsContainer.querySelectorAll("input[type='radio']");
    inputs.forEach((input: HTMLInputElement): void => {
        const card: HTMLElement | null = input.parentElement as HTMLElement | null;
        if (!card) {
            return;
        }
        input.disabled = true;
        card.classList.add("disabled");
        if (input.value === correctAnswer) {
            card.classList.add("correct");
        } else if (input.checked) {
            card.classList.add("incorrect");
        }
    });
}

function nextQuestion(): void {
    if (!hasAnswered) {
        return;
    }
    currentQuestion++;
    if (currentQuestion >= QUESTIONS_PER_QUIZ) {
        showResults();
    } else {
        displayQuestion(currentQuestion);
    }
}

function showResults(): void {
    const percentage: number = Math.round((score / QUESTIONS_PER_QUIZ) * 100);
    const result: QuizResult = {
        category: activeCategory ? activeCategory.name : "Unknown",
        score,
        total: QUESTIONS_PER_QUIZ,
        percentage,
        date: new Date().toISOString()
    };
    saveQuizResult(result);

    const isFailed: boolean = percentage < 50;
    let message: string;
    if (isFailed) {
        message = `You scored ${score}/${QUESTIONS_PER_QUIZ}. Don't give up—keep practicing and try again!`;
    } else if (percentage >= 90) {
        message = "Excellent Work!";
    } else if (percentage >= 70) {
        message = "Great Job!";
    } else if (percentage >= 50) {
        message = "Good Effort!";
    } else {
        message = "Keep Learning!";
    }

    if (finalScoreElement) {
        finalScoreElement.textContent = String(score);
    }
    if (finalPercentageElement) {
        finalPercentageElement.textContent = `${percentage}%`;
    }
    if (resultMessageElement) {
        resultMessageElement.textContent = message;
    }

    // Show trophy only when not failing; otherwise hide it and show a negative heading.
    const trophyElement: HTMLElement | null = document.querySelector(".trophy");
    const resultsTitle: HTMLElement | null = document.getElementById("results-title");
    const resultTitleElement: HTMLElement | null = document.querySelector(".result-title");
    if (trophyElement) {
        trophyElement.classList.toggle("hidden", isFailed);
    }
    if (resultsTitle) {
        resultsTitle.textContent = isFailed ? "Quiz Result" : "Quiz Result";
    }
    if (resultTitleElement) {
        resultTitleElement.textContent = isFailed ? "Better Luck Next Time!" : "Congratulations!";
    }

    renderAverageScore();
    showScreen("results");
}

function restartQuiz(): void {
    if (activeCategory === null) {
        showScreen("welcome");
        return;
    }
    startQuiz(activeCategory);
}

/* ----------------------------------------------------------
   Event Listeners
   ---------------------------------------------------------- */
function setupEventListeners(): void {
    // Category cards on welcome screen
    categoryItems.forEach((item: HTMLElement): void => {
        item.addEventListener("click", (): void => {
            const name: string | null = item.getAttribute("data-category");
            if (!name) {
                return;
            }
            const category: QuizCategory | undefined = categories.find((c): boolean => c.name === name);
            if (category) {
                startQuiz(category);
            }
        });
    });

    if (startButton) {
        startButton.addEventListener("click", (): void => {
            // Default: start with the first category if no specific one chosen
            startQuiz(categories[0]);
        });
    }
    if (submitButton) {
        submitButton.addEventListener("click", (): void => {
            submitAnswer();
        });
    }
    if (nextButton) {
        nextButton.addEventListener("click", (): void => {
            nextQuestion();
        });
    }
    if (newQuizButton) {
        newQuizButton.addEventListener("click", (): void => {
            showScreen("welcome");
        });
    }
    if (shareButton) {
        shareButton.addEventListener("click", (): void => {
            const percentage: number = Math.round((score / QUESTIONS_PER_QUIZ) * 100);
            const text: string = `I scored ${score}/${QUESTIONS_PER_QUIZ} (${percentage}%) on the ${activeCategory?.name ?? "Web"} Quiz!`;
            if (navigator.share) {
                navigator.share({ title: "Quiz Result", text });
            } else {
                alert(`Quiz Result: ${text}`);
            }
        });
    }
}

/* ----------------------------------------------------------
   Startup
   ---------------------------------------------------------- */
function init(): void {
    setupEventListeners();
    renderAverageScore();
    showScreen("welcome");
}

init();
