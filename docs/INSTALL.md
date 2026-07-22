# Bloom Buddy - Installation Guide

This guide explains how to set up the Bloom Buddy development environment on Windows and macOS.

---

# Requirements

Before getting started, install:

- Git
- Node.js (LTS)
- Visual Studio Code
- npm (installed with Node.js)

Recommended versions:

- Node.js 22+
- npm 10+
- Git 2.40+

---

# Windows Installation

## 1. Install Git

Download:

https://git-scm.com/downloads

Verify:

```bash
git --version

## 2. Install Node.js
Download the LTS version:
https://nodejs.org

verify w/ Bash commands:
node -v
npm -v

## 3. Install VS Code
Download:
https://code.visualstudio.com/

Recommended Extensions:

ESLint
Prettier
Tailwind CSS IntelliSense
React Developer Tools
GitLens

## 4. Clone the Repository

git clone https://github.com/<username>/BloomBuddy.git

cd BloomBuddy

## 5. Install Dependencies
Bash commands:
npm install

## 6. Start Development Server

Bash commands:
npm run dev

Open the local host link
i.e "http://localhost:5173"

## 7. Build Production Version
Bash Commands:
npm run build

## 8. Preview Production Build
Bash commands:
npm run preview

# macOS Installation

## 1. Install Homebrew
Bash commands:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

## 2. Install Git
Bash commands: 
brew install git

Verify Bash commands:
git --version

## 3. Install Node.js
bash commands:
brew install node

Verify Bash commands:
node -v
npm -v

## 4. Install VS Code
Download:

https://code.visualstudio.com/

or

brew install --cask visual-studio-code

## 5. Clone Repository

Bash commands:

git clone https://github.com/<username>/BloomBuddy.git

cd BloomBuddy

## 6. Install Dependencies

npm install

## 7. Start Development Server
Bash commands:
npm run dev

Open host link:
i.e "http://localhost:5173"


Updating Dependencies

Update installed packages:
npm update


Clean Install

If dependency issues occur:

Delete: 
node_modules
package-lock.json

Then reinstall:
npm install