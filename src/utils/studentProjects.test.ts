import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateVoterEligibility,
  createInitialAtmState,
  verifyAtmPin,
  depositAtm,
  withdrawAtm,
  calculateStudentGrades,
  DEFAULT_SUBJECTS,
} from './studentProjects';

test('evaluateVoterEligibility handles valid eligible, underage, non-citizen, missing ID, and invalid inputs', () => {
  const eligible = evaluateVoterEligibility({
    age: 19,
    isCitizen: true,
    hasVoterId: true,
  });
  assert.equal(eligible.valid, true);
  assert.equal(eligible.eligible, true);
  assert.equal(eligible.statusTitle, 'Eligible to Vote');

  const underage = evaluateVoterEligibility({
    age: 17,
    isCitizen: true,
    hasVoterId: true,
  });
  assert.equal(underage.valid, true);
  assert.equal(underage.eligible, false);
  assert.equal(underage.yearsRemaining, 1);

  const nonCitizen = evaluateVoterEligibility({
    age: 22,
    isCitizen: false,
    hasVoterId: true,
  });
  assert.equal(nonCitizen.eligible, false);

  const missingId = evaluateVoterEligibility({
    age: 20,
    isCitizen: true,
    hasVoterId: false,
  });
  assert.equal(missingId.eligible, false);
  assert.equal(missingId.statusTitle, 'Registration Pending');

  const outOfRange = evaluateVoterEligibility({
    age: -5,
    isCitizen: true,
    hasVoterId: true,
  });
  assert.equal(outOfRange.valid, false);
  assert.ok(outOfRange.error);
});

test('ATM state machine handles PIN verification, lockout, deposit, and withdrawal limits', () => {
  let state = createInitialAtmState(10000);
  assert.equal(state.unlocked, false);

  // Deposit before unlock fails
  const blockedDeposit = depositAtm(state, 500);
  assert.equal(blockedDeposit.balance, 10000);
  assert.ok(blockedDeposit.lastError);

  // Wrong PIN reduces attempts
  state = verifyAtmPin(state, '0000');
  assert.equal(state.unlocked, false);
  assert.equal(state.pinAttemptsRemaining, 2);

  // Correct PIN unlocks
  state = verifyAtmPin(state, '1234');
  assert.equal(state.unlocked, true);
  assert.equal(state.lastError, null);

  // Deposit updates balance and transaction log
  state = depositAtm(state, 2500);
  assert.equal(state.balance, 12500);
  assert.equal(state.transactions[0].type, 'Deposit');

  // Overdraft fails without mutating balance
  const overdraft = withdrawAtm(state, 50000);
  assert.equal(overdraft.balance, 12500);
  assert.ok(overdraft.lastError);

  // Valid withdrawal updates balance and dailyWithdrawn
  state = withdrawAtm(state, 3000);
  assert.equal(state.balance, 9500);
  assert.equal(state.dailyWithdrawn, 3000);

  // Three consecutive wrong PINs lock the card
  let lockedState = createInitialAtmState(5000);
  lockedState = verifyAtmPin(lockedState, '1111');
  lockedState = verifyAtmPin(lockedState, '2222');
  lockedState = verifyAtmPin(lockedState, '3333');
  assert.equal(lockedState.lockedOut, true);
  assert.equal(lockedState.pinAttemptsRemaining, 0);
});

test('calculateStudentGrades computes total, percentage, CGPA, pass/fail, and validates bounds', () => {
  const summary = calculateStudentGrades(DEFAULT_SUBJECTS);
  assert.equal(summary.valid, true);
  assert.equal(summary.totalMarks, 438);
  assert.equal(summary.maxMarks, 500);
  assert.equal(summary.percentage, 87.6);
  assert.equal(summary.cgpa, 9.2);
  assert.equal(summary.overallGrade, 'A+');
  assert.equal(summary.passedAll, true);

  const failedOne = calculateStudentGrades([
    { id: '1', name: 'C', marks: 95 },
    { id: '2', name: 'Math', marks: 32 },
  ]);
  assert.equal(failedOne.valid, true);
  assert.equal(failedOne.passedAll, false);
  assert.equal(failedOne.overallGrade, 'F');

  const invalid = calculateStudentGrades([
    { id: '1', name: 'C', marks: 120 },
  ]);
  assert.equal(invalid.valid, false);
  assert.ok(invalid.error);
});
