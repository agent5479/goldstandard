import { examQuestions } from '../src/data/examQuestions.ts';

for (let i = 0; i < examQuestions.length; i++) {
  const opts = examQuestions[i].options;
  const c = opts[0].length;
  const w = opts.slice(1).map((o, j) => ({ j: j + 1, len: o.length, t: o }));
  const maxW = Math.max(...w.map((x) => x.len));
  const avg = w.reduce((a, b) => a + b.len, 0) / 3;
  if (maxW > c || c / avg >= 1.3 || c - maxW >= 15) {
    console.log(`#${i} [${examQuestions[i].topic}] ratio ${(c / avg).toFixed(2)} diff ${c - maxW}`);
    console.log(' Q:', examQuestions[i].text.slice(0, 90));
    opts.forEach((o, j) => console.log(`  ${j}: [${o.length}] ${o.slice(0, 100)}`));
    console.log('');
  }
}
