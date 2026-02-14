# Velvet Zenith - Affiliate Deal Engine

## Project Overview
Velvet Zenith is a web-based Affiliate Deal Engine that helps users find the best marketplace products (Shopee, Tokopedia) and automatically recommends affiliate links.

## Project Structure
- `frontend/`: Next.js 15 application with TailwindCSS v4.
- `backend/`: NestJS application for API services.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run start:dev
   ```
   The API will be available at `http://localhost:3000` (by default).
   
   **Note**: If running both locally, you may need to change the port of one service (e.g. Frontend on 3001).
   To run Frontend on 3001:
   ```bash
   PORT=3001 npm run dev
   ```

## Key Features Implemented (MVP Phase 1)
- **Search Landing Page**: Premium UI with animated search bar and product cards.
- **Mock Search Engine**: Frontend mocks search delay and results for immediate testing.
- **Backend Architecture**: Scalable NestJS setup with `MarketplaceModule`.

## Next Steps
- Implement real API integration with Shopee/Tokopedia.
- Connect Frontend to Backend API.
- Implement Social Media Responder Logic.
