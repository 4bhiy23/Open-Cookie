#!/bin/bash

echo "🚀 Starting Open-Cookie Backend Server..."
echo ""
echo "Make sure you have created a .env file with:"
echo "- GITHUB_CLIENT_ID=your_client_id"
echo "- GITHUB_CLIENT_SECRET=your_client_secret" 
echo "- GITHUB_TOKEN=your_personal_access_token"
echo "- FRONTEND_URL=http://localhost:5173"
echo "- PORT=3000"
echo ""
echo "Starting server on http://localhost:3000"
echo "GitHub OAuth endpoint: http://localhost:3000/auth/github"
echo ""

node Index.js
