/** MediaRecorder lifecycle. No document or UI dependencies. */
export class CanvasRecorder {
  static supported() { return typeof MediaRecorder !== 'undefined' && typeof HTMLCanvasElement.prototype.captureStream === 'function'; }
  start(canvas) {
    if (this.recorder) throw new Error('録画はすでに開始されています。');
    if (!CanvasRecorder.supported()) throw new Error('このブラウザーは動画記録に対応していません。ChromeまたはEdgeをご利用ください。');
    const mimeType = ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(t => MediaRecorder.isTypeSupported(t));
    if (!mimeType) throw new Error('WebM動画に対応していません。');
    this.stream = canvas.captureStream(30); this.chunks = []; this.failure = null;
    try { this.recorder = new MediaRecorder(this.stream, { mimeType, videoBitsPerSecond: 8000000 }); }
    catch (error) { this.cleanup(); throw error; }
    this.result = new Promise((resolve, reject) => {
      this.recorder.ondataavailable = e => { if (e.data.size) this.chunks.push(e.data); };
      this.recorder.onerror = e => { this.failure = e.error || new Error('録画中にエラーが発生しました。'); if (this.recorder.state !== 'inactive') this.recorder.stop(); };
      this.recorder.onstop = () => { const failure = this.failure; const blob = new Blob(this.chunks, { type: mimeType }); this.cleanup(); if (failure) reject(failure); else if (!blob.size) reject(new Error('動画データが空です。')); else resolve(blob); };
    });
    this.result.catch(() => {});
    this.recorder.start(250); this.startedAt = performance.now();
    const track = this.stream.getVideoTracks()[0]; track.requestFrame?.();
    this.frameTimer = setInterval(() => track.requestFrame?.(), 1000 / 30);
  }
  cleanup() { clearInterval(this.frameTimer); this.stream?.getTracks().forEach(t => t.stop()); this.recorder = null; this.stream = null; this.chunks = []; }
  async stop() { if (!this.recorder) throw new Error('録画が開始されていません。'); const result = this.result; await new Promise(resolve => setTimeout(resolve, Math.max(0, 1200 - (performance.now() - this.startedAt)))); if (this.recorder && this.recorder.state !== 'inactive') this.recorder.stop(); return result; }
}

