export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  difficulty: "easy" | "moderate" | "hard";
  domain: "aptitude" | "quantum-web" | "neural-native" | "sovereign-backend" | "ai-ml";
}

export const QUESTION_POOL: Question[] = [
  // --- APTITUDE (3 Easy, 2 Moderate) ---
  {
    id: "apt-1",
    question: "If a train travels at 60 km/h, how far will it travel in 15 minutes?",
    options: ["10 km", "15 km", "20 km", "12 km"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "aptitude"
  },
  {
    id: "apt-2",
    question: "Find the missing number in the series: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "26"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "aptitude"
  },
  {
    id: "apt-3",
    question: "A product is sold for $120 with a 20% profit. What was the cost price?",
    options: ["$96", "$100", "$105", "$110"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "aptitude"
  },
  {
    id: "apt-4",
    question: "Five years ago, the average age of A and B was 15 years. With C joining them now, the average becomes 25. What is C's current age?",
    options: ["30", "35", "40", "45"],
    correctAnswer: 1,
    difficulty: "moderate",
    domain: "aptitude"
  },
  {
    id: "apt-5",
    question: "A boat goes 12 km/h in still water. The stream's speed is 3 km/h. How long does it take to go 45 km downstream?",
    options: ["3 hours", "4 hours", "3.75 hours", "5 hours"],
    correctAnswer: 0,
    difficulty: "moderate",
    domain: "aptitude"
  },

  // --- QUANTUM WEB (Next.js / Frontend) ---
  {
    id: "web-1",
    question: "Which Next.js feature allows for pre-rendering pages at build time using data?",
    options: ["Static Site Generation (SSG)", "Server-side Rendering (SSR)", "Incremental Static Regeneration (ISR)", "Dynamic Routing"],
    correctAnswer: 0,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-2",
    question: "What is the primary purpose of the 'use client' directive in Next.js 13+?",
    options: ["To enable server-side only logic", "To demarcate a client-side boundary for interactive components", "To speed up build times", "To enable Edge functions"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-3",
    question: "In React, what does 'Lifting State Up' refer to?",
    options: ["Moving state to a higher database layer", "Moving state to a common parent component to share between children", "Optimizing state with useMemo", "Moving state to a global context only"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-4",
    question: "What is the role of 'getStaticPaths' in dynamic routing?",
    options: ["To fetch data for a single page", "To define a list of paths that should be pre-rendered at build time", "To redirect users to a 404 page", "To handle client-side routing"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-5",
    question: "Which hook is used to handle side effects in a functional component?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-6",
    question: "What does the 'key' prop help React do during list rendering?",
    options: ["Style the elements", "Identify which items have changed, been added, or removed", "Bind event handlers", "Set the initial state"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-7",
    question: "In Tailwind CSS, how do you apply a style only on medium screens and larger?",
    options: ["screen-md:", "at-md:", "md:", "tablet:"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-8",
    question: "What is the default behavior of 'display: flex' for flex items?",
    options: ["They stack vertically", "They stack horizontally", "They absolute position", "They take up full width"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-9",
    question: "Which property is used to change the text color of an element in CSS?",
    options: ["font-color", "text-style", "color", "background-color"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-10",
    question: "What is the purpose of the 'alt' attribute in an 'img' tag?",
    options: ["To provide a link to the image", "To provide alternative text for accessibility and SEO", "To set the image dimensions", "To filter the image"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-11",
    question: "Which of the following is NOT a valid React Hook?",
    options: ["useHistory", "useFetch", "useWindow", "useInterface"],
    correctAnswer: 3,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-12",
    question: "How do you pass data from a parent component to a child component?",
    options: ["Via state", "Via props", "Via context only", "Via ref"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-13",
    question: "What does DOM stand for?",
    options: ["Data Object Model", "Document Object Model", "Digital Object Matrix", "Document Oriented Model"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-14",
    question: "Which CSS property controls the inner space of an element?",
    options: ["margin", "border", "padding", "spacing"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "quantum-web"
  },
  {
    id: "web-15",
    question: "In Next.js, where should you place global CSS files?",
    options: ["Inside the public folder", "In any component file", "In _app.js or the root layout file", "In a lib folder"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "quantum-web"
  },

  // --- SOVEREIGN BACKEND (Node.js / Cloud) ---
  {
    id: "be-1",
    question: "Which Node.js module is used for handling file paths across different operating systems?",
    options: ["fs", "os", "path", "url"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-2",
    question: "What is the result of '2' + 2 - 1 in JavaScript?",
    options: ["21", "22", "3", "Error"],
    correctAnswer: 0,
    difficulty: "moderate",
    domain: "sovereign-backend"
  },
  {
    id: "be-3",
    question: "What is the primary difference between SQL and NoSQL databases?",
    options: ["SQL is faster", "SQL is relational, NoSQL is non-relational", "NoSQL doesn't use disks", "SQL is only for web apps"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-4",
    question: "In Node.js, what is 'process.env' used for?",
    options: ["To store temporary data", "To access environment variables", "To manage system processes", "To encrypt user data"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-5",
    question: "Which HTTP status code represents 'Internal Server Error'?",
    options: ["404", "403", "500", "503"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-6",
    question: "What is Middleware in the context of Express.js?",
    options: ["A database driver", "Functions that have access to request and response objects", "A routing library", "Frontend template engine"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-7",
    question: "Which method is used to create a new record in a typical REST API?",
    options: ["GET", "PUT", "POST", "DELETE"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-8",
    question: "What does the 'npm' command stand for?",
    options: ["Node Package Manager", "New Project Model", "Node Protocol Map", "Never Play Mobile"],
    correctAnswer: 0,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-9",
    question: "Which concept explains why Node.js can handle many concurrent connections with a single thread?",
    options: ["Multi-threading", "The Event Loop", "Synchronous blocking", "Parallel computing"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-10",
    question: "What is the purpose of JWT (JSON Web Token)?",
    options: ["To store user profile pictures", "Securely transmitting information between parties as a JSON object", "To speed up database queries", "To compress video files"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-11",
    question: "Which database command is used to retrieve data?",
    options: ["UPDATE", "DELETE", "SELECT", "INSERT"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-12",
    question: "What is a 'Primary Key' in a database?",
    options: ["The password to the database", "A unique identifier for a record in a table", "The largest column in a table", "A common link between two databases"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-13",
    question: "In Git, which command saves changes locally?",
    options: ["push", "pull", "commit", "fetch"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-14",
    question: "Which port is standard for HTTP?",
    options: ["443", "22", "80", "3000"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "sovereign-backend"
  },
  {
    id: "be-15",
    question: "What is the role of an 'index' in a database?",
    options: ["To store more data", "To speed up data retrieval operations", "To delete old data", "To count the number of columns"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "sovereign-backend"
  },

  // --- NEURAL NATIVE (App Dev / AI) ---
  {
    id: "native-1",
    question: "Which React Native component is optimal for rendering large lists of items efficiently?",
    options: ["ScrollView", "ListView", "FlatList", "ViewSection"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-2",
    question: "What is the primary language used to develop React Native apps?",
    options: ["Swift", "Kotlin", "JavaScript/TypeScript", "Python"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-3",
    question: "In React Native, how do you handle different screen orientations?",
    options: ["Using only fixed pixel values", "Using Flexbox and percentage widths", "It is not possible", "By creating two separate apps"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-4",
    question: "Which component is used for navigating between different screens in React Native?",
    options: ["Navigator", "Router", "React Navigation Stack", "Link"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-5",
    question: "What is the purpose of the 'View' component in React Native?",
    options: ["To display text only", "A container for other components (like div in HTML)", "To play videos", "To create a button"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-6",
    question: "How do you styles components in React Native?",
    options: ["Using external CSS files", "Using StyleSheet.create() and inline styles", "Using SCSS", "Using HTML tags"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-7",
    question: "What is the 'Bridge' in React Native?",
    options: ["A tool to connect to Wi-Fi", "The communication layer between JS and Native code", "A component for animations", "A design pattern"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-8",
    question: "Which command starts the React Native development server?",
    options: ["npm start", "react-native run-ios", "expo start", "Any of the above (depending on setup)"],
    correctAnswer: 3,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-9",
    question: "What is 'Fast Refresh' in React Native development?",
    options: ["A way to clear cache", "Instant feedback for code changes without losing component state", "A battery saving mode", "A database optimization"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-10",
    question: "Which component is used to display interactive images in React Native?",
    options: ["ImageBox", "Photo", "Image", "Pic"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-11",
    question: "In React Native, how do you add padding to an element?",
    options: ["Using the 'padding' style property", "Using an external CSS library", "React Native doesn't support padding", "By adding more View components"],
    correctAnswer: 0,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-12",
    question: "What is 'Expo' in the context of React Native?",
    options: ["A performance monitoring tool", "A framework and platform for universal React applications", "A graphics library", "A native module for iOS only"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-13",
    question: "Which component should be used to accept user text input?",
    options: ["InputBox", "TextInput", "TypeArea", "FormField"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-14",
    question: "What is the purpose of 'AsyncStorage' in React Native?",
    options: ["To store data in a cloud database", "To store data locally on the device asynchronously", "To speed up the app", "To manage complex state"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "native-15",
    question: "Which hook is used to get the screen dimensions in React Native?",
    options: ["useScreen", "useDimensions", "useWindowDimensions", "useLayout"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "neural-native"
  },
  {
    id: "ai-1",
    question: "In Large Language Models (LLMs), what does 'Temperature' primarily control?",
    options: ["The speed of generation", "The randomness/creativity of the output", "The context window size", "The cost of the API call"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-2",
    question: "What does NLP stand for in AI?",
    options: ["Neural Logic Programming", "Natural Language Processing", "Node Level Protocol", "Non-Linear Patterns"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-3",
    question: "Which of these is a popular architecture used for modern LLMs like GPT?",
    options: ["ResNet", "Transformer", "RNN", "Decision Tree"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-4",
    question: "What is 'Prompt Engineering'?",
    options: ["Developing faster processors", "Optimizing inputs to AI models to get better outputs", "Building better databases", "Designing website layouts"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-5",
    question: "In machine learning, what is 'Overfitting'?",
    options: ["When a model is too small", "When a model learns training data too well, failing to generalize to new data", "When a model is too fast", "When a model uses too much RAM"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-6",
    question: "Which company developed the Gemini AI model?",
    options: ["OpenAI", "Meta", "Google", "Microsoft"],
    correctAnswer: 2,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-7",
    question: "What is 'Tokenization'?",
    options: ["Compressing images", "Breaking text down into smaller units like words or characters for AI to process", "Generating crypto tokens", "Authenticating users"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-8",
    question: "What is the primary role of a 'Loss Function'?",
    options: ["To delete bad data", "To measure how far a model's prediction is from the target", "To slow down training", "To increase image resolution"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-9",
    question: "Which of these is a type of Machine Learning?",
    options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Atmospheric Learning"],
    correctAnswer: 3,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-10",
    question: "In neural networks, what is an 'Activation Function'?",
    options: ["A way to turn off the computer", "A mathematical function that determines the output of a node", "A style property", "A database query"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-11",
    question: "What is 'Fine-tuning' in LLMs?",
    options: ["Adjusting the volume of AI outputs", "Taking a pre-trained model and training it further on a specific dataset", "Increasing the clock speed of a GPU", "Deleting old AI logs"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-12",
    question: "What does 'Hallucination' refer to in AI context?",
    options: ["The AI needing a break", "A confident response by an AI that does not match its training data", "A type of visual filter", "A security breach"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-13",
    question: "Which hardware component is most essential for training large AI models?",
    options: ["CPU", "GPU", "HDD", "Sound Card"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-14",
    question: "What is 'RAG' (Retrieval-Augmented Generation)?",
    options: ["A type of image compression", "Enhancing LLM responses with external, retrieved information", "A deep learning framework", "A competitive gaming mode"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  },
  {
    id: "ai-15",
    question: "What is the 'Context Window' of an LLM?",
    options: ["The browser window size", "The maximum amount of text the model can 'see' or process at once", "A type of UI button", "The training duration"],
    correctAnswer: 1,
    difficulty: "easy",
    domain: "ai-ml"
  }
];
