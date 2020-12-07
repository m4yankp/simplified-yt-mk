# Simplified Youtube - Mayank Kushwaha

Simple React and Node Based application, which allows users to upload video, list them on the homepage, and play via streaming video.

## Backend

Backend is inside the folder backend, make sure you've ffmpeg installed on the system you'll be running it on. It runs on 4000 port by default unless specified.

```bash
cd backend
npm install
npm run start
```

For running test cases
```bash
cd backend
npm install
npm run test
```


## Frontend

The frontend has 3 pages, and some tests for testing components like video card and upload form a bit. API_URL has been set inside src/config.tsx just in case that needs to be changed. It runs on 3000 port by default.

```bash
cd frontend
cd simplified-youtube
yarn install
yarn start
```

For some test cases
```bash
cd frontend
cd simplified-youtube
yarn test
```