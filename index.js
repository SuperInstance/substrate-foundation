// substrate-foundation: the combined foundation runtime.
// Exports the constants and core ops in a single coherent package.

// `@superinstance/opcode-canon` exports ARRAYS (BASE_OPCODES, PROPOSED_OPCODES,
// ALL_OPCODES, OPCODE_SIGNATURES) -- it does not export one name per opcode.
//
// This file used to destructure eleven per-opcode names out of it. Every one of them
// bound to `undefined` at runtime, and because they were only re-exported rather than
// used in logic here, nothing threw. `ALL_OPCODES` in the same file was correct, because
// it came from the array. So a consumer doing
//     const { BIND } = require('substrate-foundation')
// got `undefined` and had no way to tell.
//
// It is now built from the arrays, so it cannot drift from them.
const canon = require('@superinstance/opcode-canon');

const { ALL_OPCODES, BASE_OPCODES, PROPOSED_OPCODES, OPCODE_SIGNATURES } = canon;

const OPCODE_VALUES = Object.fromEntries(
  ALL_OPCODES.map((name) => [name, Object.freeze({ name, signatures: OPCODE_SIGNATURES[name] })])
);
const byName = (name) => OPCODE_VALUES[name];

// A named export per opcode, derived rather than destructured. `MERGER` is gone: the
// canonical spelling is `MERGE`, and nothing should be able to reintroduce the drift.
const BIND = byName('BIND');
const LINK = byName('LINK');
const EFFECT = byName('EFFECT');
const VIEW = byName('VIEW');
const TICK = byName('TICK');
const ATTEST = byName('ATTEST');
const DELEGATE = byName('DELEGATE');
const CONTEST = byName('CONTEST');
const MERGE = byName('MERGE');
const REVOKE = byName('REVOKE');
const WITHDRAW = byName('WITHDRAW');
const { FORMS } = require('@superinstance/three-forms-of-evidence');

const FLEET_CANARY_HASH = '0x024a555471370b18d';
const DRIFT_TOLERANCE_MEAN_P = 0.7; // JEV mean_p below 0.7 means divergent segment

module.exports = {
  FLEET_CANARY_HASH,
  DRIFT_TOLERANCE_MEAN_P,
  ATTEST, DELEGATE, CONTEST, MERGE, REVOKE, WITHDRAW,
  BIND, LINK, EFFECT, VIEW, TICK,
  OPCODE_VALUES, byName,
  BASE_OPCODES, PROPOSED_OPCODES, OPCODE_SIGNATURES, ALL_OPCODES,
  FORMS,
  // Convenience: list of all canon constants
  CONSTANTS: {
    FLEET_CANARY_HASH,
    DRIFT_TOLERANCE_MEAN_P,
  },
};
