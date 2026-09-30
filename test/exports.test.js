/**
 * Every canon opcode this package re-exports must be DEFINED.
 *
 * Why this test exists: this file used to destructure eleven per-opcode names out of
 * `@superinstance/opcode-canon`, which exports arrays and not one-name-per-opcode. All
 * eleven bound to `undefined`. They were only re-exported, never used in logic here, so
 * nothing threw, and `ALL_OPCODES` — built from the same source — was correct the whole
 * time. A consumer doing `const { BIND } = require('substrate-foundation')` got undefined
 * and had no way to know.
 *
 * A test that only asserted "the module loads" would have passed throughout. The check
 * that matters is that every NAME is defined, not that the package resolves.
 */
const assert = require('node:assert/strict');
const { test } = require('node:test');

const sf = require('../index.js');
const canon = require('@superinstance/opcode-canon');

const CANON = ['BIND','LINK','EFFECT','VIEW','TICK',
               'ATTEST','DELEGATE','CONTEST','MERGE','REVOKE','WITHDRAW'];

test('every canon opcode is exported and defined', () => {
  for (const name of CANON) {
    assert.notEqual(sf[name], undefined, `${name} is undefined — it was destructured from a package that exports arrays`);
  }
});

test('the exported set is exactly the canon set — no more, no less', () => {
  const exported = CANON.filter(n => sf[n] !== undefined);
  assert.deepEqual(exported.slice().sort(), CANON.slice().sort());
  assert.equal(sf.MERGER, undefined, 'MERGER was never an opcode; MERGE is canonical');
});

test('each export agrees with the canon package on its signatures', () => {
  for (const name of CANON) {
    assert.equal(sf[name].name, name);
    assert.deepEqual(sf[name].signatures, canon.OPCODE_SIGNATURES[name]);
  }
});

test('the fleet canary is the pinned value', () => {
  assert.equal(sf.FLEET_CANARY_HASH, '0x024a555471370b18d');
});

test('ALL_OPCODES still matches the canon package exactly', () => {
  assert.deepEqual(sf.ALL_OPCODES, canon.ALL_OPCODES);
});
