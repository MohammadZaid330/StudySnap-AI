# StudySnap AI 📚🤖

An AI-powered study assistant that transforms your notes, PDFs, and study materials into interactive learning experiences including flashcards, quizzes, summaries, and Q&A sessions.

---

## 🚀 Features

- 📄 Upload PDFs or paste notes
- 🧠 AI-generated flashcards
- ❓ Multiple-choice quizzes
- 🗣️ Oral Q&A practice
- 🔊 Audio playback for hands-free studying
- 📈 Spaced repetition learning system
- 💾 Offline-first architecture
- 🌙 Beautiful dark-themed UI
- 📱 Cross-platform support with React Native & Expo

---

## 🛠️ Tech Stack

### Frontend
- React Native
- Expo SDK 54
- TypeScript
- Expo Router
- React Native Reanimated

### AI Integration
- Google Gemini API
- JSON-based structured responses
- Multi-model fallback system

### Storage & Utilities
- AsyncStorage
- Expo File System
- Expo Speech
- Expo AV

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/samarth-mahalkar/StudySnap-AI.git
cd StudySnap-AI
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

---

## 🔑 Environment Setup

Create a `.env` file in the root directory and add your Gemini API key:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Get your API key from Google AI Studio:
https://aistudio.google.com/

---

## 📱 Running the App

### Android
```bash
npx expo run:android
```

### iOS
```bash
npx expo run:ios
```

### Web
```bash
npm run web
```

---

## 🧠 How It Works

1. Upload study material or paste notes
2. AI analyzes the content
3. StudySnap generates:
   - Flashcards
   - Summaries
   - Quizzes
   - Oral Q&A
4. Track progress with spaced repetition

---

## 📂 Project Structure

```bash
StudySnap-AI/
│── app/
│── components/
│── assets/
│── utils/
│── services/
│── hooks/
│── constants/
│── package.json
│── app.json
│── tsconfig.json
```

---

## ✨ Future Improvements

- ☁️ Cloud sync
- 👥 Collaborative study rooms
- 📊 Analytics dashboard
- 🎯 Personalized recommendations
- 🧩 More AI model integrations

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes

```bash
git commit -m "Add some AmazingFeature"
```

4. Push to the branch

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by Samarth Mahalkar

GitHub Repository:
https://github.com/samarth-mahalkar/StudySnap-AI
