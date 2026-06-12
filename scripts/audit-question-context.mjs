import { examQuestions } from '../src/data/examQuestions.ts';

const vague = [];
for (let i = 0; i < examQuestions.length; i++) {
  const q = examQuestions[i];
  const t = q.text;
  if (t.length < 45) vague.push({ i, len: t.length, text: t });
  if (/^What (is|does|are)\b/i.test(t) && t.length < 55) vague.push({ i, len: t.length, text: t, note: 'short what-question' });
  if (/^Which of these/i.test(t)) vague.push({ i, text: t, note: 'which of these' });
  if (/^The diagnostic|^How does "I don't care"/i.test(t)) vague.push({ i, text: t, note: 'already fixed?' });
}

console.log('Short/vague questions:', vague.length);
for (const v of vague.slice(0, 30)) console.log('#' + v.i, v.len || '', v.note || '', v.text);
