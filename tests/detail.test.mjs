import test from 'node:test';import assert from 'node:assert/strict';
import {detailScale} from '../src/oil/detail.js';import {analyzePixels} from '../src/oil/analysis.js';import {mediaPlans} from '../src/oil/media-plan.js';import {painterlyPass} from '../src/oil/painterly.js';
test('coarse medium fine control mark size and count in every medium',()=>{
 const ref=analyzePixels(new Uint8ClampedArray(160*120*4).fill(65),160,120);
 for(const plan of [painterlyPass,...Object.values(mediaPlans)]){
 const stages=['coarse','medium','fine'].map(d=>plan(ref,1,123,detailScale(d)).dabs);
 assert.ok(stages[0].length<stages[1].length&&stages[1].length<stages[2].length);
 const average=marks=>marks.reduce((n,d)=>n+d.size,0)/marks.length;
 assert.ok(average(stages[0])>average(stages[1])&&average(stages[1])>average(stages[2]));
 }assert.throws(()=>detailScale('invalid'));
});

