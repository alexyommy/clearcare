# CareConnect

A cross-platform low vision accessibility companion app for caregivers supporting elderly individuals.

Built for **SWEN 661 — User Interface Implementation** | Team 2 | Spring 2026

---

## Team

| Name | GitHub |
|------|--------|
| Alex Yom | [@alexyommy](https://github.com/alexyommy) |
| Maurice Hickey | [@moe-hickey](https://github.com/moe-hickey) |
| Gideon Sarpong | [@gsarpong1](https://github.com/gsarpong1) |

---

## Project Description

CareConnect helps professional and family caregivers manage care tasks, patient profiles, and schedules through an interface built from the ground up for low vision accessibility. Features include customizable vision profiles, medication reminders, care logging, and family communication.

---

## Team Charter

[Team Charter](docs/Team2_Charter_SWEN661.docx)

---

## Tech Stack

| Platform | Framework |
|----------|-----------|
| Mobile (iOS) | Flutter |
| Mobile (Android) | React Native + Expo |
| Desktop (macOS) | Electron |
| Web | React + Vite |

---

## App Description

CareConnect is a cross-platform low-vision accessibility companion app designed for caregivers supporting elderly individuals. The app helps caregivers manage care tasks, patient profiles, schedules, medication reminders, care logs, and family communication through an interface designed for low-vision accessibility.

The main UI/UX business need is that some CareConnect caregivers suffer from low vision or partial sight impairment. The app is customized to compensate for low vision by using larger readable text, high-contrast design, clear navigation, simple layouts, large touch targets, and accessibility-friendly screens.

---

## Prerequisites

Before cloning and running the project, make sure you have the following installed:

- [Flutter SDK](https://docs.flutter.dev/get-started/install) (3.41.9+)
- [Xcode](https://developer.apple.com/xcode/) (macOS — required for iOS simulator)
- [Android Studio](https://developer.android.com/studio) (optional, for Android emulator)
- [Node.js LTS](https://nodejs.org/) (for React Native / web implementations)

---

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/alexyommy/clearcare.git
cd clearcare
```

### 2. Verify Flutter installation

```bash
flutter doctor
```

### 3. Install dependencies

```bash
flutter pub get
```

### 4. Check available devices

```bash
flutter devices
```

### 5. Run the application

```bash
# Replace <device-id> with the ID from flutter devices
flutter run -d <device-id>

# Example — iOS simulator:
flutter run -d A4874996-A930-44F8-9366-D1BEFC841B52
```

---

## Demo Login Credentials

```
Email:    demo@careconnect.com
Password: demo123
```

> You can also register a new account from the Sign Up screen using any email and a password of 6+ characters.

---

## Running Tests

```bash
flutter test
```
## React Native Implementation

The React Native implementation is located in:

```bash
mobile/react-native/
```

### React Native Screens

#### 1. Login Screen
#### 2. Dashboard Screen
#### 3. Task List Screen
#### 4. Task Detail Screen
#### 5. Create/Edit Task Screen
#### 6. Calendar Screen
#### 7. Profile Screen
#### 8. Settings Screen

### React Native Setup

Navigate to the React Native directory:

```bash
cd mobile/react-native/ 
```

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npx expo start --ios
```

### Demo Login Credentials

```text
Email:    demo@careconnect.com
Password: demo123
```

### React Native Testing

Run the tests and generate coverage reports:

```bash
npm test -- --coverage
```

Coverage Results:

- 165 tests passing
- 87.72% line coverage
- Coverage requirement exceeded (60% required)

### Technologies Used
- React Native
- Expo
- Zustand 
- React Navigation
- Jest


---

## Generate Coverage HTML Report

```bash
# Run tests and collect coverage data
flutter test --coverage

# Generate the HTML report (requires lcov — install via: brew install lcov)
genhtml coverage/lcov.info -o coverage/html

# Open the report in your browser
open coverage/html/index.html
```

---

## Application Screens

### 1. Login Screen
Allows caregivers to securely sign in or register a new account using their email and password credentials. Includes inline validation and a demo account for quick access.

### 2. Dashboard Screen
Serves as the main hub of the application, showing a greeting, today's task summary with stat cards (pending/completed/total), a preview of upcoming tasks, and quick-access links to Calendar and Profile.

### 3. Task List Screen
Displays all caregiver tasks organized into Pending and Completed sections. Supports swipe-to-complete gestures with an undo option, and a floating action button to add new tasks.

### 4. Task Detail Screen
Provides full details of a selected task including title, scheduled time, location/patient, category, priority, and any notes. Supports marking complete/incomplete, editing, and deletion with a confirmation dialog.

### 5. Create/Edit Task Screen
A form screen used for both creating new tasks and editing existing ones. Includes fields for title, time, location, priority (Low/Medium/High), category dropdown, and optional notes — all with inline validation.

### 6. Calendar Screen
Displays a monthly calendar grid with event dot indicators, plus a scrollable list of upcoming caregiver events with color-coded categories.

### 7. Profile Screen
Shows the logged-in caregiver's name, email, role badge, and task completion stats. Supports inline name editing and includes a Sign Out button.

### 8. Settings Screen
Allows caregivers to customize the app: font size slider (18–32sp), high contrast toggle, dark mode toggle, push notification toggle, and reminder time preference. Also shows app version and course info.

---

## Accessibility Features

- Adjustable font size (18sp–32sp) via persistent accessibility toolbar on every screen
- High contrast mode — bold text, thick card borders, pure black/white surfaces
- Dark mode with theme-aware text and card colours
- Minimum 48×48dp touch targets on all interactive elements
- Semantic labels on all buttons and interactive widgets for screen reader support
- Live region error banners on forms
- WCAG 2.1 AA baseline contrast ratios
- Simple, uncluttered navigation with bottom tab bar

---

## Project Structure

```
lib/
  main.dart               # App entry point (ProviderScope + MaterialApp.router)
  router/
    app_router.dart       # go_router config with auth-guarded redirect
  models/
    task_model.dart       # CareTask, TaskPriority, TaskCategory + sample data
    user_model.dart       # AppUser
    app_settings.dart     # AppSettings (font size, contrast, dark mode)
  services/
    auth_service.dart     # Mock auth (in-memory, demo account pre-seeded)
    task_service.dart     # In-memory task CRUD
  state/
    auth_notifier.dart    # Riverpod StateNotifier for auth
    task_notifier.dart    # Riverpod StateNotifier for tasks
    settings_notifier.dart# Riverpod StateNotifier for settings
    providers.dart        # All provider declarations
  screens/                # 8 screens
  widgets/
    app_shell.dart        # Persistent bottom nav + accessibility toolbar
    task_card.dart        # Reusable task card widget

test/
  unit/                   # Unit tests: models, services, all 3 notifiers
  widget/                 # Widget tests: all 8 screens + TaskCard
```
