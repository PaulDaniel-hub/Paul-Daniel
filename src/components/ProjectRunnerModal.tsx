import { useEffect, useState, type FormEvent } from 'react';
import { Check, Copy, RotateCcw, X } from 'lucide-react';
import {
  calculateStudentGrades,
  createInitialAtmState,
  DEFAULT_SUBJECTS,
  depositAtm,
  evaluateVoterEligibility,
  PROJECTS_DATA,
  verifyAtmPin,
  withdrawAtm,
  type AtmState,
  type ProjectId,
  type SubjectScore,
} from '../utils/studentProjects';

interface ProjectRunnerModalProps {
  projectId: ProjectId | null;
  onClose: () => void;
}

type ModalTab = 'simulator' | 'c-code' | 'python-code';

export function ProjectRunnerModal({ projectId, onClose }: ProjectRunnerModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('simulator');
  const [copiedCode, setCopiedCode] = useState(false);

  // Voter Eligibility state
  const [ageInput, setAgeInput] = useState('19');
  const [isCitizen, setIsCitizen] = useState(true);
  const [hasVoterId, setHasVoterId] = useState(true);
  const [voterResult, setVoterResult] = useState(() =>
    evaluateVoterEligibility({ age: 19, isCitizen: true, hasVoterId: true })
  );

  // ATM Management state
  const [atmState, setAtmState] = useState<AtmState>(() => createInitialAtmState(10000));
  const [pinInput, setPinInput] = useState('');
  const [atmAmountInput, setAtmAmountInput] = useState('1500');

  // Student Grade Calculator state
  const [subjects, setSubjects] = useState<SubjectScore[]>(DEFAULT_SUBJECTS);
  const gradeSummary = calculateStudentGrades(subjects);

  const project = PROJECTS_DATA.find((item) => item.id === projectId);

  useEffect(() => {
    setActiveTab('simulator');
    setCopiedCode(false);
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projectId, onClose]);

  if (!project) return null;

  const handleVoterCheck = (event: FormEvent) => {
    event.preventDefault();
    const parsedAge = ageInput.trim() === '' ? NaN : Number(ageInput);
    setVoterResult(
      evaluateVoterEligibility({
        age: parsedAge,
        isCitizen,
        hasVoterId,
      })
    );
  };

  const handlePinSubmit = (event: FormEvent) => {
    event.preventDefault();
    setAtmState((prev) => verifyAtmPin(prev, pinInput));
  };

  const handleDeposit = () => {
    const parsed = atmAmountInput.trim() === '' ? NaN : Number(atmAmountInput);
    setAtmState((prev) => depositAtm(prev, parsed));
  };

  const handleWithdraw = () => {
    const parsed = atmAmountInput.trim() === '' ? NaN : Number(atmAmountInput);
    setAtmState((prev) => withdrawAtm(prev, parsed));
  };

  const handleResetAtm = () => {
    setAtmState(createInitialAtmState(10000));
    setPinInput('');
    setAtmAmountInput('1500');
  };

  const handleSubjectMarkChange = (id: string, value: string) => {
    const numericValue = value.trim() === '' ? NaN : Number(value);
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id ? { ...subject, marks: numericValue } : subject
      )
    );
  };

  const handleCopySnippet = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      setCopiedCode(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-medium text-slate-500">
              <span className="font-mono tabular-nums text-slate-700">
                {project.index}
              </span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>{project.languageLabel}</span>
            </p>
            <h3
              id="project-modal-title"
              className="mt-1 font-display text-xl font-semibold text-slate-900"
            >
              {project.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project demo"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
          <div className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-1">
            {(
              [
                { id: 'simulator', label: 'Live Simulator' },
                { id: 'c-code', label: 'C Source' },
                { id: 'python-code', label: 'Python Source' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto p-6">
          {activeTab === 'simulator' && project.id === 'voter-eligibility' && (
            <div className="space-y-6">
              <form onSubmit={handleVoterCheck} className="space-y-4">
                <div>
                  <label
                    htmlFor="voter-age-input"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Applicant Age (Years)
                  </label>
                  <input
                    id="voter-age-input"
                    type="number"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    placeholder="Enter age (0 - 125)"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono tabular-nums focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCitizen}
                      onChange={(e) => setIsCitizen(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
                    />
                    <span>Verified National Citizen</span>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasVoterId}
                      onChange={(e) => setHasVoterId(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
                    />
                    <span>Active Electoral Voter ID</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 cursor-pointer"
                >
                  Check Eligibility
                </button>
              </form>

              <div
                data-testid="voter-result-box"
                className={`rounded-xl border p-5 ${
                  !voterResult.valid
                    ? 'border-red-300 bg-red-50 text-red-900'
                    : voterResult.eligible
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                      : 'border-amber-300 bg-amber-50 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-base font-semibold">
                    {voterResult.statusTitle}
                  </span>
                  {voterResult.valid && !voterResult.eligible && voterResult.yearsRemaining > 0 && (
                    <span className="font-mono text-xs font-medium tabular-nums">
                      {voterResult.yearsRemaining} yr(s) to 18
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed">
                  {voterResult.reason}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'simulator' && project.id === 'atm-system' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Current Account Balance
                  </p>
                  <p
                    data-testid="atm-balance"
                    className="mt-1 font-mono text-2xl font-semibold text-slate-900 tabular-nums"
                  >
                    ₹{atmState.balance.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-medium text-slate-500">
                    Session Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {atmState.lockedOut
                      ? 'Locked (3 Failed PINs)'
                      : atmState.unlocked
                        ? 'Authenticated'
                        : 'Locked (PIN Required)'}
                  </p>
                </div>
              </div>

              {!atmState.unlocked ? (
                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="atm-pin-input"
                      className="block text-sm font-medium text-slate-800"
                    >
                      Enter 4-Digit PIN (Demo PIN: 1234)
                    </label>
                    <div className="mt-1.5 flex gap-3">
                      <input
                        id="atm-pin-input"
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        placeholder="1234"
                        className="w-44 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono tracking-widest focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
                      />
                      <button
                        type="submit"
                        disabled={atmState.lockedOut}
                        className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400 cursor-pointer"
                      >
                        Unlock ATM
                      </button>
                      <button
                        type="button"
                        onClick={handleResetAtm}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="atm-amount-input"
                      className="block text-sm font-medium text-slate-800"
                    >
                      Transaction Amount (INR)
                    </label>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3">
                      <input
                        id="atm-amount-input"
                        type="number"
                        value={atmAmountInput}
                        onChange={(e) => setAtmAmountInput(e.target.value)}
                        className="w-44 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono tabular-nums focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
                      />
                      <button
                        type="button"
                        onClick={handleDeposit}
                        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 cursor-pointer"
                      >
                        Deposit
                      </button>
                      <button
                        type="button"
                        onClick={handleWithdraw}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 cursor-pointer"
                      >
                        Withdraw
                      </button>
                      <button
                        type="button"
                        onClick={handleResetAtm}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        Reset Session
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {atmState.lastError ? (
                <div
                  role="alert"
                  className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
                >
                  {atmState.lastError}
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {atmState.lastMessage}
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold text-slate-600">
                  Transaction Ledger
                </h4>
                {atmState.transactions.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">
                    No transactions recorded yet in this session.
                  </p>
                ) : (
                  <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs text-slate-500">
                        <tr>
                          <th className="px-4 py-2.5 font-medium">Operation</th>
                          <th className="px-4 py-2.5 font-medium">Details</th>
                          <th className="px-4 py-2.5 text-right font-medium">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {atmState.transactions.map((tx) => (
                          <tr key={tx.id}>
                            <td className="px-4 py-2.5 font-medium text-slate-900">
                              {tx.type}
                            </td>
                            <td className="px-4 py-2.5 text-slate-600">
                              {tx.note}
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-900">
                              ₹{tx.balanceAfter.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'simulator' && project.id === 'grade-calculator' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5"
                  >
                    <label
                      htmlFor={`subject-${subject.id}`}
                      className="block text-xs font-medium text-slate-700"
                    >
                      {subject.name} (0–100)
                    </label>
                    <input
                      id={`subject-${subject.id}`}
                      type="number"
                      min={0}
                      max={100}
                      value={Number.isNaN(subject.marks) ? '' : subject.marks}
                      onChange={(e) =>
                        handleSubjectMarkChange(subject.id, e.target.value)
                      }
                      className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-mono tabular-nums text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
                    />
                  </div>
                ))}
              </div>

              {!gradeSummary.valid ? (
                <div
                  role="alert"
                  className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
                >
                  {gradeSummary.error}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">Total Marks</p>
                      <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-slate-900">
                        {gradeSummary.totalMarks} / {gradeSummary.maxMarks}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">Percentage</p>
                      <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-slate-900">
                        {gradeSummary.percentage}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">10-Point CGPA</p>
                      <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-blue-700">
                        {gradeSummary.cgpa}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">Standing</p>
                      <p className="mt-1 font-mono text-lg font-semibold text-slate-900">
                        {gradeSummary.overallGrade} ·{' '}
                        {gradeSummary.passedAll ? 'Pass' : 'Fail'}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs text-slate-500">
                        <tr>
                          <th className="px-4 py-2.5 font-medium">Subject</th>
                          <th className="px-4 py-2.5 text-right font-medium">Marks</th>
                          <th className="px-4 py-2.5 text-right font-medium">Grade</th>
                          <th className="px-4 py-2.5 text-right font-medium">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {gradeSummary.subjects.map((subj) => (
                          <tr key={subj.id}>
                            <td className="px-4 py-2.5 font-medium text-slate-900">
                              {subj.name}
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-700">
                              {subj.marks}
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-900">
                              {subj.letterGrade}
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-700">
                              {subj.gradePoints}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {(activeTab === 'c-code' || activeTab === 'python-code') && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  {activeTab === 'c-code'
                    ? 'Standard C Implementation'
                    : 'Python 3 Implementation'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopySnippet(
                      activeTab === 'c-code'
                        ? project.cSnippet
                        : project.pythonSnippet
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-700" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Snippet
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 p-5 font-mono text-xs leading-relaxed text-slate-100">
                <code>
                  {activeTab === 'c-code'
                    ? project.cSnippet
                    : project.pythonSnippet}
                </code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
