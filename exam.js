/* ============================================================
   Gold Standard Dog Training — exam engine
   Tracks: owner (breed-tuned, 20 Qs) / trainer (full bank, 40 Qs)
   Results are scored on screen only — nothing stored or sent.
   ============================================================ */

(function () {
  'use strict';

  const PASS_MARK = 0.8;
  const OWNER_UNIVERSAL = 15;
  const OWNER_BREED = 5;
  const TRAINER_TOTAL = 40;
  const TRAINER_PER_CATEGORY = 2;
  const TRAINER_ADVANCED = 10;

  const els = {
    start: document.getElementById('exam-start'),
    breed: document.getElementById('exam-breed'),
    quiz: document.getElementById('exam-quiz'),
    results: document.getElementById('exam-results'),
    breedInput: document.getElementById('breed-search-input'),
    breedResults: document.getElementById('breed-search-results'),
    categoryCards: document.getElementById('exam-category-cards'),
    context: document.getElementById('exam-quiz-context'),
    counter: document.getElementById('exam-quiz-counter'),
    progress: document.getElementById('exam-progress'),
    progressFill: document.getElementById('exam-progress-fill'),
    topic: document.getElementById('exam-question-topic'),
    questionText: document.getElementById('exam-question-text'),
    options: document.getElementById('exam-options'),
    nextBtn: document.getElementById('exam-next-btn'),
    scoreLabel: document.getElementById('exam-score-label'),
    scoreNumber: document.getElementById('exam-score-number'),
    scoreMessage: document.getElementById('exam-score-message'),
    breakdownList: document.getElementById('exam-breakdown-list'),
    review: document.getElementById('exam-review'),
    reviewList: document.getElementById('exam-review-list'),
    feedback: document.getElementById('exam-feedback'),
    feedbackQuestion: document.getElementById('exam-feedback-question'),
    feedbackYours: document.getElementById('exam-feedback-yours'),
    feedbackRight: document.getElementById('exam-feedback-right'),
    feedbackWhy: document.getElementById('exam-feedback-why'),
    feedbackLink: document.getElementById('exam-feedback-link'),
    feedbackContinue: document.getElementById('exam-feedback-continue')
  };

  const state = {
    track: null,
    breedName: null,
    categoryKey: null,
    questions: [],
    index: 0,
    selected: null,
    answers: []
  };

  /* ── helpers ── */

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function sample(arr, n) {
    return shuffle(arr).slice(0, n);
  }

  function showStep(step) {
    [els.start, els.breed, els.quiz, els.results].forEach(function (el) {
      el.hidden = el !== step;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* Source options always list the correct answer first; shuffle for play. */
  function prepareQuestion(q) {
    const order = shuffle(q.options.map(function (_, i) { return i; }));
    return {
      source: q,
      options: order.map(function (i) { return q.options[i]; }),
      correctIndex: order.indexOf(0)
    };
  }

  /* ── question selection ── */

  function buildOwnerExam(categoryKey) {
    const universal = GSDT_QUESTIONS.filter(function (q) {
      return q.breedCategory === 'all' && q.track === 'both';
    });
    const breedSpecific = GSDT_QUESTIONS.filter(function (q) {
      return q.breedCategory === categoryKey;
    });
    return shuffle(
      sample(universal, OWNER_UNIVERSAL).concat(sample(breedSpecific, OWNER_BREED))
    ).map(prepareQuestion);
  }

  function buildTrainerExam() {
    const categories = Object.keys(GSDT_BREED_CATEGORIES);
    let picked = [];
    categories.forEach(function (key) {
      picked = picked.concat(sample(
        GSDT_QUESTIONS.filter(function (q) { return q.breedCategory === key; }),
        TRAINER_PER_CATEGORY
      ));
    });
    picked = picked.concat(sample(
      GSDT_QUESTIONS.filter(function (q) { return q.track === 'trainer'; }),
      TRAINER_ADVANCED
    ));
    const universal = GSDT_QUESTIONS.filter(function (q) {
      return q.breedCategory === 'all' && q.track === 'both';
    });
    picked = picked.concat(sample(universal, TRAINER_TOTAL - picked.length));
    return shuffle(picked).map(prepareQuestion);
  }

  /* ── flow ── */

  function startExam(track, categoryKey, breedName) {
    state.track = track;
    state.categoryKey = categoryKey || null;
    state.breedName = breedName || null;
    state.questions = track === 'owner' ? buildOwnerExam(categoryKey) : buildTrainerExam();
    state.index = 0;
    state.answers = [];
    state.selected = null;

    if (track === 'owner') {
      const catLabel = GSDT_BREED_CATEGORIES[categoryKey].label;
      els.context.textContent = '🏡 Owner Exam — ' + (breedName ? breedName + ' (' + catLabel + ')' : catLabel);
    } else {
      els.context.textContent = '🥇 Trainer Exam — full question bank';
    }

    renderQuestion();
    showStep(els.quiz);
  }

  function renderQuestion() {
    const q = state.questions[state.index];
    const total = state.questions.length;
    state.selected = null;

    els.counter.textContent = 'Question ' + (state.index + 1) + ' of ' + total;
    const pct = Math.round((state.index / total) * 100);
    els.progressFill.style.width = pct + '%';
    els.progress.setAttribute('aria-valuenow', String(pct));

    els.topic.textContent = q.source.topic;
    els.questionText.textContent = q.source.text;
    els.nextBtn.disabled = true;
    els.nextBtn.textContent = state.index === total - 1 ? 'See results →' : 'Next question →';

    els.options.innerHTML = '';
    q.options.forEach(function (opt, i) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'exam-option';
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = '<span class="exam-option-key">' + String.fromCharCode(65 + i) + '</span><span class="exam-option-text"></span>';
      btn.querySelector('.exam-option-text').textContent = opt;
      btn.addEventListener('click', function () { selectOption(i); });
      els.options.appendChild(btn);
    });
  }

  function selectOption(i) {
    state.selected = i;
    Array.prototype.forEach.call(els.options.children, function (btn, idx) {
      btn.classList.toggle('is-selected', idx === i);
      btn.setAttribute('aria-pressed', idx === i ? 'true' : 'false');
    });
    els.nextBtn.disabled = false;
  }

  function nextQuestion() {
    if (state.selected === null) return;
    const q = state.questions[state.index];
    const correct = state.selected === q.correctIndex;
    state.answers.push({
      question: q,
      selected: state.selected,
      correct: correct
    });
    if (correct) {
      advance();
    } else {
      showFeedback(q, state.selected);
    }
  }

  function advance() {
    if (state.index < state.questions.length - 1) {
      state.index += 1;
      renderQuestion();
    } else {
      renderResults();
    }
  }

  /* ── educational feedback popup ── */

  function showFeedback(q, selected) {
    els.feedbackQuestion.textContent = q.source.text;
    els.feedbackYours.textContent = q.options[selected];
    els.feedbackRight.textContent = q.options[q.correctIndex];
    els.feedbackWhy.textContent = q.source.explanation;
    els.feedbackLink.href = 'guide.html' + q.source.guideLink;

    // Reveal the right answer on the card behind the popup as well
    Array.prototype.forEach.call(els.options.children, function (btn, idx) {
      btn.classList.toggle('is-correct', idx === q.correctIndex);
      btn.classList.toggle('is-wrong', idx === selected);
      btn.disabled = true;
    });

    els.feedback.hidden = false;
    document.body.classList.add('exam-feedback-open');
    els.feedbackContinue.focus();
  }

  function closeFeedback() {
    els.feedback.hidden = true;
    document.body.classList.remove('exam-feedback-open');
    advance();
  }

  /* ── results ── */

  function renderResults() {
    const total = state.answers.length;
    const correct = state.answers.filter(function (a) { return a.correct; }).length;
    const ratio = correct / total;
    const passed = ratio >= PASS_MARK;

    els.scoreLabel.textContent = state.track === 'owner'
      ? '🏡 Owner Exam' + (state.breedName ? ' — ' + state.breedName : '')
      : '🥇 Trainer Exam';
    els.scoreNumber.textContent = correct + ' / ' + total + ' (' + Math.round(ratio * 100) + '%)';

    if (passed) {
      els.scoreMessage.textContent = state.track === 'owner'
        ? '✅ Passed. You know the method — now hold the standard every day. Relentlessness is not harshness; it is clarity, repeated until it lands.'
        : '✅ Passed. You can read the dog in front of you and calibrate the hand to match — the heart of the Gold Standard method.';
    } else {
      els.scoreMessage.textContent = '📖 Not yet — the pass mark is ' + Math.round(PASS_MARK * 100) + '%. Review the explanations below, revisit the guide sections, and retake when ready. Consolidation takes as long as it takes.';
    }
    els.scoreNumber.classList.toggle('is-pass', passed);
    els.scoreNumber.classList.toggle('is-fail', !passed);

    // Topic breakdown
    const topics = {};
    state.answers.forEach(function (a) {
      const t = a.question.source.topic;
      if (!topics[t]) topics[t] = { correct: 0, total: 0 };
      topics[t].total += 1;
      if (a.correct) topics[t].correct += 1;
    });
    els.breakdownList.innerHTML = '';
    Object.keys(topics).forEach(function (t) {
      const li = document.createElement('li');
      const stat = topics[t];
      const pct = Math.round((stat.correct / stat.total) * 100);
      li.innerHTML = '<span class="exam-breakdown-topic"></span>' +
        '<span class="exam-breakdown-bar"><span class="exam-breakdown-bar-fill" style="width:' + pct + '%"></span></span>' +
        '<span class="exam-breakdown-score">' + stat.correct + '/' + stat.total + '</span>';
      li.querySelector('.exam-breakdown-topic').textContent = t;
      els.breakdownList.appendChild(li);
    });

    // Wrong-answer review
    const wrong = state.answers.filter(function (a) { return !a.correct; });
    els.reviewList.innerHTML = '';
    if (wrong.length === 0) {
      els.review.querySelector('h3').textContent = '🌟 Nothing to review';
      const p = document.createElement('p');
      p.className = 'exam-review-perfect';
      p.textContent = 'A clean sheet — every answer correct.';
      els.reviewList.appendChild(p);
    } else {
      els.review.querySelector('h3').textContent = '📖 Review what you missed (' + wrong.length + ')';
      wrong.forEach(function (a) {
        const q = a.question;
        const details = document.createElement('details');
        details.className = 'exam-review-item';
        const summary = document.createElement('summary');
        summary.textContent = q.source.text;
        details.appendChild(summary);

        const body = document.createElement('div');
        body.className = 'exam-review-body';

        const yours = document.createElement('p');
        yours.className = 'exam-review-yours';
        yours.innerHTML = '<strong>Your answer:</strong> ';
        yours.appendChild(document.createTextNode(q.options[a.selected]));
        body.appendChild(yours);

        const right = document.createElement('p');
        right.className = 'exam-review-correct';
        right.innerHTML = '<strong>Correct answer:</strong> ';
        right.appendChild(document.createTextNode(q.options[q.correctIndex]));
        body.appendChild(right);

        const why = document.createElement('p');
        why.className = 'exam-review-why';
        why.textContent = q.source.explanation;
        body.appendChild(why);

        const link = document.createElement('a');
        link.className = 'exam-review-link';
        link.href = 'guide.html' + q.source.guideLink;
        link.textContent = 'Read this section of the guide →';
        body.appendChild(link);

        details.appendChild(body);
        els.reviewList.appendChild(details);
      });
    }

    showStep(els.results);
  }

  /* ── breed picker ── */

  function renderCategoryCards() {
    els.categoryCards.innerHTML = '';
    Object.keys(GSDT_BREED_CATEGORIES).forEach(function (key) {
      const cat = GSDT_BREED_CATEGORIES[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'exam-category-card';
      btn.innerHTML = '<span class="exam-category-label"></span><span class="exam-category-note"></span>';
      btn.querySelector('.exam-category-label').textContent = cat.label;
      btn.querySelector('.exam-category-note').textContent = cat.note;
      btn.addEventListener('click', function () { startExam('owner', key, null); });
      els.categoryCards.appendChild(btn);
    });
  }

  function filterBreeds(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return GSDT_BREEDS.filter(function (b) {
      return b.name.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);
  }

  function renderBreedResults(matches) {
    els.breedResults.innerHTML = '';
    if (matches.length === 0) {
      els.breedResults.hidden = true;
      els.breedInput.setAttribute('aria-expanded', 'false');
      return;
    }
    matches.forEach(function (b) {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'exam-breed-result';
      btn.innerHTML = '<span class="exam-breed-name"></span><span class="exam-breed-cat"></span>';
      btn.querySelector('.exam-breed-name').textContent = b.name;
      btn.querySelector('.exam-breed-cat').textContent = GSDT_BREED_CATEGORIES[b.category].label;
      btn.addEventListener('click', function () { startExam('owner', b.category, b.name); });
      li.appendChild(btn);
      els.breedResults.appendChild(li);
    });
    els.breedResults.hidden = false;
    els.breedInput.setAttribute('aria-expanded', 'true');
  }

  /* ── wiring ── */

  document.querySelectorAll('.exam-track-card').forEach(function (card) {
    card.addEventListener('click', function () {
      if (card.dataset.track === 'trainer') {
        startExam('trainer', null, null);
      } else {
        els.breedInput.value = '';
        renderBreedResults([]);
        showStep(els.breed);
        els.breedInput.focus();
      }
    });
  });

  els.breedInput.addEventListener('input', function () {
    renderBreedResults(filterBreeds(els.breedInput.value));
  });

  els.breedInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const matches = filterBreeds(els.breedInput.value);
      if (matches.length > 0) startExam('owner', matches[0].category, matches[0].name);
    }
  });

  els.nextBtn.addEventListener('click', nextQuestion);

  els.feedbackContinue.addEventListener('click', closeFeedback);

  els.feedback.addEventListener('click', function (e) {
    if (e.target === els.feedback) closeFeedback();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !els.feedback.hidden) closeFeedback();
  });

  document.querySelectorAll('[data-action="back-to-start"], [data-action="quit"]').forEach(function (btn) {
    btn.addEventListener('click', function () { showStep(els.start); });
  });

  document.querySelectorAll('[data-action="retake"]').forEach(function (btn) {
    btn.addEventListener('click', function () { showStep(els.start); });
  });

  renderCategoryCards();
})();
