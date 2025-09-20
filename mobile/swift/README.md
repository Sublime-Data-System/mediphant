# Swift FAQ App

A minimal SwiftUI app that calls the Mediphant FAQ API.

## Files
- `FaqView.swift` - Main SwiftUI view with TextField, Button, and result display
- `MediphantApp.swift` - App entry point

## Setup
1. Open Xcode
2. Create a new iOS project
3. Replace ContentView.swift with FaqView.swift
4. Replace App.swift with MediphantApp.swift
5. Ensure your Next.js server is running on localhost:3000

## Features
- Text input for FAQ queries
- Calls GET /api/faq?q=<query>
- Displays formatted answer and matches with scores
- Loading state and error handling
- Uses URLSession and Codable for networking
