import test from 'node:test';
import assert from 'node:assert/strict';
import {paintingPasses,MEDIA} from '../src/oil/mixed-media.js';
import {settings} from '../src/oil/settings.js';

test('single medium and zero overlay preserve the original four passes',()=>{
    for(const [style] of MEDIA){
        const original=[0,1,2,3].map(index=>({style,index,opacity:1,secondary:false}));
        assert.deepEqual(paintingPasses({style}),original);
        const secondaryStyle=MEDIA.find(([value])=>value!==style)[0];
        assert.deepEqual(paintingPasses({style,secondaryStyle,secondaryStrength:0}),original);
    }
});
test('all ordered medium pairs keep the base and add two translucent detail layers',()=>{
    for(const [style] of MEDIA)for(const [secondaryStyle] of MEDIA){
        if(style===secondaryStyle)continue;
        const config=settings(640,480,1600,style,'fine',secondaryStyle,35,'finish');
        const passes=paintingPasses(config);
        assert.deepEqual(passes.slice(0,4),paintingPasses({style}));
        assert.deepEqual(passes.slice(4),[2,3].map(index=>({style:secondaryStyle,index,opacity:.35,secondary:true})));
        assert.equal(config.detail,'fine');
    }
});
test('overpaint is the default and applies all four passes without clearing the primary',()=>{
    for(const [style] of MEDIA)for(const [secondaryStyle] of MEDIA){
        if(style===secondaryStyle)continue;
        const config=settings(640,480,1600,style,'medium',secondaryStyle,65);
        assert.equal(config.secondaryMode,'overpaint');
        const passes=paintingPasses(config);
        assert.deepEqual(passes.slice(0,4),paintingPasses({style}));
        assert.deepEqual(passes.slice(4),[0,1,2,3].map(index=>({style:secondaryStyle,index,opacity:.65,secondary:true})));
        assert.deepEqual(paintingPasses({...config,secondaryStrength:0}),paintingPasses({style}));
    }
    assert.throws(()=>settings(640,480,1600,'painterly','medium','pencil',35,'unknown'));
});
test('invalid second medium, duplicate medium and invalid strengths are rejected',()=>{
    for(const second of ['painterly','invalid'])assert.throws(()=>settings(640,480,1600,'painterly','medium',second,35));
    for(const strength of [-1,101,NaN,Infinity])assert.throws(()=>settings(640,480,1600,'painterly','medium','pencil',strength));
});
