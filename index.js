// substrate-foundation: the combined foundation runtime.
// Exports the constants and core ops in a single coherent package.

const { 
  ATTEST, DELEGATE, CONTEST, MERGER, REVOKE, WITHDRAW,
  BIND, LINK, EFFECT, VIEW, TICK,
} = require('@superinstance/opcode-canon');

const { ALL_OPCODES } = require('@superinstance/opcode-canon');
const { FORMS } = require('@superinstance/three-forms-of-evidence');

const FLEET_CANARY_HASH = '0x024a555471370b18d';
const DRIFT_TOLERANCE_MEAN_P = 0.7; // JEV mean_p below 0.7 means divergent segment

module.exports = {
  FLEET_CANARY_HASH,
  DRIFT_TOLERANCE_MEAN_P,
  ATTEST, DELEGATE, CONTEST, MERGER, REVOKE, WITHDRAW,
  BIND, LINK, EFFECT, VIEW, TICK,
  ALL_OPCODES,
  FORMS,
  // Convenience: list of all canon constants
  CONSTANTS: {
    FLEET_CANARY_HASH,
    DRIFT_TOLERANCE_MEAN_P,
  },
};
