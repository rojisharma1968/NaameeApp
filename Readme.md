# Naamee

Naamee is a React Native social media app built with Expo.

## Features

- User authentication (login, register, forgot password)
- Profile editing and privacy settings
- Post creation (image/video), comments, likes, repeats
- Reels (short video feed)
- Notifications
- Location search
- Responsive UI with NativeWind (Tailwind CSS for React Native)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- (Expo CLI is optional; you can use `npx expo <command>` directly)

### Installation

Clone the repository and install dependencies:

```sh
git clone <repo-url>
cd Naamee
npm install
```

### Running the App Locally

Start the Expo development server:

```sh
npx expo start
```

You can then:
- Press `i` to open in iOS Simulator (Mac only)
- Press `a` to open in Android Emulator
- Scan the QR code with the Expo Go app on your phone (Note: On iPhone, use the default Camera app to scan the QR code, as Expo Go does not have a built-in QR code scanner)

Or run on a specific platform:

```sh
npx expo start --android
npx expo start --ios
```

## Project Structure

- `src/` - Main source code
  - `components/` - Reusable UI components
  - `screens/` - App screens (Camera, Comments, CreatePost, etc.)
  - `context/` - React context providers
  - `hooks/` - Custom hooks
  - `navigation/` - Navigation setup

## Tech Stack

- React Native
- Expo
- NativeWind (Tailwind CSS)
- React Navigation

## License

This project is private and for demonstration purposes only.