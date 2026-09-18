/* Weekend 2026 – Åpta Camping. Program-UI. */
(function () {
  'use strict';

  var STORAGE_THEME = 'aapta26:theme';
  var el = function (sel, root) { return (root || document).querySelector(sel); };

  /* ---------- Hjelpere ---------- */

  function toDate(dateStr, timeStr) {
    var d = dateStr.split('-').map(Number);
    var t = timeStr.split(':').map(Number);
    return new Date(d[0], d[1] - 1, d[2], t[0], t[1], 0, 0);
  }

  // Bygger en flat liste med alle poster, med beregnet start og slutt.
  function buildSchedule() {
    var all = [];
    PROGRAM.forEach(function (day) {
      day.events.forEach(function (ev, i) {
        var next = day.events[i + 1];
        var start = toDate(day.date, ev.start);
        var end;
        if (ev.end) {
          end = toDate(day.date, ev.end);
        } else if (next) {
          end = toDate(day.date, next.start);
        } else {
          end = new Date(start.getTime() + 60 * 60 * 1000);
        }
        all.push({
          dayId: day.id,
          weekday: day.weekday,
          dateLabel: day.dateLabel,
          start: start,
          end: end,
          data: ev,
          id: day.id + '-' + ev.start.replace(':', '')
        });
      });
    });
    return all.sort(function (a, b) { return a.start - b.start; });
  }

  var SCHEDULE = buildSchedule();
  var FIRST = SCHEDULE[0];
  var LAST = SCHEDULE[SCHEDULE.length - 1];

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function fmtTime(date) { return pad(date.getHours()) + ':' + pad(date.getMinutes()); }

  /* ---------- Tema ---------- */

  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_THEME); } catch (e) { /* privat modus */ }
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(stored || (prefersDark ? 'dark' : 'light'));

    el('#themeToggle').addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
      try { localStorage.setItem(STORAGE_THEME, next); } catch (e) { /* ignorer */ }
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    el('.theme-toggle__icon').textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  /* ---------- Rendering ---------- */

  var state = { day: null, types: {} };

  function renderTabs() {
    var tabs = el('#dayTabs');
    var frag = document.createDocumentFragment();

    var makeTab = function (id, label, sub) {
      var b = document.createElement('button');
      b.className = 'tab';
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.dataset.day = id;
      b.innerHTML = label + (sub ? ' <small>' + sub + '</small>' : '');
      b.addEventListener('click', function () { selectDay(id); });
      return b;
    };

    frag.appendChild(makeTab('alle', 'Hele helgen', ''));
    PROGRAM.forEach(function (day) {
      frag.appendChild(makeTab(day.id, day.weekday, day.dateLabel.replace('september', 'sep')));
    });
    tabs.appendChild(frag);
  }

  function renderDays() {
    var host = el('#days');
    PROGRAM.forEach(function (day) {
      var section = document.createElement('section');
      section.className = 'day';
      section.id = 'dag-' + day.id;
      section.dataset.day = day.id;

      var head = document.createElement('div');
      head.className = 'day__head';
      head.innerHTML =
        '<h2>' + day.weekday + '</h2>' +
        '<span class="day__date">' + day.dateLabel + '</span>' +
        '<span class="day__count">' + day.events.length + ' poster</span>';
      section.appendChild(head);

      var list = document.createElement('ol');
      list.className = 'timeline';

      SCHEDULE.filter(function (s) { return s.dayId === day.id; }).forEach(function (slot) {
        list.appendChild(renderItem(slot));
      });

      section.appendChild(list);

      if (day.id === 'sondag') {
        var outro = document.createElement('p');
        outro.className = 'day__outro';
        outro.innerHTML = '<span aria-hidden="true">🚗</span> Hjemreise etter middag – god tur hjem!';
        section.appendChild(outro);
      }

      host.appendChild(section);
    });
  }

  function renderItem(slot) {
    var ev = slot.data;
    var type = EVENT_TYPES[ev.type] || { label: ev.type, icon: '•' };

    var li = document.createElement('li');
    li.className = 'item';
    li.id = slot.id;
    li.dataset.type = ev.type;

    var timeText = ev.end
      ? ev.start + '<small>– ' + ev.end + '</small>'
      : ev.start;

    li.innerHTML =
      '<div class="item__time">' + timeText + '</div>' +
      '<div class="item__marker"><span></span></div>' +
      '<div class="item__card">' +
        '<h3 class="item__title">' +
          '<span class="item__icon" aria-hidden="true">' + type.icon + '</span>' +
          '<span class="item__name">' + ev.title + '</span>' +
          '<span class="badge">' + type.label + '</span>' +
        '</h3>' +
        (ev.note ? '<p class="item__note">' + ev.note + '</p>' : '') +
      '</div>';

    return li;
  }

  function renderFilters() {
    var host = el('#typeFilters');
    var used = {};
    SCHEDULE.forEach(function (s) { used[s.data.type] = true; });

    Object.keys(EVENT_TYPES).filter(function (key) { return used[key]; }).forEach(function (key) {
      state.types[key] = true;
      var b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.dataset.type = key;
      b.setAttribute('aria-pressed', 'true');
      b.innerHTML = '<span aria-hidden="true">' + EVENT_TYPES[key].icon + '</span>' + EVENT_TYPES[key].label;
      b.addEventListener('click', function () {
        state.types[key] = !state.types[key];
        b.setAttribute('aria-pressed', String(state.types[key]));
        applyFilters();
      });
      host.appendChild(b);
    });
  }

  /* ---------- Interaksjon ---------- */

  function selectDay(id) {
    state.day = id;
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (tab) {
      tab.setAttribute('aria-selected', String(tab.dataset.day === id));
    });
    Array.prototype.forEach.call(document.querySelectorAll('.day'), function (section) {
      section.hidden = !(id === 'alle' || section.dataset.day === id);
    });
    applyFilters();
  }

  function applyFilters() {
    PROGRAM.forEach(function (day) {
      var section = el('#dag-' + day.id);
      var visible = 0;
      Array.prototype.forEach.call(section.querySelectorAll('.item'), function (item) {
        var show = state.types[item.dataset.type];
        item.hidden = !show;
        if (show) { visible++; }
      });
      el('.day__count', section).textContent =
        visible === day.events.length
          ? day.events.length + ' poster'
          : visible + ' av ' + day.events.length + ' poster';

      var empty = el('.day__empty', section);
      if (visible === 0 && !empty) {
        empty = document.createElement('p');
        empty.className = 'day__empty';
        empty.textContent = 'Ingen poster med de valgte typene denne dagen.';
        section.appendChild(empty);
      } else if (empty) {
        empty.hidden = visible !== 0;
      }
    });
  }

  /* ---------- Nå-status og nedtelling ---------- */

  function currentSlot(now) {
    for (var i = 0; i < SCHEDULE.length; i++) {
      if (now >= SCHEDULE[i].start && now < SCHEDULE[i].end) { return SCHEDULE[i]; }
    }
    return null;
  }

  function nextSlot(now) {
    for (var i = 0; i < SCHEDULE.length; i++) {
      if (SCHEDULE[i].start > now) { return SCHEDULE[i]; }
    }
    return null;
  }

  function relativeTime(from, to) {
    var mins = Math.round((to - from) / 60000);
    if (mins < 1) { return 'straks'; }
    if (mins < 60) { return 'om ' + mins + ' min'; }
    var hours = Math.floor(mins / 60);
    var rest = mins % 60;
    if (hours < 24) { return 'om ' + hours + ' t' + (rest ? ' ' + rest + ' min' : ''); }
    var days = Math.round(hours / 24);
    return 'om ' + days + ' ' + (days === 1 ? 'dag' : 'dager');
  }

  var highlighted = null;
  var lastSignature = null;

  function tick() {
    var now = new Date();
    updateStatus(now);
    updateCountdown(now);
  }

  function updateStatus(now) {
    var card = el('#statusCard');
    var title = el('#statusTitle');
    var sub = el('#statusSub');

    var current = currentSlot(now);
    var next = nextSlot(now);
    highlighted = current || next;

    // Marker om i DOM bare når noe faktisk har endret seg.
    var signature = (current ? current.id : '-') + '|' + (next ? next.id : '-');
    if (signature !== lastSignature) {
      lastSignature = signature;
      Array.prototype.forEach.call(document.querySelectorAll('.item'), function (item) {
        item.classList.remove('is-now', 'is-past');
        var old = el('.badge--now, .badge--next', item);
        if (old) { old.remove(); }
      });
      SCHEDULE.forEach(function (slot) {
        if (slot.end <= now) {
          var passed = el('#' + slot.id);
          if (passed) { passed.classList.add('is-past'); }
        }
      });
      if (current) { markItem(current, 'Nå', 'badge--now', 'is-now'); }
      else if (next) { markItem(next, 'Neste', 'badge--next', null); }
    }

    if (current) {
      card.classList.add('is-live');
      title.textContent = 'Nå: ' + current.data.title;
      sub.textContent = current.weekday + ' ' + fmtTime(current.start) +
        (next ? ' · Neste: ' + next.data.title + ' kl. ' + fmtTime(next.start) : '');
    } else if (next) {
      card.classList.remove('is-live');
      if (now < FIRST.start) {
        title.textContent = 'Weekenden starter ' + FIRST.weekday.toLowerCase() + ' kl. ' + fmtTime(FIRST.start);
        sub.textContent = 'Første post: ' + FIRST.data.title + ' – ' + relativeTime(now, FIRST.start);
      } else {
        title.textContent = 'Neste: ' + next.data.title;
        sub.textContent = next.weekday + ' kl. ' + fmtTime(next.start) + ' – ' + relativeTime(now, next.start);
      }
    } else {
      card.classList.remove('is-live');
      title.textContent = 'Weekenden er over';
      sub.textContent = 'Takk for helgen – vel hjem!';
    }
  }

  function markItem(slot, text, cls, itemCls) {
    var item = el('#' + slot.id);
    if (!item) { return; }
    if (itemCls) { item.classList.add(itemCls); }
    item.classList.remove('is-past');
    var badge = document.createElement('span');
    badge.className = 'badge ' + cls;
    badge.textContent = text;
    el('.item__title', item).appendChild(badge);
  }

  function updateCountdown(now) {
    var box = el('#countdown');
    var msg = el('#countdownMsg');
    var diff = FIRST.start - now;

    if (diff > 0) {
      box.hidden = false;
      var secs = Math.floor(diff / 1000);
      var parts = {
        days: Math.floor(secs / 86400),
        hours: Math.floor(secs / 3600) % 24,
        minutes: Math.floor(secs / 60) % 60,
        seconds: secs % 60
      };
      Object.keys(parts).forEach(function (key) {
        el('[data-cd="' + key + '"]').textContent = pad(parts[key]);
      });
      msg.textContent = '';
    } else {
      box.hidden = true;
      msg.textContent = now < LAST.end
        ? 'Weekenden er i gang – velkommen til Åpta!'
        : 'Takk for en flott weekend på Åpta!';
    }
  }

  /* ---------- Oppstart ---------- */

  function init() {
    initTheme();
    renderTabs();
    renderDays();
    renderFilters();

    // Åpne dagen vi er på, ellers hele helgen.
    var now = new Date();
    var today = PROGRAM.filter(function (day) {
      var d = toDate(day.date, '00:00');
      return now >= d && now < new Date(d.getTime() + 86400000);
    })[0];
    selectDay(today ? today.id : 'alle');

    el('#nowBtn').addEventListener('click', function () {
      if (!highlighted) {
        el('#program').scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (state.day !== 'alle' && state.day !== highlighted.dayId) {
        selectDay(highlighted.dayId);
      }
      if (!state.types[highlighted.data.type]) {
        state.types[highlighted.data.type] = true;
        var chip = el('.chip[data-type="' + highlighted.data.type + '"]');
        if (chip) { chip.setAttribute('aria-pressed', 'true'); }
        applyFilters();
      }
      var item = el('#' + highlighted.id);
      if (item) { item.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });

    tick();
    setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
