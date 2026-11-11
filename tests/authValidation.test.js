import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateAuthForm } from '../src/services/authValidation.js';

const form = { email: 'student@example.com', password: 'pass123', confirmPassword: 'pass123' };
test('valid signup data is accepted', () => assert.equal(validateAuthForm(form, true), ''));
test('invalid email and missing password are rejected', () => {
  assert.match(validateAuthForm({ ...form, email: 'student' }), /email/);
  assert.match(validateAuthForm({ ...form, password: '' }), /password/);
});
test('signup rejects short and nonmatching passwords', () => {
  assert.match(validateAuthForm({ ...form, password: '123' }, true), /6 characters/);
  assert.match(validateAuthForm({ ...form, confirmPassword: 'different' }, true), /do not match/);
});
test('login does not impose a new signup policy on an existing password', () => {
  assert.equal(validateAuthForm({ email: 'student@example.com', password: 'old' }), '');
});
