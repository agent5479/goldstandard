import fs from 'fs';
import { examQuestions } from '../src/data/examQuestions.ts';

const flagged = [];
for (let i = 0; i < examQuestions.length; i++) {
  const opts = examQuestions[i].options;
  const c = opts[0].length;
  const w = opts.slice(1).map((o) => o.length);
  const maxW = Math.max(...w);
  const avg = w.reduce((a, b) => a + b, 0) / 3;
  if (maxW > c || c / avg >= 1.25 || c - maxW >= 12) {
    flagged.push({ i, ratio: c / avg, diff: c - maxW, topic: examQuestions[i].topic });
  }
}
console.log('flagged', flagged.length);
flagged.forEach((f) => console.log(f.i, f.ratio.toFixed(2), f.diff, f.topic));
