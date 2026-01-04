# Credit Card Recommender – Full Stack Overview (Next.js Frontend + FastAPI Backend)

## 🚦 Live Demo

**Link to the deployed app:**
[https://credit-card-recommender-six.vercel.app/](https://credit-card-recommender-six.vercel.app/)

## 🚀 Demo

![Chat Demo](demo/demo_part_1.gif)

<p style="margin: 24px 0;"></p>

**The following demo is a continuation of the first one:**

![Recommendations Demo](demo/demo_part_2.gif)

---

A modern, agent-powered web app that guides users through a personalized Q&A journey and recommends the best-fit Indian credit cards using an LLM-powered backend agent (Gemini) and a curated card database. Built with Next.js (frontend) and FastAPI (backend), this application delivers a luxury fintech experience with a conversational UI, robust session-based data flow, and seamless integration with a vector database (Pinecone) for intelligent recommendations.

---

## 🧩 Full Stack Architecture & Flow

- **Frontend (Next.js)**: Provides a modern, accessible chat interface for users to interact with the agent, answer questions, and view recommendations. Handles session management and communicates with the backend via REST API.
- **Backend (FastAPI + Gemini LLM)**: Orchestrates the Q&A flow, extracts structured user preferences, manages sessions, and generates recommendations using:
  - **Gemini (Google Generative AI)** for chat, embeddings, and explanations
  - **Pinecone** as the vector database for card similarity search
  - **Reward simulation** and explainable recommendations
- **Session-Based Data Flow**: Each user session is tracked end-to-end, ensuring privacy and personalized results. The frontend passes a session ID to the backend for all chat and recommendation requests.

### How It Works
1. **User starts a chat** on the frontend, greeted by the agent.
2. **Conversational Q&A**: The agent (Gemini LLM) asks dynamic questions to extract preferences (income, spending, benefits, etc.), storing answers in the backend session.
3. **Preference Extraction & Vector Search**: The backend uses Gemini to extract structured preferences, embeds them, and searches Pinecone for the most relevant cards.
4. **LLM Reasoning & Reward Simulation**: For each recommended card, the backend generates a custom explanation and simulates potential rewards.
5. **Recommendations Display**: The frontend fetches and displays the top card recommendations, with reasons and reward estimates.
6. **Restart/Compare**: Users can restart the flow or return to chat for further queries.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python), Gemini LLM (Google Generative AI), Pinecone (vector database)
- **Database**: Pinecone (for card embeddings and similarity search)

---

## 🗂️ Features

- **Conversational Agent**: Guides users through:
  - Monthly income
  - Spending habits (fuel, travel, groceries, dining)
  - Preferred benefits (cashback, travel points, lounge access)
  - Existing cards (optional)
  - Approx. credit score (or "unknown")
- **Card Recommendations**: Ranks and displays top 3 cards with:
  - Card name, image, and issuer
  - Key reasons for recommendation
  - Reward simulation (e.g., "You could earn Rs. 8,000/year cashback")
  - Apply link (dummy or real)
- **Session Management**: All user data and chat history are stored per session (in-memory/file-based on backend).
- **Robust Error Handling**: Graceful fallbacks for missing data or API errors.
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support.
- **Mobile Responsive**: Fully responsive and accessible on all devices.

---

## 📝 Agent Flow & Prompt Design

1. **Session Start**: User opens chat, receives a friendly greeting and first question.
2. **Dynamic Q&A**: Agent asks follow-up questions based on previous answers, storing all responses in session context.
3. **Preference Extraction**: Gemini LLM extracts structured preferences from chat.
4. **Vector Search**: User preferences are embedded and matched against card embeddings in Pinecone.
5. **Recommendation Trigger**: When enough info is gathered, agent signals completion and triggers recommendations.
6. **Summary Screen**: Frontend fetches recommendations using the session ID and displays:
   - Card details, images, reasons, reward simulation, and apply links.
7. **Restart/Compare**: User can restart the flow or return to chat for further queries.

**Prompt Design**: The backend agent uses a system prompt to:
- Greet the user and explain the process
- Ask for all required info (income, spending, preferences, etc.)
- Store answers in session
- Only recommend cards when enough info is collected
- Provide clear, friendly, and context-aware responses

---

## 🏗️ Project Structure

### Frontend (Next.js)
- `src/components/ChatBox.tsx`: Main chat UI and navigation logic
- `src/app/recommendations/page.tsx`: Recommendations display
- `src/lib/api.ts`: API calls and session management
- `src/app/layout.tsx`: App metadata and branding

### Backend (FastAPI)
- `app/embedding_utils.py`: Embedding logic
- `app/gemini_api.py`: Gemini API integration & session management
- `app/main.py`: FastAPI app entrypoint
- `app/routes.py`: API endpoints
- `app/seed_cards.py`: Pinecone seeding
- `app/system_prompt.py`: System prompt for LLM
- `app/utils.py`: Preference extraction, simulation, etc.
- `data/cards.json`: Credit card data
- `sessions.json`: Session storage (ephemeral on Render)

---

## 🏗️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/saadArfin/Credit_Card_Recommender.git
cd Credit_Card_Recommender/credit_card_recommender
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_BASE_URL=https://your-fastapi-backend-url
```

Set this to your deployed FastAPI backend URL.

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🌐 Deployment

### Frontend (Vercel)
- Push your code to GitHub.
- Import the repo in [Vercel](https://vercel.com/), set `NEXT_PUBLIC_API_BASE_URL` in project settings.
- Deploy!

### Backend
- Deploy FastAPI to your preferred cloud provider (Render, Railway, Fly.io, etc.).
- Ensure CORS is enabled for your frontend domain.
- The backend must support `/chat` and `/recommend` endpoints with session-based logic.
- Pinecone is used as the vector database for card similarity and search.

---

## 📄 Documentation

- **Agent Flow**: See [Agent Flow & Prompt Design](#agent-flow--prompt-design) above.
- **Card Data**: Card database is managed in the backend ([backend repo](https://github.com/saadArfin/Credit_Card_Recommender_Backend)).
- **Frontend**: All chat and recommendation UI logic is in `src/components/ChatBox.tsx` and `src/app/recommendations/page.tsx`.
- **Backend**: See backend repo for embedding, session, and Pinecone logic.

---

## 📬 Contact

For questions or feedback, open an issue or contact [@saadArfin](https://github.com/saadArfin).

---

**Credit Card Recommender** — A luxury fintech experience for smarter credit card choices, powered by Next.js, FastAPI, Gemini LLM, and Pinecone.
