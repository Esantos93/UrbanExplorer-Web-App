# UrbanExplorer

A web application for discovering and exploring places and cultural landmarks by searching locations and saving favorites.

For further information, including the documentation about our UX Tests, please consult this Wiki repository.

## Deployed App URL

The app is accessible here:  

[UrbanExplorer Web App](https://cfranze-ebrunius-edsr-puta.web.app/)

## What Has Been Completed

- User authentication with Google Sign-In
- Place search by current location or input location string and categories using Geoapify API
- Favorites management with Firebase Firestore persistence
- State management using Recoil
- Suspense while waiting for API response
- Responsive UI
- Cultural facts generation with LLM integration (Limited to 20 request per day)
- Map & route feature
- Search dropdown menu
- Live update of persistence

## 3rd Pary Components
- Leaflet map
- Components from https://ui.shadcn.com: button, carousel, dropdown-menu, input, input-group, label and textarea

## Project File Structure

```
src/
├── api/                          # External services
│   ├── apiConfig.js              # API keys and configuration
│   ├── llmSource.js              # Gemini LLM API functions
│   ├── placeSource.js            # Geoapify Places API functions
│   └── routeSource.js            # Geoapify Routes API functions
│
├── components/
│   └── ui/                       # Reusable UI components, most are from https://ui.shadcn.com, except the place-card.jsx
│       ├── button.jsx
│       ├── carousel.jsx
│       ├── dropdown-menu.jsx
│       ├── input.jsx
│       ├── input-group.jsx
│       ├── label.jsx
│       ├── place-card.jsx
│       └── textarea.jsx
│
├── lib/
│   └── utils.js                  # Utility functions
│
├── presenters/                   # Business logic layer
│   ├── App.jsx                   # Main app component
│   ├── index.jsx                 # React entry point with RecoilRoot
│   ├── searchPresenter.jsx       # Search logic
│   ├── favoritesPresenter.jsx    # Favorites logic
│   ├── headerPresenter.jsx       # Header logic
│   ├── footerPresenter.jsx       # Footer logic
│   └── mapPresenter.jsx          # Map logic
│
├── recoil/                       # State management
│   ├── atoms.js                  # Global state atoms
│   ├── selectors.js              # Derived state
│   └── firestoreEffect.js        # Firestore sync side-effect
│
├── styles/                       # Styling
│   ├── style.css                 # Main styles
│   └── img/
│       ├── map.svg
│       └── town.svg
│
├── views/                        # Presentation layer
│   ├── searchFormView.jsx
│   ├── searchResultsView.jsx
│   ├── searchResultsSuspenseView.jsx
│   ├── favoritesView.jsx
│   ├── headerView.jsx
│   ├── footerView.jsx
│   └── mapView.jsx
│
├── firebase.js                   # Firebase initialization (auth + db)
├── firebaseConfig.js             # Firebase configuration
```

## Getting Started

```bash
# Clone the repository
git clone https://gits-15.sys.kth.se/iprog-students/cfranze-ebrunius-edsr-puta-HT25-Project.git
cd cfranze-ebrunius-edsr-puta-HT25-Project

# Install dependencies
npm install
npm install leaflet

# Start the development server
npm run dev
```
