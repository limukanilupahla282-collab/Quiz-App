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
declare const QUESTIONS_PER_QUIZ = 5;
declare const STORAGE_KEY = "quiz-scores";
declare const categories: QuizCategory[];
declare let currentQuestion: number;
declare let score: number;
declare let selectedAnswer: string | null;
declare let hasAnswered: boolean;
declare let activeCategory: QuizCategory | null;
declare let activeQuestions: QuizQuestion[];
declare const welcomeScreen: HTMLElement | null;
declare const quizScreen: HTMLElement | null;
declare const resultsScreen: HTMLElement | null;
declare const categoryBadgeElement: HTMLElement | null;
declare const progressText: HTMLElement | null;
declare const progressFill: HTMLElement | null;
declare const scoreValue: HTMLElement | null;
declare const questionTextElement: HTMLElement | null;
declare const optionsContainer: HTMLElement | null;
declare const feedbackElement: HTMLElement | null;
declare const submitButton: HTMLButtonElement | null;
declare const nextButton: HTMLButtonElement | null;
declare const startButton: HTMLButtonElement | null;
declare const newQuizButton: HTMLButtonElement | null;
declare const shareButton: HTMLButtonElement | null;
declare const finalScoreElement: HTMLElement | null;
declare const finalPercentageElement: HTMLElement | null;
declare const resultMessageElement: HTMLElement | null;
declare const averageValueElement: HTMLElement | null;
declare const averageCountElement: HTMLElement | null;
declare const resultsAverageValueElement: HTMLElement | null;
declare const categoryItems: NodeListOf<HTMLElement>;
declare function getSeenQuestions(categoryName: string): Set<number>;
declare function markQuestionsSeen(categoryName: string, indices: number[]): void;
declare function getQuizResults(): QuizResult[];
declare function saveQuizResult(result: QuizResult): void;
declare function getAverageScore(): {
    percentage: number;
    count: number;
};
declare function renderAverageScore(): void;
declare function shuffleArray<T>(array: T[]): T[];
declare function showScreen(screen: "welcome" | "quiz" | "results"): void;
declare function updateScoreDisplay(): void;
declare function updateProgress(): void;
declare function showFeedback(message: string, type: "correct" | "incorrect" | ""): void;
declare function setButtonEnabled(button: HTMLButtonElement | null, enabled: boolean): void;
declare function createOptionCard(optionText: string, optionIndex: number, letter: string): HTMLLabelElement;
declare function selectCategoryQuestions(category: QuizCategory): QuizQuestion[];
declare function startQuiz(category: QuizCategory): void;
declare function displayQuestion(index: number): void;
declare function selectAnswer(answer: string): void;
declare function refreshSelectedStyles(): void;
declare function submitAnswer(): void;
declare function highlightOptions(correctAnswer: string): void;
declare function nextQuestion(): void;
declare function showResults(): void;
declare function restartQuiz(): void;
declare function setupEventListeners(): void;
declare function init(): void;
