#!/bin/bash
# Script untuk membersihkan cache Next.js dan restart development server

echo "🧹 Membersihkan cache Next.js..."
rm -rf .next
rm -rf node_modules/.cache

echo "🔧 Memulai ulang development server..."
npm run dev
