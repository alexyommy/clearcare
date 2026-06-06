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

### Verify Flutter Installation

```bash
flutter doctor
```

### Install Depedencies

```bash
flutter pub get
```

### Run the Application

```
flutter run
```

### For Android Emulator

``` bash
flutter run -d emulator-5554
```

### Run Tests

``` bash
flutter test
```

### Generate Coverage Report

```
flutter test --coverage
```

## Application Screens

1. Login Screen
2. Profile Screen
3. Dashboard Screen
4. Create Edit Task Screen
5. Task List Screen
6. Task Detail Screen
7. Calendar Screen
8. Settings Screen


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

### Clone the repo
```bash
git clone https://github.com/alexyommy/clearcare.git
cd clearcare
```
