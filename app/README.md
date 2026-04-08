**📚 E-Learning Mobile App**
A modern mobile application built with React Native and Expo, focused on providing a seamless learning experience. This project features a full authentication flow, library management, and secure account settings integrated with Supabase.

**🚀 Features**
Authentication: Secure sign-in and registration using Supabase Auth.

Library Management: Real-time book tracking and borrowing logic.

Security: * Biometric Login (FaceID/Fingerprint) integration.

Password management.

Secure Edge Functions for administrative tasks (e.g., account deletion).

Theme Support: Toggle between Dark and Light modes for better accessibility.

**🛠️ Tech Stack**
Frontend: React Native, Expo, Expo Router

State Management: Zustand

Backend: Supabase (Auth, Database, Edge Functions)

UI/UX: Replicated from professional Figma designs

Icons: Ionicons (@expo/vector-icons)

**📦 Installation & Setup**
Clone the repository:

Bash
git clone https://github.com/abdullatee102/....git
Install dependencies:

Bash
npm install
Environment Variables:
Create a .env file in the root directory and add your Supabase credentials:

Plaintext
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
Start the development server:

Bash
npx expo start


**🛡️ Security Note**
This project uses Environment Variables to manage sensitive API keys. Ensure that your .env file is included in your .gitignore to prevent leaking credentials. Administrative tasks are handled via server-side Edge Functions using the service_role key to ensure user data integrity.

**📈 Learning Journey**
This project is part of my #100DaysOfCode challenge. I am documenting my progress daily on professional platforms:

Follow my progress on LinkedIn: https://www.linkedin.com/in/abdullateef-opeyemi-8ba848287?utm_source=share_via&utm_content=profile&utm_medium=member_android

Follow my updates on X: https://x.com/Abdullatee102

**🆘 Support & Contact**
If you encounter any issues or have questions regarding the development build, feel free to reach out:

Developer: Popoola Abdullateef

Email: abdullateefpopoola12@gmail.com

GitHub Issues: Open a new issue here...

Project Coordinator: *CodeAlpha*

**Pro-Tip for GitHub**
After you create this file, run:

git add README.md

git commit -m "docs: add comprehensive README"

git push origin main
