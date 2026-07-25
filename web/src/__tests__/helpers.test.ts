import {
  getGreeting, formatTime, getCategoryColor, getCategoryLabel,
  getPriorityColor, getPriorityLabel, filterTasks,
} from '../utils/helpers';
import type { CareTask } from '../store/store';

describe('getGreeting', () => {
  it('returns Good morning before noon', () => {
    expect(getGreeting('Alex', new Date('2026-07-25T08:00:00'))).toBe('Good morning, Alex!');
  });
  it('returns Good afternoon from noon to 16:59', () => {
    expect(getGreeting('Alex', new Date('2026-07-25T13:00:00'))).toBe('Good afternoon, Alex!');
  });
  it('returns Good evening from 17:00', () => {
    expect(getGreeting('Alex', new Date('2026-07-25T19:00:00'))).toBe('Good evening, Alex!');
  });
});

describe('formatTime', () => {
  it('converts 08:00 to 8:00 AM', () => expect(formatTime('08:00')).toBe('8:00 AM'));
  it('converts 12:00 to 12:00 PM', () => expect(formatTime('12:00')).toBe('12:00 PM'));
  it('converts 00:30 to 12:30 AM', () => expect(formatTime('00:30')).toBe('12:30 AM'));
  it('converts 18:00 to 6:00 PM', () => expect(formatTime('18:00')).toBe('6:00 PM'));
  it('converts 23:59 to 11:59 PM', () => expect(formatTime('23:59')).toBe('11:59 PM'));
});

describe('category helpers', () => {
  const categories = ['medication', 'appointment', 'hygiene', 'nutrition', 'therapy', 'monitoring', 'other'] as const;
  it.each(categories)('getCategoryColor(%s) returns a hex color', (c) => {
    expect(getCategoryColor(c)).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
  it('getCategoryLabel capitalises', () => {
    expect(getCategoryLabel('medication')).toBe('Medication');
    expect(getCategoryLabel('other')).toBe('Other');
  });
});

describe('priority helpers', () => {
  it('returns distinct colors per priority', () => {
    expect(getPriorityColor('high')).not.toBe(getPriorityColor('low'));
    expect(getPriorityColor('medium')).toMatch(/^#/);
  });
  it('getPriorityLabel capitalises', () => {
    expect(getPriorityLabel('high')).toBe('High');
    expect(getPriorityLabel('low')).toBe('Low');
  });
});

describe('filterTasks', () => {
  const tasks: CareTask[] = [
    { id: '1', title: 'Morning medication', time: '08:00', room: 'Room 204', category: 'medication', priority: 'high', isCompleted: false },
    { id: '2', title: 'Vitals check', time: '09:00', room: 'Mary Johnson', category: 'monitoring', priority: 'medium', isCompleted: false },
  ];

  it('returns all tasks for empty query', () => {
    expect(filterTasks(tasks, '')).toHaveLength(2);
    expect(filterTasks(tasks, '   ')).toHaveLength(2);
  });
  it('matches by title, case-insensitive', () => {
    expect(filterTasks(tasks, 'MEDICATION')).toHaveLength(1);
  });
  it('matches by room/location', () => {
    expect(filterTasks(tasks, 'mary')).toHaveLength(1);
    expect(filterTasks(tasks, 'mary')[0].id).toBe('2');
  });
  it('returns empty array when nothing matches', () => {
    expect(filterTasks(tasks, 'zzz-nothing')).toHaveLength(0);
  });
});
