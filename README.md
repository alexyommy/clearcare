# ClearCare

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

ClearCare helps professional and family caregivers manage care tasks, patient profiles, and schedules through an interface built from the ground up for low vision accessibility. Features include customizable vision profiles, medication reminders, care logging, and family communication.

---

## Team Charter

[Team Charter](docs/Team2_Charter_SWEN661.docx)

---

## Tech Stack

| Platform | Framework |
|----------|-----------|
| Mobile (Android) | Flutter |
| Mobile (iOS) | React Native + Expo |
| Desktop (macOS) | Electron |
| Web | React + Vite |

---

## App Description

ClearCare is a cross-platform low-vision accessibility companion app designed for caregivers supporting elderly individuals. The app helps caregivers manage care tasks, patient profiles, schedules, medication reminders, care logs, and family communication through an interface designed for low-vision accessibility.

The main UI/UX business need is that some CareConnect/ClearCare caregivers suffer from low vision or partial sight impairment. The app is customized to compensate for low vision by using larger readable text, high-contrast design, clear navigation, simple layouts, large touch targets, and accessibility-friendly screens.


## Setup Instructions


### Clone the repo
```bash
git clone https://github.com/alexyommy/clearcare.git
cd clearcare
```


### Verify Flutter Installation

```bash
flutter doctor
```

### Install Dependencies

```bash
flutter pub get
```

### Run the Application

```
flutter run
```

## Login Credentials

```text
Email: jane.smith@careconnect.org
Password: ***********************
```

### Check Available Devices

``` bash
flutter devices
```

### Run Tests

``` bash
flutter test
```

## Generate Coverage HTML Report

``` bash
flutter test --coverage
genhtml coverage/lcon.info -o coverage/html
```

### Generate Coverage Report

```
flutter test --coverage
```

## Application Screens

### 1. Login Screen
Allows caregivers to securely sign in to the ClearCare application using their email and password credentials.
### 2. Profile Screen
Displays caregiver profile information, including personal details, contact information, and account preferences.
### 3. Dashboard Screen
Serves as the main navigation hub of the application, providing quick access to task, calendar events, settings, and other caregiver tools.
### 4. Create/Edit Task Screen
Allows caregivers to create new care task, update existing tasks, set due dates, assign priorities, and manage task details.
### 5. Task List Screen
Displays all caregiver tasks in an organized list, allowing users to quickly view task status, priorities, and due date.
### 6. Task Detail Screen
Provides detailed information about a selected task, including descriptions, deadlines, completion status, and additional notes.
### 7. Calendar Screen
Displays scheduled appointments, caregiving activities, and important dates in a calendar view to help caregivers manage their schedules.
### 8. Settings Screen
Allows users to customize application preferences, manage accessibility options, adjust notification settings, and configure account settings.

## Accessibility Features

- Large readable text
- High contrast design
- Large touch targets
- Simple navigation
- Clear headings
- Screen reader support
- Reduced visual clutter
- Accessibility settings for low-vision users

### Prerequisites
- Flutter SDK
- Node.js LTS
- Android Studio
- Xcode (macOS only)


