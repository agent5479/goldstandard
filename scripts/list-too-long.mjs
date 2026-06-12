import { examQuestions } from '../src/data/examQuestions.ts';

for (let i = 0; i < examQuestions.length; i++) {
  const opts = examQuestions[i].options;
  const c = opts[0].length;
  opts.slice(1).forEach((o, j) => {
    if (o.length > c) {
      console.log(`#${i} wrong[${j + 1}] ${o.length} > correct ${c}`);
      console.log(' Q:', examQuestions[i].text.slice(0, 80));
      console.log(' C:', opts[0]);
      console.log(' W:', o);
      console.log('');
    }
  });
}
