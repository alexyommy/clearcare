import {
  getGreeting,
  formatDate,
  formatTime,
  getCurrentMonthYear,
  getPendingTasks,
  getCompletedTasks,
  getTasksByPatient,
  sortTasksByTime,
  getPriorityColor,
  getPriorityLabel,
  getCategoryColor,
  getCategoryLabel,
  validateEmail,
  validatePassword,
  validateTaskTitle,
} from '../../src/utils/helpers';
import { CareTask } from '../../src/types';
import { Colors } from '../../src/utils/theme';

// ─── Sample tasks ─────────────────────────────────────────────────────────────

const makeTask = (overrides: Partial<CareTask> = {}): CareTask => ({
  id: 't1',
  title: 'Test Task',
  time: '09:00',
  room: 'Room A',
  category: 'medication',
  priority: 'medium',
  isCompleted: false,
  createdAt: new Date().toISOString(),
  ...overrides,
});

// ─── getGreeting ──────────────────────────────────────────────────────────────

describe('getGreeting', () => {
  const RealDate = Date;

  afterEach(() => {
    global.Date = RealDate;
  });

  function mockHour(hour: number) {
    const MockDate = class extends RealDate {
      getHours() { return hour; }
    } as unknown as typeof Date;
    global.Date = MockDate;
  }

  it('returns "Good morning" for hour 7', () => {
    mockHour(7);
    expect(getGreeting('Alex')).toBe('Good morning, Alex!');
  });

  it('returns "Good afternoon" for hour 14', () => {
    mockHour(14);
    expect(getGreeting('Alex')).toBe('Good afternoon, Alex!');
  });

  it('returns "Good evening" for hour 19', () => {
    mockHour(19);
    expect(getGreeting('Alex')).toBe('Good evening, Alex!');
  });

  it('includes the provided name', () => {
    mockHour(8);
    expect(getGreeting('Margaret')).toContain('Margaret');
  });
});

// ─── formatTime ───────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('converts 08:00 to 8:00 AM', () => {
    expect(formatTime('08:00')).toBe('8:00 AM');
  });

  it('converts 12:00 to 12:00 PM', () => {
    expect(formatTime('12:00')).toBe('12:00 PM');
  });

  it('converts 14:30 to 2:30 PM', () => {
    expect(formatTime('14:30')).toBe('2:30 PM');
  });

  it('converts 00:00 to 12:00 AM', () => {
    expect(formatTime('00:00')).toBe('12:00 AM');
  });

  it('converts 23:59 to 11:59 PM', () => {
    expect(formatTime('23:59')).toBe('11:59 PM');
  });
});

// ─── formatDate ───────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('returns a non-empty string for a valid ISO date', () => {
    const result = formatDate('2026-06-09T00:00:00.000Z');
    expect(result.length).toBeGreaterThan(0);
  });

  it('contains the day number', () => {
    const result = formatDate('2026-06-09T00:00:00.000Z');
    expect(result).toMatch(/\d/);
  });
});

// ─── getCurrentMonthYear ──────────────────────────────────────────────────────

describe('getCurrentMonthYear', () => {
  it('returns a non-empty string', () => {
    expect(getCurrentMonthYear().length).toBeGreaterThan(0);
  });

  it('contains the current year', () => {
    expect(getCurrentMonthYear()).toContain(String(new Date().getFullYear()));
  });
});

// ─── getPendingTasks ──────────────────────────────────────────────────────────

describe('getPendingTasks', () => {
  it('returns only incomplete tasks', () => {
    const tasks = [
      makeTask({ id: 't1', isCompleted: false }),
      makeTask({ id: 't2', isCompleted: true }),
      makeTask({ id: 't3', isCompleted: false }),
    ];
    const result = getPendingTasks(tasks);
    expect(result).toHaveLength(2);
    expect(result.every((t) => !t.isCompleted)).toBe(true);
  });

  it('returns empty array when all tasks are completed', () => {
    const tasks = [makeTask({ isCompleted: true }), makeTask({ isCompleted: true })];
    expect(getPendingTasks(tasks)).toHaveLength(0);
  });

  it('returns all tasks when none are completed', () => {
    const tasks = [makeTask({ id: 't1' }), makeTask({ id: 't2' })];
    expect(getPendingTasks(tasks)).toHaveLength(2);
  });
});

// ─── getCompletedTasks ────────────────────────────────────────────────────────

describe('getCompletedTasks', () => {
  it('returns only completed tasks', () => {
    const tasks = [
      makeTask({ id: 't1', isCompleted: true }),
      makeTask({ id: 't2', isCompleted: false }),
    ];
    expect(getCompletedTasks(tasks)).toHaveLength(1);
    expect(getCompletedTasks(tasks)[0].id).toBe('t1');
  });

  it('returns empty array when no tasks are completed', () => {
    expect(getCompletedTasks([makeTask()])).toHaveLength(0);
  });
});

// ─── getTasksByPatient ────────────────────────────────────────────────────────

describe('getTasksByPatient', () => {
  it('returns only tasks matching patientId', () => {
    const tasks = [
      makeTask({ id: 't1', patientId: 'p1' }),
      makeTask({ id: 't2', patientId: 'p2' }),
      makeTask({ id: 't3', patientId: 'p1' }),
    ];
    const result = getTasksByPatient(tasks, 'p1');
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.patientId === 'p1')).toBe(true);
  });

  it('returns empty array for unknown patient', () => {
    expect(getTasksByPatient([makeTask({ patientId: 'p1' })], 'p99')).toHaveLength(0);
  });
});

// ─── sortTasksByTime ──────────────────────────────────────────────────────────

describe('sortTasksByTime', () => {
  it('sorts tasks in ascending time order', () => {
    const tasks = [
      makeTask({ id: 't3', time: '14:00' }),
      makeTask({ id: 't1', time: '08:00' }),
      makeTask({ id: 't2', time: '10:30' }),
    ];
    const sorted = sortTasksByTime(tasks);
    expect(sorted.map((t) => t.id)).toEqual(['t1', 't2', 't3']);
  });

  it('does not mutate the original array', () => {
    const tasks = [makeTask({ id: 't2', time: '14:00' }), makeTask({ id: 't1', time: '08:00' })];
    const original = [...tasks];
    sortTasksByTime(tasks);
    expect(tasks).toEqual(original);
  });
});

// ─── getPriorityColor ─────────────────────────────────────────────────────────

describe('getPriorityColor', () => {
  it('returns red for high priority', () => {
    expect(getPriorityColor('high')).toBe(Colors.priorityHigh);
  });

  it('returns orange/yellow for medium', () => {
    expect(getPriorityColor('medium')).toBe(Colors.priorityMedium);
  });

  it('returns green for low', () => {
    expect(getPriorityColor('low')).toBe(Colors.priorityLow);
  });
});

// ─── getPriorityLabel ─────────────────────────────────────────────────────────

describe('getPriorityLabel', () => {
  it('capitalises "high" to "High"', () => {
    expect(getPriorityLabel('high')).toBe('High');
  });
  it('capitalises "medium" to "Medium"', () => {
    expect(getPriorityLabel('medium')).toBe('Medium');
  });
  it('capitalises "low" to "Low"', () => {
    expect(getPriorityLabel('low')).toBe('Low');
  });
});

// ─── getCategoryColor ─────────────────────────────────────────────────────────

describe('getCategoryColor', () => {
  it('returns a valid hex color for each category', () => {
    const categories = ['medication', 'appointment', 'hygiene', 'nutrition', 'therapy', 'monitoring', 'other'] as const;
    categories.forEach((cat) => {
      const color = getCategoryColor(cat);
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

// ─── getCategoryLabel ─────────────────────────────────────────────────────────

describe('getCategoryLabel', () => {
  it('returns "Medication" for "medication"', () => {
    expect(getCategoryLabel('medication')).toBe('Medication');
  });
  it('returns "Appointment" for "appointment"', () => {
    expect(getCategoryLabel('appointment')).toBe('Appointment');
  });
  it('returns "Other" for "other"', () => {
    expect(getCategoryLabel('other')).toBe('Other');
  });
});

// ─── validateEmail ────────────────────────────────────────────────────────────

describe('validateEmail', () => {
  it('accepts a valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('demo@careconnect.com')).toBe(true);
  });

  it('rejects missing @ symbol', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('rejects email with spaces', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });
});

// ─── validatePassword ─────────────────────────────────────────────────────────

describe('validatePassword', () => {
  it('accepts password with 6+ characters', () => {
    expect(validatePassword('demo123')).toBe(true);
    expect(validatePassword('abc123')).toBe(true);
  });

  it('rejects password shorter than 6 characters', () => {
    expect(validatePassword('abc')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });

  it('accepts exactly 6 characters', () => {
    expect(validatePassword('abcdef')).toBe(true);
  });
});

// ─── validateTaskTitle ────────────────────────────────────────────────────────

describe('validateTaskTitle', () => {
  it('accepts a title with 2+ characters', () => {
    expect(validateTaskTitle('Morning medication')).toBe(true);
    expect(validateTaskTitle('AB')).toBe(true);
  });

  it('rejects empty or single character title', () => {
    expect(validateTaskTitle('')).toBe(false);
    expect(validateTaskTitle('A')).toBe(false);
  });

  it('trims whitespace before checking length', () => {
    expect(validateTaskTitle('  A  ')).toBe(false);
    expect(validateTaskTitle('  AB  ')).toBe(true);
  });
});
