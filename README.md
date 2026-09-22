# substrate-foundation

The substrate foundation runtime: **11 opcodes + FNV-1a 64-bit canary + drift tolerance**. The core runtime that everything in the cargo-line-tycoon fleet builds on.

## Why this exists

Every substrate observation (cell, signal, witness, witness-log entry, attestation, contestation, revocation) ultimately reduces to one of **11 canonical opcodes**. Every cell-graph's structural integrity is bound to a single **canary hash** (`0x024a555471370b18d`) that must reproduce byte-exactly across TypeScript, Rust, Python, and C99 implementations.

This package exports all of it in one place.

## The 11 Opcodes

```
BIND       — establish a cell identity
LINK       — connect two cells
EFFECT     — record a state change
VIEW       — project the cell state
TICK       — advance the cell-graph time

ATTEST     — add a trust score to an observation (R10)
DELEGATE   — transfer observation authority
CONTEST    — challenge an observation's validity (R10)
MERGER     — combine two observations into one
REVOKE     — remove an observation's authority (R10)
WITHDRAW   — pull back a delegated authority (R10)
```

The first five (`BIND/LINK/EFFECT/VIEW/TICK`) are the **cell-graph algebra**. The second six (`ATTEST/CONTEST/MERGER/REVOKE/WITHDRAW` + the original `DELEGATE`) are the **observation-primitive algebra** that makes the substrate defensible against memory-poisoning attacks.

## The Canary

```js
const { FLEET_CANARY_HASH } = require('@superinstance/substrate-foundation');
console.log(FLEET_CANARY_HASH);
// → 0x024a555471370b18d
```

This hash is computed from `"café Δ 日本語"` (4 bytes, 6 bytes, 9 bytes — a Unicode smoke test) using FNV-1a 64-bit. The same string must produce the same hash in every port. If it doesn't, the fleet has drifted and the substrate has lost cross-language reproducibility.

**Why this matters**: cross-language reproducibility is the substrate's strongest claim. We prove it with one canary.

## The Drift Tolerance

```js
const { DRIFT_TOLERANCE_MEAN_P } = require('@superinstance/substrate-foundation');
console.log(DRIFT_TOLERANCE_MEAN_P);
// → 0.7
```

`DRIFT_TOLERANCE_MEAN_P = 0.7` is the JEV oracle gate: a segment with mean confidence below 0.7 is divergent and must be re-evaluated. This is the same threshold the JEV oracle uses to decide whether a candidate piece is canon-ready.

## Three Forms of Evidence

```js
const { FORMS } = require('@superinstance/substrate-foundation');
console.log(Object.values(FORMS));
// → ['witness', 'receipt', 'memory']
```

The substrate has exactly three canonical forms of evidence:
- **Witness**: a recorded attestation, with prev_hash chain
- **Receipt**: a signed confirmation of an effect
- **Memory**: a substrate-resident state, with provenance

Everything else is derivative.

## Usage

```bash
npm install @superinstance/substrate-foundation
```

```js
const { ATTEST, CONTEST, MERGER, REVOKE, WITHDRAW, 
        BIND, LINK, EFFECT, VIEW, TICK,
        FLEET_CANARY_HASH, DRIFT_TOLERANCE_MEAN_P,
        ALL_OPCODES, FORMS } = require('@superinstance/substrate-foundation');

// Use the opcodes
ATTEST({ source: 'witness_1', payload: { value: 42 } });

// Check canary
if (FLEET_CANARY_HASH !== '0x024a555471370b18d') {
  throw new Error('Substrate fleet has drifted!');
}
```

## Tests

```bash
git clone https://github.com/SuperInstance/substrate-foundation
cd substrate-foundation
node test.js
```

Expected output:
```
FLEET_CANARY: 0x024a555471370b18d
Tolerance: 0.7
All opcodes: 11
Evidence forms: [ 'witness', 'receipt', 'memory' ]
```

## Architecture

```
                          substrate-foundation (this package)
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
   11 opcodes                   FNV-1a 64-bit canary         Drift tolerance
        │                             │                             │
   ┌────┴────┐                        │                             │
   │         │                        │                             │
 cell-    observation-                │                             │
 graph     primitive                cross-language              JEV gate
 algebra   algebra                  reproducibility             threshold
```

## Cross-language reproducibility

The substrate is implemented in four languages with byte-exact parity:
- **TypeScript** (this package, JavaScript)
- **Rust** (`@superinstance/substrate-foundation-rs`)
- **Python** (`cargo_line_tycoon_substrate`)
- **C99** (embedded systems)

The same FNV-1a 64-bit canary hash, the same 11 opcodes, the same drift tolerance. Verified by `tests/stress/01_fnv1a64_fuzz.js` (29 pathological inputs, all green).

## In the broader fleet

This package is one of 11+ substrate-* packages in the SuperInstance fleet:

- `substrate-attest` — ATTEST opcode primitive
- `substrate-contest` — CONTEST opcode primitive
- `substrate-witness-log` — prev_hash chained witness-log
- `substrate-revoke` — REVOKE opcode primitive
- `substrate-canary-pin` — canary hash pinning
- `substrate-delegate` — DELEGATE opcode primitive
- `substrate-withdraw` — WITHDRAW opcode primitive
- `substrate-merger` — MERGER opcode primitive
- `substrate-bundle` — bundle observation primitive
- `substrate-membership` — membership observation primitive
- `substrate-traverse` — traverse observation primitive

All of them depend on this package, transitively or directly.

## Author

SuperInstance
