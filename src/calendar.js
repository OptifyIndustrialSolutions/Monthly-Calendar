import './style.css';
import './calendar.css';

function getWeekNumber(date) {
  // ISO week number, Monday as first day
  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
  const week1 = new Date(temp.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((temp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
}

function generateCalendar(year, month, showWeek = true) {
  // month: 0-based
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let html = '<table class="calendar-table">';
  html += '<thead><tr>';
  if (showWeek) html += '<th>Wk</th>';
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (const d of days) html += `<th>${d}</th>`;
  html += '</tr></thead><tbody>';

  let start = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  let date = 1 - start;
  while (date <= lastDay.getDate()) {
    html += '<tr>';
    const weekDate = new Date(year, month, date > 0 ? date : 1);
    if (showWeek) html += `<td class="week-number">${getWeekNumber(weekDate)}</td>`;
    for (let i = 0; i < 7; i++) {
      if (date > 0 && date <= lastDay.getDate()) {
        html += `<td>${date}</td>`;
      } else {
        html += '<td class="empty"></td>';
      }
      date++;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

function renderApp() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="calendar-title" id="calendar-title"></div>
    <div class="calendar-controls" id="calendar-controls">
      <label>Month:
        <select id="month-select">
          ${Array.from({length:12},(_,i)=>`<option value="${i}"${i===month?' selected':''}>${new Date(0,i).toLocaleString('default',{month:'long'})}</option>`).join('')}
        </select>
      </label>
      <label>Year:
        <input id="year-input" type="number" min="1900" max="2100" value="${year}" />
      </label>
      <button id="print-btn">Print Calendar</button>
    </div>
    <div id="calendar-container"></div>
  `;

  function updateCalendar() {
    const y = parseInt(document.getElementById('year-input').value, 10);
    const m = parseInt(document.getElementById('month-select').value, 10);
    const monthName = new Date(0, m).toLocaleString('default', { month: 'long' });
    document.getElementById('calendar-title').textContent = `${monthName} ${y}`;
    document.getElementById('calendar-container').innerHTML = generateCalendar(y, m, true);
  }

  document.getElementById('month-select').addEventListener('change', updateCalendar);
  document.getElementById('year-input').addEventListener('change', updateCalendar);
  document.getElementById('print-btn').addEventListener('click', () => window.print());

  updateCalendar();
}

renderApp();
