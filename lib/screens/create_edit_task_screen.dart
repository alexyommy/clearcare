import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../models/task_model.dart';
import '../state/providers.dart';

class CreateEditTaskScreen extends ConsumerStatefulWidget {
  /// Null = create mode; non-null = edit mode
  final String? taskId;
  const CreateEditTaskScreen({super.key, this.taskId});

  @override
  ConsumerState<CreateEditTaskScreen> createState() =>
      _CreateEditTaskScreenState();
}

class _CreateEditTaskScreenState
    extends ConsumerState<CreateEditTaskScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _timeCtrl = TextEditingController();
  final _roomCtrl = TextEditingController();
  final _notesCtrl = TextEditingController();

  TaskPriority _priority = TaskPriority.medium;
  TaskCategory _category = TaskCategory.other;

  bool get _isEdit => widget.taskId != null;

  static const _primary = Color(0xFF1A5276);

  @override
  void initState() {
    super.initState();
    if (_isEdit) {
      final tasks = ref.read(taskProvider);
      final task = tasks.cast<CareTask?>().firstWhere(
            (t) => t?.id == widget.taskId,
            orElse: () => null,
          );
      if (task != null) {
        _titleCtrl.text = task.title;
        _timeCtrl.text = task.time;
        _roomCtrl.text = task.room;
        _notesCtrl.text = task.notes ?? '';
        _priority = task.priority;
        _category = task.category;
      }
    }
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _timeCtrl.dispose();
    _roomCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }

  void _save() {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    if (_isEdit) {
      final tasks = ref.read(taskProvider);
      final existing = tasks.cast<CareTask?>().firstWhere(
            (t) => t?.id == widget.taskId,
            orElse: () => null,
          );
      if (existing != null) {
        ref.read(taskProvider.notifier).updateTask(
              existing.copyWith(
                title: _titleCtrl.text.trim(),
                time: _timeCtrl.text.trim(),
                room: _roomCtrl.text.trim(),
                notes: _notesCtrl.text.trim().isEmpty
                    ? null
                    : _notesCtrl.text.trim(),
                priority: _priority,
                category: _category,
              ),
            );
      }
      context.go('/tasks/${widget.taskId}');
    } else {
      final newTask = CareTask(
        id: 'task_${DateTime.now().millisecondsSinceEpoch}',
        title: _titleCtrl.text.trim(),
        time: _timeCtrl.text.trim(),
        room: _roomCtrl.text.trim(),
        notes: _notesCtrl.text.trim().isEmpty ? null : _notesCtrl.text.trim(),
        priority: _priority,
        category: _category,
      );
      ref.read(taskProvider.notifier).addTask(newTask);
      context.go('/tasks');
    }
  }

  @override
  Widget build(BuildContext context) {
    final fs = ref.watch(settingsProvider).fontSize;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _isEdit ? 'Edit Task' : 'New Task',
          style: TextStyle(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: fs),
        ),
        backgroundColor: _primary,
        leading: BackButton(
          color: Colors.white,
          onPressed: () => _isEdit
              ? context.go('/tasks/${widget.taskId}')
              : context.go('/tasks'),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Title
              _buildLabel('Task Title *', fs),
              TextFormField(
                controller: _titleCtrl,
                style: TextStyle(fontSize: fs),
                decoration: _inputDecoration('e.g. Administer medication', fs),
                validator: (v) => (v == null || v.trim().isEmpty)
                    ? 'Title is required'
                    : null,
                textCapitalization: TextCapitalization.sentences,
              ),
              const SizedBox(height: 20),

              // Time
              _buildLabel('Scheduled Time *', fs),
              TextFormField(
                controller: _timeCtrl,
                style: TextStyle(fontSize: fs),
                decoration: _inputDecoration('e.g. 8:00 AM', fs),
                validator: (v) => (v == null || v.trim().isEmpty)
                    ? 'Time is required'
                    : null,
              ),
              const SizedBox(height: 20),

              // Room / Patient
              _buildLabel('Location / Patient *', fs),
              TextFormField(
                controller: _roomCtrl,
                style: TextStyle(fontSize: fs),
                decoration: _inputDecoration('e.g. Room 204 or Mary Johnson', fs),
                validator: (v) => (v == null || v.trim().isEmpty)
                    ? 'Location is required'
                    : null,
                textCapitalization: TextCapitalization.words,
              ),
              const SizedBox(height: 20),

              // Priority
              _buildLabel('Priority', fs),
              _SegmentedRow<TaskPriority>(
                values: TaskPriority.values,
                selected: _priority,
                label: (p) => p.name[0].toUpperCase() + p.name.substring(1),
                onChanged: (p) => setState(() => _priority = p),
                fontSize: fs,
              ),
              const SizedBox(height: 20),

              // Category
              _buildLabel('Category', fs),
              DropdownButtonFormField<TaskCategory>(
                initialValue: _category,
                style: TextStyle(fontSize: fs, color: const Color(0xFF0A0A0A)),
                decoration: _inputDecoration('', fs),
                items: TaskCategory.values
                    .map((c) => DropdownMenuItem(
                          value: c,
                          child: Text(_categoryLabel(c)),
                        ))
                    .toList(),
                onChanged: (v) {
                  if (v != null) setState(() => _category = v);
                },
              ),
              const SizedBox(height: 20),

              // Notes
              _buildLabel('Notes (optional)', fs),
              TextFormField(
                controller: _notesCtrl,
                style: TextStyle(fontSize: fs),
                decoration: _inputDecoration('Any additional instructions…', fs),
                maxLines: 3,
                textCapitalization: TextCapitalization.sentences,
              ),
              const SizedBox(height: 32),

              // Save button
              SizedBox(
                height: 52,
                child: ElevatedButton(
                  onPressed: _save,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: Text(
                    _isEdit ? 'Save Changes' : 'Create Task',
                    style: TextStyle(
                        fontSize: fs, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text, double fontSize) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Text(text,
            style: TextStyle(
                fontSize: fontSize - 2,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF1A5276))),
      );

  InputDecoration _inputDecoration(String hint, double fs) => InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(fontSize: fs - 2),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: _primary, width: 2),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      );

  String _categoryLabel(TaskCategory c) {
    const labels = {
      TaskCategory.medication: 'Medication',
      TaskCategory.vitals: 'Vitals',
      TaskCategory.therapy: 'Therapy',
      TaskCategory.dressing: 'Dressing',
      TaskCategory.monitoring: 'Monitoring',
      TaskCategory.rounds: 'Rounds',
      TaskCategory.other: 'Other',
    };
    return labels[c] ?? 'Other';
  }
}

class _SegmentedRow<T> extends StatelessWidget {
  final List<T> values;
  final T selected;
  final String Function(T) label;
  final ValueChanged<T> onChanged;
  final double fontSize;

  const _SegmentedRow({
    required this.values,
    required this.selected,
    required this.label,
    required this.onChanged,
    required this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: values.map((v) {
        final isSelected = v == selected;
        return Expanded(
          child: GestureDetector(
            onTap: () => onChanged(v),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 150),
              margin: const EdgeInsets.only(right: 6),
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: isSelected
                    ? const Color(0xFF1A5276)
                    : Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                    color: isSelected
                        ? const Color(0xFF1A5276)
                        : Colors.grey[300]!),
              ),
              child: Text(
                label(v),
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: fontSize - 2,
                  fontWeight: FontWeight.w600,
                  color: isSelected ? Colors.white : Colors.grey[700],
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
