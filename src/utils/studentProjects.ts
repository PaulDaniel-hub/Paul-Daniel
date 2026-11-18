export type ProjectCategory = 'all' | 'c' | 'python';

export type ProjectId = 'voter-eligibility' | 'atm-system' | 'grade-calculator';

export interface ProjectMeta {
  id: ProjectId;
  index: string;
  title: string;
  category: Exclude<ProjectCategory, 'all'>;
  languageLabel: string;
  summary: string;
  concepts: string[];
  cSnippet: string;
  pythonSnippet: string;
}

export interface VoterEligibilityInput {
  age: number;
  isCitizen: boolean;
  hasVoterId: boolean;
  minimumAge?: number;
}

export interface VoterEligibilityResult {
  valid: boolean;
  eligible: boolean;
  statusTitle: string;
  reason: string;
  yearsRemaining: number;
  error?: string;
}

export function evaluateVoterEligibility(
  input: VoterEligibilityInput
): VoterEligibilityResult {
  const minAge = input.minimumAge ?? 18;

  if (!Number.isFinite(input.age) || Number.isNaN(input.age)) {
    return {
      valid: false,
      eligible: false,
      statusTitle: 'Invalid Input',
      reason: 'Please enter a valid numeric age.',
      yearsRemaining: 0,
      error: 'Please enter a valid numeric age.',
    };
  }

  if (input.age < 0 || input.age > 125) {
    return {
      valid: false,
      eligible: false,
      statusTitle: 'Out of Range',
      reason: 'Age must be between 0 and 125 years.',
      yearsRemaining: 0,
      error: 'Age must be between 0 and 125 years.',
    };
  }

  const wholeAge = Math.floor(input.age);
  const yearsRemaining = Math.max(0, minAge - wholeAge);

  if (!input.isCitizen) {
    return {
      valid: true,
      eligible: false,
      statusTitle: 'Not Eligible',
      reason: 'Citizenship is required to register and vote in national elections.',
      yearsRemaining,
    };
  }

  if (wholeAge < minAge) {
    return {
      valid: true,
      eligible: false,
      statusTitle: 'Not Eligible Yet',
      reason: `Applicant is ${wholeAge} years old. ${yearsRemaining} ${
        yearsRemaining === 1 ? 'year' : 'years'
      } remaining until the minimum voting age of ${minAge}.`,
      yearsRemaining,
    };
  }

  if (!input.hasVoterId) {
    return {
      valid: true,
      eligible: false,
      statusTitle: 'Registration Pending',
      reason:
        'Age and citizenship criteria are met, but a valid Electoral Voter ID card is required at the polling booth.',
      yearsRemaining: 0,
    };
  }

  return {
    valid: true,
    eligible: true,
    statusTitle: 'Eligible to Vote',
    reason: `All criteria satisfied (Age ${wholeAge}, Verified Citizen, Active Voter ID).`,
    yearsRemaining: 0,
  };
}

export interface AtmTransaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'PIN Verified';
  amount: number;
  balanceAfter: number;
  note: string;
}

export interface AtmState {
  unlocked: boolean;
  pinAttemptsRemaining: number;
  lockedOut: boolean;
  balance: number;
  dailyWithdrawn: number;
  dailyLimit: number;
  transactions: AtmTransaction[];
  lastMessage: string;
  lastError: string | null;
}

export const DEMO_ATM_PIN = '1234';

export function createInitialAtmState(initialBalance = 10000): AtmState {
  return {
    unlocked: false,
    pinAttemptsRemaining: 3,
    lockedOut: false,
    balance: initialBalance,
    dailyWithdrawn: 0,
    dailyLimit: 25000,
    transactions: [],
    lastMessage: 'Enter 4-digit PIN (demo: 1234) to begin session.',
    lastError: null,
  };
}

export function verifyAtmPin(state: AtmState, enteredPin: string): AtmState {
  if (state.lockedOut) {
    return {
      ...state,
      lastError: 'Card temporarily locked after 3 failed PIN attempts. Reset session to retry.',
    };
  }

  const trimmed = enteredPin.trim();
  if (!/^\d{4}$/.test(trimmed)) {
    return {
      ...state,
      lastError: 'PIN must be exactly 4 numeric digits.',
    };
  }

  if (trimmed === DEMO_ATM_PIN) {
    const tx: AtmTransaction = {
      id: `tx-${state.transactions.length + 1}`,
      type: 'PIN Verified',
      amount: 0,
      balanceAfter: state.balance,
      note: 'Session authenticated',
    };
    return {
      ...state,
      unlocked: true,
      pinAttemptsRemaining: 3,
      lastError: null,
      lastMessage: 'PIN accepted. Select Deposit, Withdraw, or Balance Inquiry.',
      transactions: [tx, ...state.transactions],
    };
  }

  const remaining = state.pinAttemptsRemaining - 1;
  const lockedOut = remaining <= 0;
  return {
    ...state,
    unlocked: false,
    pinAttemptsRemaining: Math.max(0, remaining),
    lockedOut,
    lastError: lockedOut
      ? 'Incorrect PIN. Card locked after 3 failed attempts. Use Reset Session.'
      : `Incorrect PIN. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`,
  };
}

export function depositAtm(state: AtmState, amount: number): AtmState {
  if (!state.unlocked) {
    return { ...state, lastError: 'Authenticate with your PIN first.' };
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ...state, lastError: 'Enter a positive deposit amount greater than 0.' };
  }
  if (amount > 100000) {
    return { ...state, lastError: 'Single ATM cash deposit cannot exceed ₹100,000.' };
  }

  const rounded = Math.round(amount * 100) / 100;
  const nextBalance = Math.round((state.balance + rounded) * 100) / 100;
  const tx: AtmTransaction = {
    id: `tx-${state.transactions.length + 1}`,
    type: 'Deposit',
    amount: rounded,
    balanceAfter: nextBalance,
    note: `Deposited ₹${rounded.toLocaleString('en-IN')}`,
  };

  return {
    ...state,
    balance: nextBalance,
    lastError: null,
    lastMessage: `Deposited ₹${rounded.toLocaleString('en-IN')}. Updated balance: ₹${nextBalance.toLocaleString('en-IN')}.`,
    transactions: [tx, ...state.transactions],
  };
}

export function withdrawAtm(state: AtmState, amount: number): AtmState {
  if (!state.unlocked) {
    return { ...state, lastError: 'Authenticate with your PIN first.' };
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ...state, lastError: 'Enter a positive withdrawal amount greater than 0.' };
  }

  const rounded = Math.round(amount * 100) / 100;
  if (rounded > state.balance) {
    return {
      ...state,
      lastError: `Insufficient funds. Available balance is ₹${state.balance.toLocaleString('en-IN')}.`,
    };
  }
  if (state.dailyWithdrawn + rounded > state.dailyLimit) {
    const remainingLimit = state.dailyLimit - state.dailyWithdrawn;
    return {
      ...state,
      lastError: `Exceeds daily withdrawal limit of ₹${state.dailyLimit.toLocaleString('en-IN')}. Remaining today: ₹${remainingLimit.toLocaleString('en-IN')}.`,
    };
  }

  const nextBalance = Math.round((state.balance - rounded) * 100) / 100;
  const tx: AtmTransaction = {
    id: `tx-${state.transactions.length + 1}`,
    type: 'Withdrawal',
    amount: rounded,
    balanceAfter: nextBalance,
    note: `Withdrew ₹${rounded.toLocaleString('en-IN')}`,
  };

  return {
    ...state,
    balance: nextBalance,
    dailyWithdrawn: Math.round((state.dailyWithdrawn + rounded) * 100) / 100,
    lastError: null,
    lastMessage: `Withdrew ₹${rounded.toLocaleString('en-IN')}. Remaining balance: ₹${nextBalance.toLocaleString('en-IN')}.`,
    transactions: [tx, ...state.transactions],
  };
}

export interface SubjectScore {
  id: string;
  name: string;
  marks: number;
}

export interface SubjectGradeResult extends SubjectScore {
  letterGrade: string;
  gradePoints: number;
  passed: boolean;
}

export interface StudentGradeSummary {
  valid: boolean;
  error?: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  cgpa: number;
  overallGrade: string;
  passedAll: boolean;
  subjects: SubjectGradeResult[];
}

export const DEFAULT_SUBJECTS: SubjectScore[] = [
  { id: 'c-prog', name: 'Problem Solving in C', marks: 88 },
  { id: 'python', name: 'Python Fundamentals', marks: 91 },
  { id: 'math', name: 'Engineering Mathematics I', marks: 84 },
  { id: 'web', name: 'Web Engineering Basics', marks: 89 },
  { id: 'ai-intro', name: 'Foundations of AI', marks: 86 },
];

export function mapScoreToGrade(marks: number): {
  letterGrade: string;
  gradePoints: number;
  passed: boolean;
} {
  if (marks >= 90) return { letterGrade: 'O', gradePoints: 10, passed: true };
  if (marks >= 80) return { letterGrade: 'A+', gradePoints: 9, passed: true };
  if (marks >= 70) return { letterGrade: 'A', gradePoints: 8, passed: true };
  if (marks >= 60) return { letterGrade: 'B+', gradePoints: 7, passed: true };
  if (marks >= 50) return { letterGrade: 'B', gradePoints: 6, passed: true };
  if (marks >= 40) return { letterGrade: 'C', gradePoints: 5, passed: true };
  return { letterGrade: 'F', gradePoints: 0, passed: false };
}

export function calculateStudentGrades(
  subjects: SubjectScore[]
): StudentGradeSummary {
  if (subjects.length === 0) {
    return {
      valid: false,
      error: 'At least one subject is required.',
      totalMarks: 0,
      maxMarks: 0,
      percentage: 0,
      cgpa: 0,
      overallGrade: 'N/A',
      passedAll: false,
      subjects: [],
    };
  }

  for (const subject of subjects) {
    if (!Number.isFinite(subject.marks) || Number.isNaN(subject.marks)) {
      return {
        valid: false,
        error: `Invalid numeric mark for "${subject.name}".`,
        totalMarks: 0,
        maxMarks: subjects.length * 100,
        percentage: 0,
        cgpa: 0,
        overallGrade: 'N/A',
        passedAll: false,
        subjects: [],
      };
    }
    if (subject.marks < 0 || subject.marks > 100) {
      return {
        valid: false,
        error: `Marks for "${subject.name}" must be between 0 and 100.`,
        totalMarks: 0,
        maxMarks: subjects.length * 100,
        percentage: 0,
        cgpa: 0,
        overallGrade: 'N/A',
        passedAll: false,
        subjects: [],
      };
    }
  }

  const gradedSubjects: SubjectGradeResult[] = subjects.map((subject) => {
    const mapped = mapScoreToGrade(subject.marks);
    return {
      ...subject,
      ...mapped,
    };
  });

  const totalMarks = gradedSubjects.reduce((sum, s) => sum + s.marks, 0);
  const maxMarks = gradedSubjects.length * 100;
  const percentage = Math.round((totalMarks / maxMarks) * 1000) / 10;
  const cgpa =
    Math.round(
      (gradedSubjects.reduce((sum, s) => sum + s.gradePoints, 0) /
        gradedSubjects.length) *
        100
    ) / 100;
  const passedAll = gradedSubjects.every((s) => s.passed);
  const overallGrade = passedAll ? mapScoreToGrade(percentage).letterGrade : 'F';

  return {
    valid: true,
    totalMarks,
    maxMarks,
    percentage,
    cgpa,
    overallGrade,
    passedAll,
    subjects: gradedSubjects,
  };
}

export const PROJECTS_DATA: ProjectMeta[] = [
  {
    id: 'voter-eligibility',
    index: '01',
    title: 'Voter Eligibility Calculator',
    category: 'c',
    languageLabel: 'C Language · Conditional Logic',
    summary:
      'A rule-based validation program built in C that verifies age thresholds, citizenship status, and voter registration before issuing clear eligibility feedback.',
    concepts: ['if / else branching', 'Input range validation', 'Boolean flags'],
    cSnippet: `#include <stdio.h>

int main(void) {
    int age, is_citizen, has_id;
    printf("Enter age: ");
    if (scanf("%d", &age) != 1 || age < 0 || age > 125) {
        printf("Invalid age input.\\n");
        return 1;
    }
    printf("Citizen (1=Yes, 0=No) & Voter ID (1=Yes, 0=No): ");
    scanf("%d %d", &is_citizen, &has_id);

    if (!is_citizen) {
        printf("Not Eligible: Citizenship required.\\n");
    } else if (age < 18) {
        printf("Not Eligible Yet: %d year(s) remaining.\\n", 18 - age);
    } else if (!has_id) {
        printf("Pending: Obtain Voter ID card first.\\n");
    } else {
        printf("Eligible to Vote.\\n");
    }
    return 0;
}`,
    pythonSnippet: `def check_voter_eligibility(age: int, is_citizen: bool, has_voter_id: bool) -> str:
    if not (0 <= age <= 125):
        return "Invalid age range"
    if not is_citizen:
        return "Not Eligible: Citizenship required"
    if age < 18:
        return f"Not Eligible Yet: {18 - age} year(s) remaining"
    if not has_voter_id:
        return "Registration Pending: Voter ID required"
    return "Eligible to Vote"`,
  },
  {
    id: 'atm-system',
    index: '02',
    title: 'ATM Management System',
    category: 'c',
    languageLabel: 'C Language · State & Menu Loop',
    summary:
      'A menu-driven banking simulator featuring PIN authentication with attempt limits, balance inquiry, deposits, withdrawals with overdraft checks, and an audit ledger.',
    concepts: ['switch-case menus', 'do-while session loop', 'Guard clauses'],
    cSnippet: `#include <stdio.h>

int main(void) {
    const int PIN = 1234;
    int entered, choice, attempts = 3;
    double balance = 10000.0, amount;

    while (attempts > 0) {
        printf("Enter PIN: ");
        scanf("%d", &entered);
        if (entered == PIN) break;
        attempts--;
    }
    if (attempts == 0) return 1;

    do {
        printf("1.Balance  2.Deposit  3.Withdraw  4.Exit\\n");
        scanf("%d", &choice);
        if (choice == 2 && scanf("%lf", &amount) == 1 && amount > 0)
            balance += amount;
        else if (choice == 3 && scanf("%lf", &amount) == 1 && amount > 0 && amount <= balance)
            balance -= amount;
    } while (choice != 4);
    return 0;
}`,
    pythonSnippet: `class ATM:
    def __init__(self, pin: str = "1234", balance: float = 10000.0):
        self.pin = pin
        self.balance = balance
        self.daily_withdrawn = 0.0

    def withdraw(self, amount: float) -> str:
        if amount <= 0:
            return "Amount must be positive"
        if amount > self.balance:
            return "Insufficient funds"
        self.balance -= amount
        self.daily_withdrawn += amount
        return f"Withdrew {amount:.2f}. Balance: {self.balance:.2f}"`,
  },
  {
    id: 'grade-calculator',
    index: '03',
    title: 'Student Grade Calculator',
    category: 'python',
    languageLabel: 'Python & C · Arrays & Aggregation',
    summary:
      'Multi-subject academic evaluator computing total marks, percentage, 10-point CGPA, letter grades, and subject-wise pass verification.',
    concepts: ['Arrays & iteration', 'Weighted CGPA mapping', 'Boundary checks'],
    cSnippet: `#include <stdio.h>

char get_grade(double pct) {
    if (pct >= 90) return 'O';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 50) return 'C';
    return 'F';
}

int main(void) {
    int marks[5], total = 0;
    for (int i = 0; i < 5; i++) {
        scanf("%d", &marks[i]);
        total += marks[i];
    }
    double percentage = total / 5.0;
    printf("Total: %d/500 | %.1f%% | Grade: %c\\n",
           total, percentage, get_grade(percentage));
    return 0;
}`,
    pythonSnippet: `def calculate_grades(scores: list[float]) -> dict:
    if any(s < 0 or s > 100 for s in scores):
        raise ValueError("All scores must be between 0 and 100")
    total = sum(scores)
    percentage = round(total / len(scores), 1)
    points = [10 if s >= 90 else 9 if s >= 80 else 8 if s >= 70 else 7 if s >= 60 else 6 if s >= 50 else 5 if s >= 40 else 0 for s in scores]
    cgpa = round(sum(points) / len(points), 2)
    return {"total": total, "percentage": percentage, "cgpa": cgpa}`,
  },
];
