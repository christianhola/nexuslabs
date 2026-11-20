/*
  Seed data: the playable challenges, the question library, sample candidates
  and the developer leaderboard. Copy for the pages lives in content.ts.
  The Worker imports PROBLEM_IDS from here so both sides agree on what exists.
*/

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type TestCase = { id: string; label: string; args: unknown[]; expected: unknown; hidden?: boolean }

export type Problem = {
  id: string
  title: string
  difficulty: Difficulty
  skill: string
  minutes: number
  fn: string
  summary: string
  statement: string[]
  examples: { input: string; output: string; note?: string }[]
  constraints: string[]
  starter: string
  /** A passing solution, used for the sample reports' code playback. */
  solution: string
  tests: TestCase[]
  hints: string[]
}

export const PROBLEMS: Problem[] = [
  {
    id: 'merge-windows',
    title: 'Merge booking windows',
    difficulty: 'Easy',
    skill: 'Arrays and sorting',
    minutes: 25,
    fn: 'mergeWindows',
    summary: 'Collapse overlapping calendar bookings into the fewest windows.',
    statement: [
      'A room-booking service stores each booking as a pair [start, end] in minutes since midnight. Bookings arrive in any order and some overlap.',
      'Write mergeWindows(windows) that returns the merged list: overlapping or touching windows become one, and the result is sorted by start.',
    ],
    examples: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', output: '[[1,5]]', note: 'Windows that touch are merged.' },
    ],
    constraints: ['0 ≤ windows.length ≤ 10⁴', 'start ≤ end for every window', 'Do not mutate the input if you can help it'],
    starter: `/**
 * Merge overlapping booking windows.
 * @param {number[][]} windows pairs of [start, end]
 * @returns {number[][]} merged windows, sorted by start
 */
function mergeWindows(windows) {
  // Your code here
  return windows;
}
`,
    solution: `/**
 * Merge overlapping booking windows.
 * @param {number[][]} windows pairs of [start, end]
 * @returns {number[][]} merged windows, sorted by start
 */
function mergeWindows(windows) {
  const sorted = [...windows].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [start, end] of sorted) {
    const last = out[out.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      out.push([start, end]);
    }
  }
  return out;
}
`,
    tests: [
      { id: 't1', label: 'Overlapping pairs', args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { id: 't2', label: 'Touching windows', args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { id: 't3', label: 'Empty input', args: [[]], expected: [] },
      { id: 't4', label: 'Unsorted input', args: [[[5, 7], [1, 2]]], expected: [[1, 2], [5, 7]] },
      { id: 'h1', label: 'Window contains others', args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]], hidden: true },
      { id: 'h2', label: 'Zero-length window', args: [[[3, 3]]], expected: [[3, 3]], hidden: true },
    ],
    hints: [
      'Sort by start time first. After that, a window can only overlap the one you merged just before it.',
      'Keep the last merged window and extend its end with Math.max when the next start is not after it.',
      'Sorting costs O(n log n); the single pass afterwards is O(n). That is the best you can do here.',
    ],
  },
  {
    id: 'rate-limiter',
    title: 'Sliding-window rate limiter',
    difficulty: 'Medium',
    skill: 'Queues and time windows',
    minutes: 35,
    fn: 'rateLimit',
    summary: 'Decide which API requests to allow inside a rolling time window.',
    statement: [
      'An API gateway allows at most limit requests in any rolling window of windowMs milliseconds. Requests that are refused do not count toward the limit.',
      'Write rateLimit(timestamps, limit, windowMs). timestamps is sorted ascending; return an array of booleans saying whether each request is allowed. A request at time t counts the allowed requests in (t − windowMs, t].',
    ],
    examples: [
      { input: '[0, 100, 200, 300], 3, 1000', output: '[true, true, true, false]' },
      { input: '[0, 500, 1000, 1500], 2, 1000', output: '[true, true, true, true]', note: 'At 1500 the request at 500 has left the window.' },
    ],
    constraints: ['0 ≤ timestamps.length ≤ 10⁵', '1 ≤ limit ≤ 10³', 'Aim for O(n) overall'],
    starter: `/**
 * @param {number[]} timestamps sorted request times in ms
 * @param {number} limit max allowed requests per window
 * @param {number} windowMs window length in ms
 * @returns {boolean[]} whether each request is allowed
 */
function rateLimit(timestamps, limit, windowMs) {
  // Your code here
  return timestamps.map(() => true);
}
`,
    solution: `/**
 * @param {number[]} timestamps sorted request times in ms
 * @param {number} limit max allowed requests per window
 * @param {number} windowMs window length in ms
 * @returns {boolean[]} whether each request is allowed
 */
function rateLimit(timestamps, limit, windowMs) {
  const allowed = [];
  let head = 0;
  return timestamps.map((t) => {
    while (head < allowed.length && allowed[head] <= t - windowMs) head++;
    if (allowed.length - head < limit) {
      allowed.push(t);
      return true;
    }
    return false;
  });
}
`,
    tests: [
      { id: 't1', label: 'Fills the window', args: [[0, 100, 200, 300], 3, 1000], expected: [true, true, true, false] },
      { id: 't2', label: 'Window slides', args: [[0, 500, 1000, 1500], 2, 1000], expected: [true, true, true, true] },
      { id: 't3', label: 'No requests', args: [[], 5, 1000], expected: [] },
      { id: 't4', label: 'Same timestamp', args: [[10, 10, 10], 1, 50], expected: [true, false, false] },
      { id: 'h1', label: 'Window boundary', args: [[0, 999, 1000, 1001], 2, 1000], expected: [true, true, true, false], hidden: true },
      { id: 'h2', label: 'Refused requests do not count', args: [[0, 1, 2, 1000, 1001], 2, 1000], expected: [true, true, false, true, true], hidden: true },
    ],
    hints: [
      'Only allowed requests matter, so keep a list of the times you allowed.',
      'Because timestamps are sorted, the oldest allowed request is always the first to leave the window. A moving head index acts as a queue without shifting the array.',
      'Every allowed timestamp enters and leaves the queue once, so the whole pass is O(n).',
    ],
  },
  {
    id: 'top-words',
    title: 'Most frequent words',
    difficulty: 'Easy',
    skill: 'Hash maps',
    minutes: 20,
    fn: 'topWords',
    summary: 'Rank the words in a support ticket by how often they appear.',
    statement: [
      'Support tickets are tagged by their most common words. Write topWords(text, k) that returns the k most frequent words.',
      'Words are runs of letters, compared case-insensitively and returned in lower case. Break ties alphabetically.',
    ],
    examples: [
      { input: '"the cat and the hat and the bat", 2', output: '["the", "and"]' },
      { input: '"Go go GO stop", 1', output: '["go"]' },
    ],
    constraints: ['0 ≤ text.length ≤ 10⁵', '1 ≤ k ≤ 100', 'Return fewer than k words if there are fewer'],
    starter: `/**
 * @param {string} text
 * @param {number} k
 * @returns {string[]} the k most frequent words
 */
function topWords(text, k) {
  // Your code here
  return [];
}
`,
    solution: `/**
 * @param {string} text
 * @param {number} k
 * @returns {string[]} the k most frequent words
 */
function topWords(text, k) {
  const counts = new Map();
  for (const word of text.toLowerCase().match(/[a-z]+/g) ?? []) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, k)
    .map(([word]) => word);
}
`,
    tests: [
      { id: 't1', label: 'Basic ranking', args: ['the cat and the hat and the bat', 2], expected: ['the', 'and'] },
      { id: 't2', label: 'Ties sort alphabetically', args: ['b a c a b a', 3], expected: ['a', 'b', 'c'] },
      { id: 't3', label: 'Mixed case', args: ['Go go GO stop', 1], expected: ['go'] },
      { id: 'h1', label: 'Empty text', args: ['', 3], expected: [], hidden: true },
      { id: 'h2', label: 'Fewer words than k', args: ['x y z', 5], expected: ['x', 'y', 'z'], hidden: true },
      { id: 'h3', label: 'Punctuation', args: ["Wait, wait... it's fine!", 2], expected: ['wait', 'fine'], hidden: true },
    ],
    hints: [
      'Lower-case the text, then pull words out with a regular expression such as /[a-z]+/g.',
      'Count with a Map, then sort entries by count descending and by word ascending for ties.',
      'Sorting all distinct words is O(u log u). A heap of size k gets you O(u log k) if the interviewer asks.',
    ],
  },
]

export const PROBLEM_IDS = PROBLEMS.map((p) => p.id)

export const getProblem = (id: string | null | undefined) => PROBLEMS.find((p) => p.id === id) ?? PROBLEMS[0]

/* Question library. `problemId` marks the ones you can try in the demo. */
export type QuestionType = 'Coding' | 'Debugging' | 'Code review' | 'System design' | 'AI-assisted' | 'Multiple choice'
export type Question = {
  id: string
  title: string
  type: QuestionType
  skill: string
  difficulty: Difficulty
  minutes: number
  languages: string[]
  usedBy: number
  summary: string
  problemId?: string
}

export const QUESTION_TYPES: QuestionType[] = ['Coding', 'Debugging', 'Code review', 'System design', 'AI-assisted', 'Multiple choice']
export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']

export const QUESTIONS: Question[] = [
  { id: 'q-merge', title: 'Merge booking windows', type: 'Coding', skill: 'Arrays and sorting', difficulty: 'Easy', minutes: 25, languages: ['JavaScript', 'Python', 'Java', 'Go'], usedBy: 1840, summary: 'Merge overlapping intervals and explain the complexity.', problemId: 'merge-windows' },
  { id: 'q-rate', title: 'Sliding-window rate limiter', type: 'Coding', skill: 'Queues and time windows', difficulty: 'Medium', minutes: 35, languages: ['JavaScript', 'Python', 'Go', 'Rust'], usedBy: 1312, summary: 'Allow or refuse requests inside a rolling window in linear time.', problemId: 'rate-limiter' },
  { id: 'q-words', title: 'Most frequent words', type: 'Coding', skill: 'Hash maps', difficulty: 'Easy', minutes: 20, languages: ['JavaScript', 'Python', 'Ruby'], usedBy: 2210, summary: 'Count and rank words with deterministic tie-breaking.', problemId: 'top-words' },
  { id: 'q-cache', title: 'Fix the leaking LRU cache', type: 'Debugging', skill: 'Data structures', difficulty: 'Medium', minutes: 30, languages: ['TypeScript', 'Java'], usedBy: 964, summary: 'A cache passes its tests but grows without bound in production. Find out why.' },
  { id: 'q-pr', title: 'Review a payments pull request', type: 'Code review', skill: 'Code quality', difficulty: 'Medium', minutes: 25, languages: ['TypeScript'], usedBy: 731, summary: 'Leave review comments on a 200-line diff with two real bugs and a race.' },
  { id: 'q-feed', title: 'Design a news feed', type: 'System design', skill: 'Distributed systems', difficulty: 'Hard', minutes: 45, languages: ['Any'], usedBy: 1105, summary: 'Fan-out on write or read, ranking, caching and a back-of-envelope estimate.' },
  { id: 'q-agent', title: 'Ship a CSV importer with an AI assistant', type: 'AI-assisted', skill: 'Working with AI', difficulty: 'Medium', minutes: 40, languages: ['TypeScript', 'Python'], usedBy: 688, summary: 'Use the built-in assistant to build and test an importer; we score the prompts and the review of its output.' },
  { id: 'q-sql', title: 'Monthly active accounts in SQL', type: 'Coding', skill: 'SQL', difficulty: 'Easy', minutes: 20, languages: ['PostgreSQL', 'MySQL'], usedBy: 1520, summary: 'Window functions over an events table with late-arriving rows.' },
  { id: 'q-react', title: 'Accessible combobox in React', type: 'Coding', skill: 'Front end', difficulty: 'Hard', minutes: 50, languages: ['TypeScript'], usedBy: 590, summary: 'Build a searchable select with full keyboard support and ARIA roles.' },
  { id: 'q-flaky', title: 'Stabilise a flaky test suite', type: 'Debugging', skill: 'Testing', difficulty: 'Medium', minutes: 35, languages: ['JavaScript', 'Python'], usedBy: 642, summary: 'Three tests fail one run in ten. Find the shared state and the clock.' },
  { id: 'q-big-o', title: 'Complexity fundamentals', type: 'Multiple choice', skill: 'Algorithms', difficulty: 'Easy', minutes: 10, languages: ['Any'], usedBy: 2860, summary: 'Eight questions on time and space complexity with short code snippets.' },
  { id: 'q-k8s', title: 'Roll back a bad deploy', type: 'Debugging', skill: 'DevOps', difficulty: 'Hard', minutes: 40, languages: ['Bash', 'YAML'], usedBy: 402, summary: 'A canary is failing health checks. Read the logs, find the config drift, recover.' },
  { id: 'q-graph', title: 'Shortest delivery route', type: 'Coding', skill: 'Graphs', difficulty: 'Hard', minutes: 45, languages: ['JavaScript', 'Python', 'Java', 'C++'], usedBy: 877, summary: 'Dijkstra with time windows on a small city map.' },
  { id: 'q-api', title: 'Design a webhook delivery service', type: 'System design', skill: 'APIs', difficulty: 'Medium', minutes: 40, languages: ['Any'], usedBy: 533, summary: 'Retries, idempotency, signing and what happens when a receiver is down for a day.' },
  { id: 'q-prompt', title: 'Review an AI-written migration', type: 'AI-assisted', skill: 'Working with AI', difficulty: 'Hard', minutes: 30, languages: ['SQL', 'TypeScript'], usedBy: 371, summary: 'An assistant wrote a schema migration. Decide what to keep, fix and refuse.' },
  { id: 'q-security', title: 'Spot the injection', type: 'Multiple choice', skill: 'Security', difficulty: 'Medium', minutes: 12, languages: ['Any'], usedBy: 1290, summary: 'Six snippets: find the injection, the open redirect and the unsafe deserialise.' },
]

/* Sample candidates. Their code playback is built from the problem's solution. */
export type CandidateStatus = 'Invited' | 'In progress' | 'Completed' | 'Advanced' | 'Rejected'
export type Candidate = {
  id: string
  name: string
  email: string
  role: string
  problemId: string
  status: CandidateStatus
  score: number | null
  submittedAt: string | null
  durationMin: number | null
  skills: { name: string; score: number }[]
  passed: string[]
  ai: { prompts: number; accepted: number; summary: string }
  integrity: { pastes: number; pastedChars: number; tabSwitches: number }
  notes?: string
}

export const CANDIDATES: Candidate[] = [
  {
    id: 'c-amara', name: 'Amara Okafor', email: 'amara.okafor@example.com', role: 'Senior backend engineer', problemId: 'rate-limiter', status: 'Completed', score: 94, submittedAt: '2026-11-10T16:42:00Z', durationMin: 28,
    skills: [{ name: 'Correctness', score: 100 }, { name: 'Efficiency', score: 95 }, { name: 'Code quality', score: 90 }, { name: 'Working with AI', score: 88 }],
    passed: ['t1', 't2', 't3', 't4', 'h1', 'h2'], ai: { prompts: 2, accepted: 0, summary: 'Asked about the boundary rule, then wrote the queue herself.' }, integrity: { pastes: 0, pastedChars: 0, tabSwitches: 1 },
  },
  {
    id: 'c-lucas', name: 'Lucas Ferreira', email: 'lucas.f@example.com', role: 'Senior backend engineer', problemId: 'rate-limiter', status: 'Advanced', score: 86, submittedAt: '2026-11-09T19:05:00Z', durationMin: 33,
    skills: [{ name: 'Correctness', score: 83 }, { name: 'Efficiency', score: 90 }, { name: 'Code quality', score: 85 }, { name: 'Working with AI', score: 92 }],
    passed: ['t1', 't2', 't3', 't4', 'h1'], ai: { prompts: 4, accepted: 1, summary: 'Used the assistant to draft tests, reviewed and corrected one off-by-one.' }, integrity: { pastes: 1, pastedChars: 64, tabSwitches: 0 }, notes: 'Strong on trade-offs in the follow-up. Move to system design.',
  },
  {
    id: 'c-mei', name: 'Mei Lin', email: 'mei.lin@example.com', role: 'Full-stack engineer', problemId: 'merge-windows', status: 'Completed', score: 100, submittedAt: '2026-11-11T09:12:00Z', durationMin: 14,
    skills: [{ name: 'Correctness', score: 100 }, { name: 'Efficiency', score: 100 }, { name: 'Code quality', score: 96 }, { name: 'Working with AI', score: 80 }],
    passed: ['t1', 't2', 't3', 't4', 'h1', 'h2'], ai: { prompts: 0, accepted: 0, summary: 'Did not open the assistant.' }, integrity: { pastes: 0, pastedChars: 0, tabSwitches: 0 },
  },
  {
    id: 'c-jonah', name: 'Jonah Weiss', email: 'jonah.weiss@example.com', role: 'Full-stack engineer', problemId: 'merge-windows', status: 'Completed', score: 67, submittedAt: '2026-11-08T14:30:00Z', durationMin: 25,
    skills: [{ name: 'Correctness', score: 67 }, { name: 'Efficiency', score: 70 }, { name: 'Code quality', score: 72 }, { name: 'Working with AI', score: 55 }],
    passed: ['t1', 't3', 't4', 'h2'], ai: { prompts: 6, accepted: 3, summary: 'Accepted three suggestions without running them; missed touching windows.' }, integrity: { pastes: 3, pastedChars: 410, tabSwitches: 4 },
  },
  {
    id: 'c-sofia', name: 'Sofía Ramírez', email: 'sofia.ramirez@example.com', role: 'Data engineer', problemId: 'top-words', status: 'Rejected', score: 50, submittedAt: '2026-11-07T11:18:00Z', durationMin: 20,
    skills: [{ name: 'Correctness', score: 50 }, { name: 'Efficiency', score: 60 }, { name: 'Code quality', score: 64 }, { name: 'Working with AI', score: 70 }],
    passed: ['t1', 't3', 'h1'], ai: { prompts: 2, accepted: 1, summary: 'Asked for the regular expression, forgot tie-breaking.' }, integrity: { pastes: 1, pastedChars: 22, tabSwitches: 2 }, notes: 'Close. Worth a second look for the junior opening.',
  },
  {
    id: 'c-dev', name: 'Dev Patel', email: 'dev.patel@example.com', role: 'Data engineer', problemId: 'top-words', status: 'In progress', score: null, submittedAt: null, durationMin: null,
    skills: [], passed: [], ai: { prompts: 1, accepted: 0, summary: 'Session in progress.' }, integrity: { pastes: 0, pastedChars: 0, tabSwitches: 0 },
  },
  {
    id: 'c-hana', name: 'Hana Sato', email: 'hana.sato@example.com', role: 'Senior backend engineer', problemId: 'rate-limiter', status: 'Invited', score: null, submittedAt: null, durationMin: null,
    skills: [], passed: [], ai: { prompts: 0, accepted: 0, summary: 'Not started.' }, integrity: { pastes: 0, pastedChars: 0, tabSwitches: 0 },
  },
  {
    id: 'c-kwame', name: 'Kwame Mensah', email: 'kwame.mensah@example.com', role: 'Full-stack engineer', problemId: 'merge-windows', status: 'Advanced', score: 92, submittedAt: '2026-11-06T17:50:00Z', durationMin: 19,
    skills: [{ name: 'Correctness', score: 100 }, { name: 'Efficiency', score: 90 }, { name: 'Code quality', score: 84 }, { name: 'Working with AI', score: 94 }],
    passed: ['t1', 't2', 't3', 't4', 'h1', 'h2'], ai: { prompts: 3, accepted: 1, summary: 'Asked for edge cases, wrote a guard for empty input from the reply.' }, integrity: { pastes: 0, pastedChars: 0, tabSwitches: 1 },
  },
]

export const ROLES = ['Senior backend engineer', 'Full-stack engineer', 'Data engineer', 'Front-end engineer', 'Platform engineer']

/* Developers page: weekly leaderboard and upcoming events. */
export const LEADERBOARD = [
  { handle: 'quietloop', country: 'Poland', solved: 148, streak: 41, points: 9820 },
  { handle: 'mint_rook', country: 'Kenya', solved: 139, streak: 36, points: 9410 },
  { handle: 'nullpilot', country: 'Brazil', solved: 131, streak: 12, points: 8975 },
  { handle: 'heapsort', country: 'Japan', solved: 127, streak: 58, points: 8790 },
  { handle: 'lambda_lin', country: 'Canada', solved: 118, streak: 20, points: 8240 },
  { handle: 'ferrous', country: 'Germany', solved: 112, streak: 9, points: 7960 },
]

export const EVENTS = [
  { id: 'ev-1', title: 'November sprint: twelve problems in twelve days', date: '2026-11-18', kind: 'Contest', seats: 4200 },
  { id: 'ev-2', title: 'Live: pairing with an AI assistant without losing the plot', date: '2026-11-25', kind: 'Workshop', seats: 600 },
  { id: 'ev-3', title: 'Mock interview night for new grads', date: '2026-12-03', kind: 'Meetup', seats: 250 },
]
