enum TaskPriority { low, medium, high }

enum TaskCategory {
  medication,
  vitals,
  therapy,
  dressing,
  monitoring,
  rounds,
  other,
}

class CareTask {
  final String id;
  final String title;
  final String time;
  final String room;
  final TaskPriority priority;
  final TaskCategory category;
  final bool isCompleted;
  final String? notes;

  const CareTask({
    required this.id,
    required this.title,
    required this.time,
    required this.room,
    this.priority = TaskPriority.medium,
    this.category = TaskCategory.other,
    this.isCompleted = false,
    this.notes,
  });

  CareTask copyWith({
    String? id,
    String? title,
    String? time,
    String? room,
    TaskPriority? priority,
    TaskCategory? category,
    bool? isCompleted,
    String? notes,
  }) =>
      CareTask(
        id: id ?? this.id,
        title: title ?? this.title,
        time: time ?? this.time,
        room: room ?? this.room,
        priority: priority ?? this.priority,
        category: category ?? this.category,
        isCompleted: isCompleted ?? this.isCompleted,
        notes: notes ?? this.notes,
      );

  @override
  bool operator ==(Object other) =>
      identical(this, other) || (other is CareTask && other.id == id);

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() => 'CareTask(id: $id, title: $title, room: $room)';
}

final List<CareTask> sampleTasks = [
  const CareTask(
    id: '1',
    title: 'Administer medication',
    time: '8:00 AM',
    room: 'Room 204',
    priority: TaskPriority.high,
    category: TaskCategory.medication,
    notes: 'Take with a full glass of water.',
  ),
  const CareTask(
    id: '2',
    title: 'Vitals check',
    time: '9:30 AM',
    room: 'Mary Johnson',
    priority: TaskPriority.high,
    category: TaskCategory.vitals,
  ),
  const CareTask(
    id: '3',
    title: 'Physical therapy session',
    time: '11:00 AM',
    room: 'Room 112',
    priority: TaskPriority.medium,
    category: TaskCategory.therapy,
    notes: '20 minutes of gentle movement.',
  ),
  const CareTask(
    id: '4',
    title: 'Wound dressing change',
    time: '1:00 PM',
    room: 'Room 308',
    priority: TaskPriority.high,
    category: TaskCategory.dressing,
  ),
  const CareTask(
    id: '5',
    title: 'Blood glucose monitoring',
    time: '2:30 PM',
    room: 'Robert Chen',
    priority: TaskPriority.medium,
    category: TaskCategory.monitoring,
  ),
  const CareTask(
    id: '6',
    title: 'Evening medication round',
    time: '6:00 PM',
    room: 'All rooms',
    priority: TaskPriority.high,
    category: TaskCategory.medication,
  ),
];
