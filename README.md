# Mediphant Practical Dev Test Submission

This repository contains the solution for the Mediphant Practical Dev Test. It includes a Next.js web application for checking medication interactions and a RAG-based FAQ API using Pinecone and LangChain.

---

## 🚀 Tooling & Versions

*   **Node.js**: v20.x or later
*   **Package Manager**: `npm` v10.x or later
*   **Next.js**: v15.5.3
*   **Pinecone**: Free Tier
*   **Google Generative AI**: Gemini API

---

## 🚀 Setup & Running the Project

### **1. Prerequisites**

Ensure you have the following installed and configured:
*   Node.js and npm
*   A Pinecone account and API key.
*   A Google Generative AI (Gemini) API key.

### **2. Installation & Setup**

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd mediphant
    ```

2.  **Set up Environment Variables:**
    Create a `.env` file in the root of both the `web/` and `retrieval/` directories. Add the following keys to both files:
    ```
    # GEMINI API Key
    GEMINI_API_KEY="your-gemini-api-key"

    # Pinecone API Key and Index Name
    PINECONE_API_KEY="your-pinecone-api-key"
    PINECONE_INDEX="mediphant-devtest-index"
    ```

3.  **Install Dependencies:**
    Install dependencies for both the retrieval service and the web app.
    ```bash
    # From the project root directory
    cd retrieval && npm install -f
    cd ../web && npm install -f
    ```

### **3. Indexing Data into Pinecone (Retrieval Service)**

Before running the web app, you must populate your Pinecone index with the vector embeddings from the corpus.

```bash
# From the project root directory
cd retrieval
npm run index
```
This script will read `corpus.md`, generate embeddings, and upload them to your Pinecone index.

### **4. Running the Web Application**

Once the data is indexed, you can start the web application.

```bash
# From the project root directory
cd web
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## 🤖 AI-Assist Log

This project was developed with the assistance of an AI agent. Here is a summary of the tasks performed:

*   **UI Creation**: Created basic UI for the next app.
*   **Test Creation**: Authored a test suite for the API route (`interactions/route.ts`)
*   **CI/CD**: Created a GitHub Actions workflow (`.github/workflows/ci.yml`) to automate linting and testing on push and pull requests to the `main` branch.
*   **Documentation**: Updated this `README.md` file to include comprehensive setup instructions, tooling versions, this development log, and project reflections.

---

## ⏱️ Time Spent & Next Steps

*   **Time Spent**: Around 3 hours.

*   **Potential Next Steps**:
    1.  **Enhance Test Coverage**: Write frontend tests for the React components (e.g., `InteractionForm.tsx`) using React Testing Library to ensure UI components are resilient to changes.
    2.  **Improve CI/CD Pipeline**: Add a `build` step to the GitHub Actions workflow to catch potential build errors before deployment. Also, consider adding a step to automatically run `lint:fix`.
    3.  **Frontend Error Handling**: Implement more robust error handling and user feedback on the frontend. For example, display clear toast notifications or messages when API calls fail and show loading states while data is being fetched.
    4.  **Refactor API Logic**: The FAQ API route logic could be refactored into smaller, dedicated service functions to improve modularity, readability, and ease of testing.
