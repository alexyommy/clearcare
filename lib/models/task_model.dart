class CareTask {
  final String id;
  final String title;
  final String time;
  final String room;
  bool isCompleted;

  CareTask({
    required this.id,
    required this.title,
    required this.time,
    required this.room,
    this.isCompleted = false,
  });
}

final List<CareTask> sampleTasks = [
  CareTask(id: '1', title: 'Administer medication', time: '8:00 AM', room: 'Room 204'),
  CareTask(id: '2', title: 'Vitals check', time: '9:30 AM', room: 'Mary Johnson'),
  CareTask(id: '3', title: 'Physical therapy session', time: '11:00 AM', room: 'Room 112'),
  CareTask(id: '4', title: 'Wound dressing change', time: '1:00 PM', room: 'Room 308'),
  CareTask(id: '5', title: 'Blood glucose monitoring', time: '2:30 PM', room: 'Robert Chen'),
  CareTask(id: '6', title: 'Evening medication round', time: '6:00 PM', room: 'All rooms'),
];
