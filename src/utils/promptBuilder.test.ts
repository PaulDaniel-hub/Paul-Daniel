import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPortfolioPrompt, DEFAULT_PROFILE } from './promptBuilder';

test('buildPortfolioPrompt includes all required stack items, projects, social links, and no-neon directive', () => {
  const prompt = buildPortfolioPrompt({
    ...DEFAULT_PROFILE,
    name: 'Priya Nair',
    university: 'National Institute of Engineering',
    linkedinUrl: 'https://linkedin.com/in/priyanair',
    githubUrl: 'https://github.com/priyanair',
  });

  assert.match(prompt, /Priya Nair/);
  assert.match(prompt, /National Institute of Engineering/);
  assert.match(prompt, /C Language/);
  assert.match(prompt, /Python/);
  assert.match(prompt, /Web Development/);
  assert.match(prompt, /Generative AI \(Beginner/);
  assert.match(prompt, /Voter Eligibility Calculator/);
  assert.match(prompt, /ATM Management System/);
  assert.match(prompt, /Student Grade Calculator/);
  assert.match(prompt, /NO neon colours/);
  assert.match(prompt, /https:\/\/linkedin\.com\/in\/priyanair/);
  assert.match(prompt, /https:\/\/github\.com\/priyanair/);
});
