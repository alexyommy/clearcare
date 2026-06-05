class AppUser {
  final String id;
  final String name;
  final String email;

  const AppUser({
    required this.id,
    required this.name,
    required this.email,
  });

  AppUser copyWith({String? name, String? email}) => AppUser(
        id: id,
        name: name ?? this.name,
        email: email ?? this.email,
      );

  @override
  bool operator ==(Object other) =>
      identical(this, other) || (other is AppUser && other.id == id);

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() => 'AppUser(id: $id, name: $name, email: $email)';
}
