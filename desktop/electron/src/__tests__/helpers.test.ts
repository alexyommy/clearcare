import {
  getGreeting,
  formatTime,
  getPriorityColor,
  getCategoryColor,
  getCategoryLabel,
  getPriorityLabel,
} from '../renderer/utils/helpers';

// ── getGreeting ────────────────────────────────────────────────────────────────

describe('getGreeting', () => {
  const RealDate = Date;

  function mockHour(h: number) {
    jest.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length === 0) {
        const d = new RealDate();
        d.setHours(h, 0, 0, 0);
        return d;
      }
      return new RealDate(...(args as []));
    });
  }

  afterEach(() => jest.restoreAllMocks());

  it('returns Good morning before noon', () => {
    mockHour(8);
    expect(getGreeting('Alex')).toBe('Good morning, Alex!');
  });

  it('returns Good afternoon at noon to 16:59', () => {
    mockHour(13);
    expect(getGreeting('Alex')).toBe('Good afternoon, Alex!');
  });

  it('returns Good evening at 17:00+', () => {
    mockHour(19);
    expect(getGreeting('Alex')).toBe('Good evening, Alex!');
  });
});

// ── formatTime ─────────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('converts 08:00 to 8:00 AM', () => expect(formatTime('08:00')).toBe('8:00 AM'));
  it('converts 12:00 to 12:00 PM', () => expect(formatTime('12:00')).toBe('12:00 PM'));
  it('converts 00:00 to 12:00 AM', () => expect(formatTime('00:00')).toBe('12:00 AM'));
  it('converts 13:30 to 1:30 PM', () => expect(formatTime('13:30')).toBe('1:30 PM'));
  it('converts 23:59 to 11:59 PM', () => expect(formatTime('23:59')).toBe('11:59 PM'));
  it('converts 17:00 to 5:00 PM', () => expect(formatTime('17:00')).toBe('5:00 PM'));
});

// ── getPriorityColor ───────────────────────────────────────────────────────────

describe('getPriorityColor', () => {
  it('returns a string for high', () => expect(typeof getPriorityColor('high')).toBe('string'));
  it('returns a string for medium', () => expect(typeof getPriorityColor('medium')).toBe('string'));
  it('returns a string for low', () => expect(typeof getPriorityColor('low')).toBe('string'));
  it('high differs from low', () => expect(getPriorityColor('high')).not.toBe(getPriorityColor('low')));
});

// ── getCategoryColor ───────────────────────────────────────────────────────────

describe('getCategoryColor', () => {
  const categories = ['medication', 'appointment', 'hygiene', 'nutrition', 'therapy', 'monitoring', 'other'] as const;
  it.each(categories)('returns a hex color for %s', (cat) => {
    expect(getCategoryColor(cat)).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});

// ── getCategoryLabel ───────────────────────────────────────────────────────────

describe('getCategoryLabel', () => {
  it('capitalises medication', () => expect(getCategoryLabel('medication')).toBe('Medication'));
  it('capitalises appointment', () => expect(getCategoryLabel('appointment')).toBe('Appointment'));
  it('capitalises other', () => expect(getCategoryLabel('other')).toBe('Other'));
});

// ── getPriorityLabel ───────────────────────────────────────────────────────────

describe('getPriorityLabel', () => {
  it('capitalises high', () => expect(getPriorityLabel('high')).toBe('High'));
  it('capitalises medium', () => expect(getPriorityLabel('medium')).toBe('Medium'));
  it('capitalises low', () => expect(getPriorityLabel('low')).toBe('Low'));
});
