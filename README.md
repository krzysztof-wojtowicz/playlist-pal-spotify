# 🎵 PlaylistPal – Create Personalized Spotify Playlists Effortlessly

**PlaylistPal** is my **personal project**, built to explore the integration of **Spotify's Web API** while delivering a seamless way for users to generate personalized playlists based on their favorite songs and artists.

Developed with **Next.js**, styled with **Tailwind CSS**, and enhanced with **GSAP animations**, PlaylistPal ensures a smooth and engaging user experience.

---

## 🌟 App Overview

### 🔐 Login Page – Secure Authentication with Spotify

To get started, log in with your **Spotify account** and authorize the app to access your music preferences.

![Login page](https://res.cloudinary.com/dcwp4g10w/image/upload/v1739032904/GitHub-readme/uqlttjsvvkmjmy5hfdm6.png)

---

### 🏠 Home Page – Start Creating Your Playlist

Once logged in, dive into the app and start crafting your perfect playlist.

![Home page](https://res.cloudinary.com/dcwp4g10w/image/upload/v1739032904/GitHub-readme/nz0woshtqipnztcucbxp.png)

---

### 🔍 Search Page – Choose Tracks and Artists

Use the **search feature** to explore and select your favorite tracks and artists for a truly personalized playlist.

![Search page](https://res.cloudinary.com/dcwp4g10w/image/upload/v1739032905/GitHub-readme/l7hlnbszcak1mitpxakw.png)

---

### 📜 Playlist Page – View and Enjoy Your Custom Playlist

After selecting your tracks, **PlaylistPal** creates a **Spotify playlist** tailored to your music taste.

![Playlist page](https://res.cloudinary.com/dcwp4g10w/image/upload/v1739032905/GitHub-readme/ujnintrboegd0s8nc4nu.png)

---

## 🔧 Technologies Used

### ⚡ Next.js Framework

✅ **Optimized for speed** – Fast single-page application (SPA) experience  
✅ **SEO-friendly** – Ensures better search engine visibility

---

### 🎨 Tailwind CSS

✅ **Utility-first styling** for rapid UI development  
✅ **Responsive design** for a seamless experience across all devices

---

### ✨ GSAP (GreenSock Animation Platform)

✅ **Smooth and engaging animations**  
✅ **Enhances user interaction** for a premium experience

---

### 🎶 Spotify Web API

✅ **Integrates seamlessly with Spotify** to fetch user data and manage playlists  
✅ **Real-time music search** using Spotify’s vast music library

---

## ⚙️ How It Works

### 🔑 Spotify Authentication

PlaylistPal utilizes **Spotify’s Authorization Code Flow** to request user permissions and retrieve an **access token** for API interactions.

### 🔍 API Endpoints Used

- **`GET /search`** – Search for tracks, artists, and albums
- **`GET /me`** – Retrieve user information (used for market-based recommendations)
- **`POST /users/{user_id}/playlists`** – Create a new playlist for the user
- **`POST /playlists/{playlist_id}/tracks`** – Add selected tracks to the playlist
- **`PUT /playlists/{playlist_id}/images`** – Upload a custom playlist cover

---

## 🎯 Generating Recommendations

Previously, the app used **`GET /recommendations`**, but since it’s now deprecated, PlaylistPal now leverages:

✅ **`GET /search`** – Retrieves personalized track results using tailored queries and offset adjustments for more diverse recommendations.

---

🚀 **PlaylistPal transforms your favorite songs into a curated Spotify playlist in just a few clicks!** 🎧
