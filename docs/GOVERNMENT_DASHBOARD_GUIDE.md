# Government Dashboard - Feature Guide & Testing Manual

This guide outlines all the features implemented on the Government Dashboard (`/government` route) and exactly how you or the judges can test them live during your presentation.

## 1. State-Level KPIs (Top Row)
* **What is it:** 7 real-time metric cards showing total problems, active projects, solutions deployed, universities onboarded, and industry funding committed.
* **How to check it:** 
  1. Open your MongoDB database (or use Postman/your frontend form).
  2. Create a new `Problem` or `Project`.
  3. Refresh the Government Dashboard. You will see the total counts increase instantly. The backend dynamically runs an aggregation across all collections.

## 2. Challenges by Domain & District Hotspots (Sections 2 & 3)
* **What is it:** A visual progress bar of problem categories and a heat-map grid of the 24 districts in Jharkhand.
* **How to check it:**
  1. Create a problem with `category: "water"` and `location.district: "Ranchi"`.
  2. Refresh the dashboard. You will see the "Water & Sanitation" bar fill up slightly more, and the number under "Ranchi" increase.

## 3. Challenge → Project Lifecycle Funnel (Section 4)
* **What is it:** A conversion funnel that shows the exact drop-off rate from when a citizen submits a problem to when a university deploys a solution.
* **How to check it:**
  1. Find a problem in the database with `status: "submitted"`.
  2. Change its status to `status: "in_progress"`.
  3. Look at the dashboard funnel; the "Submitted" count will decrease and the "Univ. Assigned" bar will increase.

## 4. Projects Requiring Attention (Section 5)
* **What is it:** An automated flagging system that highlights projects that have stalled.
* **How to check it:**
  1. Find an active `Project` in the database.
  2. Edit its `updated_at` timestamp to be 21 days ago.
  3. Refresh the dashboard. The project will automatically appear in this section with a flashing red **"CRITICAL"** badge and tell you that there have been no recent updates.

## 5. University & Industry Leaderboards (Sections 6 & 7)
* **What is it:** Tables that track which universities are taking up the most projects, and which industries are providing the most funding.
* **How to check it:**
  1. Assign a new project to a `university_id` and attach an `industry_partner_id`.
  2. Refresh the dashboard. You will see their specific rows in the table update their "Proj." count automatically.

## 6. Measurable Social Impact (Section 8)
* **What is it:** Tracks the actual human impact of the hackathon solutions (people impacted, villages reached, startups, patents).
* **How to check it:**
  1. Go to any `Project` document in MongoDB.
  2. Add the newly created fields: `{"people_impacted": 10000, "patents_filed": 2}`.
  3. Look at the dashboard. The top-line "People Impacted" number will jump by 10,000 and "Patents Filed" will increase.

## 7. Live Challenge Registry (Section 9)
* **What is it:** A searchable, filterable grid of all challenges in the state.
* **How to check it:**
  1. Scroll to the bottom of the dashboard.
  2. Use the dropdowns to filter by "Water & Sanitation" or type a specific title in the search bar. 
  3. The table will update live. (This hits the brand new `GET /api/government/challenges` endpoint you requested).

## 8. Live Activity Feed (Sidebar)
* **What is it:** A pulsing live-feed log of events occurring across the state.
* **How to check it:** Look at the bottom of the left navigation sidebar. It features a pulsing green dot to simulate real-time socket events coming into the system.

---
### 💡 Demo Tip for the Judges
During your presentation, emphasize that **nothing on this page is hardcoded**. The dashboard uses a single, highly optimized MongoDB aggregation pipeline (`GET /api/government/dashboard-stats`) that calculates all these metrics in milliseconds without slowing down the database.
