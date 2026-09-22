const f = require('./index.js');
console.log('FLEET_CANARY:', f.FLEET_CANARY_HASH);
console.log('Tolerance:', f.DRIFT_TOLERANCE_MEAN_P);
console.log('All opcodes:', f.ALL_OPCODES.length);
console.log('Evidence forms:', Object.values(f.FORMS));
