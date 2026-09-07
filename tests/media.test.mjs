import test from 'node:test';import assert from 'node:assert/strict';
import {analyzePixels} from '../src/oil/analysis.js';import {mediaPlans} from '../src/oil/media-plan.js';
test('all media produce deterministic bounded marks in four stages',()=>{const ref=analyzePixels(new Uint8ClampedArray(40*30*4).fill(80),40,30);for(const plan of Object.values(mediaPlans)){for(let i=0;i<4;i++){const a=plan(ref,i,321);assert.deepEqual(a,plan(ref,i,321));assert.ok(a.name);for(const d of a.dabs){assert.ok(d.x>=0&&d.x<40&&d.y>=0&&d.y<30);assert.ok(d.opacity>0&&d.opacity<=1);}}}});
test('pencil leaves white areas free of hatch marks',()=>{const ref=analyzePixels(new Uint8ClampedArray(20*20*4).fill(255),20,20);for(let i=0;i<4;i++)assert.equal(mediaPlans.pencil(ref,i,1).dabs.length,0);});

