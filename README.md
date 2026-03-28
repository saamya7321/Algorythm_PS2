# Algorythm_PS2
Eco-Label Vision: AI-Powered Smart Bin Assistant


# 🌍 Eco-Label Vision: AI-Powered Smart Bin Assistant

**Eco-Label Vision** is a full-stack sustainability platform developed for **Synapse 3.0**. It uses Computer Vision and Real-time Analytics to transform waste disposal into a gamified, high-impact environmental activity. The platform identifies waste, provides disposal instructions, and tracks long-term carbon savings to qualify users for green incentives.

---

## 📱 Platform Modules

### 1. Eco Dashboard (Home)
The central command center for the user's sustainability journey.
* **Recycler Leveling System:** Gamifies the experience with ranks (e.g., "Level 2 Recycler" to "Eco Hero").
* **Real-Time Stats:** Instant visibility into total Carbon Saved ($2530g$), total items sorted ($22$), and daily activity.
* **Impact Equivalencies:** Converts raw data into relatable environmental metrics, such as planting **50.6 seedlings** or saving **10.12 km of car emissions**.

### 2. AI Identification (Scan)
The "Must-Have" vision engine of the prototype.
* **Webcam Integration:** Real-time video processing to identify waste categories.
* **Green Loan Integration:** Explicitly links recycling behavior to a **Green Loan Score**, providing a financial incentive for sustainable actions.
* **Neural Network Mapping:** Classifies items into Plastic, Paper, Metal, and Glass using an optimized MobileNet architecture.

### 3. Daily Report (Analytics)
Detailed breakdown of waste distribution and historical trends.
* **Material Distribution:** Provides a granular look at what the user is recycling (e.g., $18$ Paper, $2$ Glass, $1$ Metal, $1$ Plastic).
* **7-Day Trend Tracking:** A vertical timeline showing recycling consistency over the past week.
* **Average Impact:** Calculates the average carbon saving per item ($115g$) to provide deeper data insights.

### 4. Sustainability Analysis (Impact)
A deep-dive into the "Real-World Impact" of the user's actions.
* **Resource Equivalency Logic:** Calculates energy savings, such as **powering a bulb for 253 minutes**.
* **Material Charting:** Visual progress bars showing the ratio of different materials processed, helping users identify which waste types they generate most.

---

## 🛠️ Technical Architecture

* **Frontend:** React.js + Vite (for lightning-fast HMR during the hackathon).
* **Styling:** Modern Dark-Mode UI with Glassmorphic components and CSS3 animations.
* **AI Engine:** TensorFlow.js + MobileNet for client-side object detection.
* **OCR Backend:** Node.js + Tesseract.js for high-precision Resin Identification Code (RIC) scanning.
* **State Management:** Real-time data persistence to track carbon metrics across different navigation views.


### **Judge's Briefing Note (3:30 PM)**
When presenting, emphasize how the **Material Distribution** page (showing 82% Paper in your demo) helps users understand their consumption patterns. This "Data-Driven Sustainability" is a major differentiator for Problem Statement 2.

**Would you like me to add a "Green Loan Scoring" section to explain exactly how the 2530g of CO2 translates into a credit score for the judges?**
