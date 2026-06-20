import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/providers.dart';

class CalendarScreen extends ConsumerWidget {
  const CalendarScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final fs = ref.watch(settingsProvider).fontSize;

    return Scaffold(
      appBar: AppBar(
        title: Text('Calendar',
            style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: fs)),
        backgroundColor: const Color(0xFF1A5276),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _MonthHeader(fontSize: fs),
          const SizedBox(height: 12),
          const _CalendarGrid(),
          const SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Semantics(
              header: true,
              child: Text(
                'Upcoming Events',
                style: TextStyle(
                    fontSize: fs + 2,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF1A5276)),
              ),
            ),
          ),
          ..._sampleEvents.map((e) => _EventTile(event: e, fontSize: fs)),
        ],
      ),
    );
  }
}

final List<Map<String, String>> _sampleEvents = [
  {
    'title': 'Morning medication round',
    'date': 'Mon, Jun 2',
    'time': '8:00 AM',
    'color': 'primary'
  },
  {
    'title': 'Team handoff meeting',
    'date': 'Mon, Jun 2',
    'time': '12:00 PM',
    'color': 'secondary'
  },
  {
    'title': 'Vitals check — Mary Johnson',
    'date': 'Tue, Jun 3',
    'time': '9:30 AM',
    'color': 'primary'
  },
  {
    'title': 'Physical therapy — Room 112',
    'date': 'Tue, Jun 3',
    'time': '11:00 AM',
    'color': 'accent'
  },
  {
    'title': 'Evening medication round',
    'date': 'Wed, Jun 4',
    'time': '6:00 PM',
    'color': 'primary'
  },
];

class _MonthHeader extends StatelessWidget {
  final double fontSize;
  const _MonthHeader({required this.fontSize});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        IconButton(
          icon: const Icon(Icons.chevron_left,
              size: 32, color: Color(0xFF1A5276)),
          onPressed: () {},
          tooltip: 'Previous month',
        ),
        Text(
          'June 2026',
          style: TextStyle(
              fontSize: fontSize + 2,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF1A5276)),
        ),
        IconButton(
          icon: const Icon(Icons.chevron_right,
              size: 32, color: Color(0xFF1A5276)),
          onPressed: () {},
          tooltip: 'Next month',
        ),
      ],
    );
  }
}

class _CalendarGrid extends StatelessWidget {
  const _CalendarGrid();

  @override
  Widget build(BuildContext context) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const startOffset = 1; // June 2026 starts on Monday
    const totalDays = 30;

    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: days
                  .map((d) => SizedBox(
                        width: 36,
                        child: Text(d,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Colors.grey)),
                      ))
                  .toList(),
            ),
            const SizedBox(height: 8),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate:
                  const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 7, childAspectRatio: 1),
              itemCount: startOffset + totalDays,
              itemBuilder: (context, index) {
                if (index < startOffset) return const SizedBox();
                final day = index - startOffset + 1;
                final isToday = day == 2;
                final hasEvent = [2, 3, 4, 9, 16].contains(day);
                return Semantics(
                  label: 'June $day${isToday ? ', today' : ''}${hasEvent ? ', has events' : ''}',
                  button: false,
                  child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: isToday
                          ? const BoxDecoration(
                              color: Color(0xFF1A5276),
                              shape: BoxShape.circle)
                          : null,
                      child: Center(
                        child: Text(
                          '$day',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: isToday
                                ? FontWeight.bold
                                : FontWeight.normal,
                            color: isToday
                                ? Colors.white
                                : const Color(0xFF0A0A0A),
                          ),
                        ),
                      ),
                    ),
                    if (hasEvent)
                      ExcludeSemantics(
                        child: Container(
                          width: 5,
                          height: 5,
                          decoration: const BoxDecoration(
                              color: Color(0xFF1E8449),
                              shape: BoxShape.circle),
                        ),
                      ),
                  ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _EventTile extends StatelessWidget {
  final Map<String, String> event;
  final double fontSize;
  const _EventTile({required this.event, required this.fontSize});

  Color get _dotColor {
    switch (event['color']) {
      case 'secondary':
        return const Color(0xFF1E8449);
      case 'accent':
        return const Color(0xFFD4AC0D);
      default:
        return const Color(0xFF1A5276);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: '${event['title']}, ${event['date']}, ${event['time']}',
      child: Card(
        margin: const EdgeInsets.only(bottom: 8),
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: ListTile(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          leading: ExcludeSemantics(
            child: Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                  color: _dotColor, shape: BoxShape.circle),
            ),
          ),
          title: Text(event['title']!,
              style: TextStyle(
                  fontSize: fontSize, fontWeight: FontWeight.w600)),
          subtitle: Text(
              '${event['date']}  •  ${event['time']}',
              style:
                  TextStyle(fontSize: fontSize - 2, color: Colors.grey[600])),
          trailing: ExcludeSemantics(
            child: const Icon(Icons.chevron_right, color: Colors.grey),
          ),
        ),
      ),
    );
  }
}
