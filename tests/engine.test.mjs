import test from 'node:test';
import assert from 'node:assert/strict';
import {settings} from '../src/oil/settings.js';
import {analyzePixels, linePixels} from '../src/oil/analysis.js';
import {painterlyPass} from '../src/oil/painterly.js';
test('output aspect ratio and analysis ceiling are retained', () => {
    for (const [w,h] of [[1672,941],[941,1672],[4096,2160]]) {
        const config = settings(w,h,3344,'painterly');
        assert.equal(Math.max(config.output.width,config.output.height),3344);
        assert.ok(Math.abs(config.output.width / config.output.height - w / h) < .002);
        assert.ok(Math.max(config.analysis.width,config.analysis.height)<=1800);
    }
    assert.throws(() => settings(100,100,999,'painterly'));
});
test('flat source has no invented outlines, oil marks remain deterministic', () => {
    const ref=analyzePixels(new Uint8ClampedArray(40*30*4).fill(80),40,30);
    assert.ok([...ref.edge].every(n=>n===0));
    assert.ok([...linePixels(ref)].filter((_,i)=>i%4===3).every(n=>n===0));
    assert.deepEqual(painterlyPass(ref,2,123),painterlyPass(ref,2,123));
});
