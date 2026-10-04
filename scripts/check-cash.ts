// node scripts/check-cash.ts — asserts the cash rules match pos.pirotecnia's examples.
import assert from 'node:assert/strict';
import { canPay, cashChange, suggestCashAmounts } from '../src/lib/vendra/cash.ts';

assert.deepEqual(suggestCashAmounts(78526), [80000, 100000]);
assert.deepEqual(suggestCashAmounts(3000), [5000, 10000, 20000]);
assert.deepEqual(suggestCashAmounts(0), []);
assert.equal(cashChange(51000, ''), null);
assert.equal(cashChange(51000, '60000'), 9000);
assert.equal(canPay(51000, 'cash', null, ''), true); // received is optional
assert.equal(canPay(51000, 'cash', null, '50000'), false); // short
assert.equal(canPay(51000, 'transfer', null, ''), false); // wallet missing
assert.equal(canPay(51000, 'transfer', 'nequi', ''), true);
assert.equal(canPay(51000, null, null, ''), false);
console.log('cash: ok');
