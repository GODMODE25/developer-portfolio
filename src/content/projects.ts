export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: "AI" | "Fintech" | "Systems" | "Crypto" | "Tools";
  complexity: number; // out of 10
  linesOfCode: number;
  stars?: number;
  whyItExists: string;
  architectureDetails: string[];
  techStack: string[];
  githubUrl: string;
  demoUrl?: string;
  mockCodePreview: string; // Used for interactive live terminal/code display on hover
  status: "active" | "completed" | "beta";
}

export const projectsData: Project[] = [
  {
    id: "student-performance-tracker",
    title: "Student Performance Tracker",
    subtitle: "Multi-role educational platform",
    category: "Systems",
    complexity: 8.5,
    linesOfCode: 5400,
    whyItExists: "Schools often rely on fragmented spreadsheets and messaging apps for student administration. I built this centralized platform to handle grading, attendance, parent-teacher communication, and analytics dashboards in one cohesive system.",
    architectureDetails: [
      "Flask backend serving a RESTful API",
      "PostgreSQL database handling relational data for Admins, Teachers, Students, and Parents",
      "Chart.js integration for dynamic visual analytics of student performance",
      "Deployed efficiently using Gunicorn"
    ],
    techStack: ["Python", "Flask", "PostgreSQL", "Chart.js", "Gunicorn"],
    githubUrl: "https://github.com/GODMODE25/StudentPerformanceTracker",
    status: "completed",
    mockCodePreview: `@app.route('/dashboard/analytics')
@login_required
def get_analytics():
    student_id = current_user.id
    grades = db.session.query(Grade).filter_by(student_id=student_id).all()
    attendance = calculate_attendance_rate(student_id)
    return jsonify({
        'performance_metrics': process_grades(grades),
        'attendance_rate': attendance
    })`
  },
  {
    id: "algo-trading-bots",
    title: "Quantitative Trading Bots",
    subtitle: "Algorithmic multi-strategy execution",
    category: "Crypto",
    complexity: 9.5,
    linesOfCode: 12500,
    whyItExists: "Manual trading cannot compete with the speed required in modern crypto and forex markets. I developed a suite of high-performance automated systems including cross-exchange scanners, triangular arbitrage bots, and pattern-recognition Expert Advisors.",
    architectureDetails: [
      "Built async market scanners using Python and CCXT library to query multiple exchanges simultaneously",
      "Developed Expert Advisors (EAs) in MQL4/5 with dynamic position sizing and Martingale logic",
      "Engineered multi-timeframe indicator confluence (RSI, EMA, ATR) for trade confirmation",
      "Implemented modular risk management and real-time trade alerting"
    ],
    techStack: ["Python", "CCXT", "MQL4 / MQL5", "Asyncio", "REST/WS APIs"],
    githubUrl: "https://github.com/GODMODE25/algorithmic-trading",
    status: "active",
    mockCodePreview: `async def scan_triangular_arbitrage(exchange_id, base, quote, intermediate):
    try:
        exchange = getattr(ccxt, exchange_id)({ 'enableRateLimit': True })
        tickers = await asyncio.gather(
            exchange.fetch_ticker(f'{base}/{quote}'),
            exchange.fetch_ticker(f'{intermediate}/{base}'),
            exchange.fetch_ticker(f'{intermediate}/{quote}')
        )
        profit = calculate_route_profit(tickers)
        if profit > MIN_THRESHOLD:
            await execute_atomic_route(exchange, tickers)
    except Exception as e:
        log_error(e)`
  },
  {
    id: "galactic-simulator",
    title: "2D/3D Galactic Orbit Simulator",
    subtitle: "Physics-based orbital vector engine",
    category: "Systems",
    complexity: 8.8,
    linesOfCode: 3200,
    whyItExists: "Simulating gravitational interactions between multiple celestial bodies requires precise calculations. I built this simulator to visualize planetary orbits and gravitational forces dynamically in both 2D and 3D coordinate frames.",
    architectureDetails: [
      "Custom physics engine integrating velocity and positional vectors",
      "Dynamic switching between 2D and 3D simulation states",
      "Optimized rendering pipeline to handle multiple celestial bodies smoothly",
      "Interactive UI controls for mass, velocity, and trajectory adjustments"
    ],
    techStack: ["Python", "Vector Math", "Physics Engine", "Simulation Design"],
    githubUrl: "https://github.com/GODMODE25/2D3D-sim-of-galactic-orbit-v2",
    status: "completed",
    mockCodePreview: `def calculate_gravitational_force(body1, body2):
    G = 6.67430e-11
    r_vec = body2.position - body1.position
    r_mag = np.linalg.norm(r_vec)
    
    if r_mag == 0:
        return np.zeros(3)
        
    force_mag = G * (body1.mass * body2.mass) / (r_mag ** 2)
    force_vec = force_mag * (r_vec / r_mag)
    return force_vec`
  },
  {
    id: "chess-club-app",
    title: "Chess Club Web App",
    subtitle: "Club management and records backend",
    category: "Systems",
    complexity: 7.2,
    linesOfCode: 2100,
    whyItExists: "Local chess clubs needed a lightweight, dedicated system to manage their members, track match records, and maintain leaderboards without relying on bloated enterprise software.",
    architectureDetails: [
      "Lightweight Flask backend system focused on speed and simplicity",
      "Relational database integration for robust match history and ELO tracking",
      "Clean, modular application logic enabling easy future feature expansions"
    ],
    techStack: ["Python", "Flask", "SQLite / SQL", "HTML/CSS"],
    githubUrl: "https://github.com/GODMODE25/CCE512-Chess-Website",
    status: "completed",
    mockCodePreview: `@app.route('/api/match/record', methods=['POST'])
def record_match():
    data = request.json
    player_white = User.query.get(data['white_id'])
    player_black = User.query.get(data['black_id'])
    
    new_elo_w, new_elo_b = calculate_elo(
        player_white.elo, 
        player_black.elo, 
        data['result']
    )
    
    update_player_stats(player_white, new_elo_w)
    update_player_stats(player_black, new_elo_b)
    db.session.commit()
    return jsonify({"status": "success"})`
  },
  {
    id: "memory-trainer",
    title: "Memory Trainer & Calculators",
    subtitle: "Desktop productivity utilities",
    category: "Tools",
    complexity: 6.8,
    linesOfCode: 4500,
    whyItExists: "To improve my own cognitive recall and financial planning, I built a suite of native desktop applications rather than relying on web-based tools that required constant internet access.",
    architectureDetails: [
      "Native desktop GUI built using Python's Tkinter library",
      "Packaged into standalone executables using PyInstaller for easy distribution",
      "Includes financial calculators (DCA, compound interest) and a digit-memorization trainer"
    ],
    techStack: ["Python", "Tkinter", "PyInstaller", "Desktop UI"],
    githubUrl: "https://github.com/GODMODE25/memory_trainer",
    status: "completed",
    mockCodePreview: `class MemoryTrainerApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Digit Memory Trainer")
        self.sequence = generate_random_sequence(length=5)
        
        self.display_label = tk.Label(self, text=self.sequence, font=("Helvetica", 24))
        self.display_label.pack(pady=20)
        
        self.after(3000, self.hide_sequence_and_prompt)
        
    def hide_sequence_and_prompt(self):
        self.display_label.config(text="***")
        self.input_field = tk.Entry(self)
        self.input_field.pack()`
  },
  {
    id: "oe-chess-lab",
    title: "OE Chess Lab",
    subtitle: "Interactive chess study and curriculum engine",
    category: "AI",
    complexity: 9.2,
    linesOfCode: 5200,
    whyItExists: "Standard chess platforms focus on raw gameplay or generic puzzles, leaving structured opening and endgame study fragmented. I built OE Chess Lab to provide a dedicated tool for move-by-move practice, spaced-repetition reviews, and Stockfish analysis integrated in a premium dashboard.",
    architectureDetails: [
      "Next.js 16 App Router interface styled with Tailwind CSS v4 and glassmorphism",
      "Firebase backend integrating client-side authentication, user preferences, and real-time study stats",
      "WASM-based Stockfish Chess Engine running asynchronously on a Web Worker off the main thread",
      "Modular, schema-validated JSON curriculum database (openings, concepts, traps) verified by automated tests"
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "chess.js", "Stockfish WASM", "Vitest"],
    githubUrl: "https://github.com/GODMODE25/lotus-chess-clone",
    status: "completed",
    mockCodePreview: `export function OpeningTrainer({ lesson }: OpeningTrainerProps) {
  const [currentPly, setCurrentPly] = useState(0);
  const [feedback, setFeedback] = useState({ tone: "idle", detail: lesson.overview });
  
  const expectedSan = lesson.movesSan[currentPly] ?? null;
  const isFinished = currentPly >= lesson.movesSan.length;

  const handleUserMove = (move) => {
    if (move.san === expectedSan) {
      setCurrentPly(prev => prev + 1);
      setFeedback({ tone: "success", detail: "Correct move!" });
    } else {
      setFeedback({ tone: "error", detail: "Incorrect. Try again." });
    }
  };`
  }
];
