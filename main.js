const videoElement = document.getElementById("video");
const audioElement = document.getElementById("audio");

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});
camera.start();

function countFingers(landmarks) {
  const tips = [8, 12, 16, 20];
  let count = 0;

  for (let i = 0; i < tips.length; i++) {
    if (landmarks[tips[i]].y < landmarks[tips[i] - 2].y) {
      count++;
    }
  }

  if (landmarks[4].x < landmarks[3].x) count++;

  return count;
}

hands.onResults((results) => {
  if (results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const fingerCount = countFingers(landmarks);

    console.log("count", fingerCount);

    if (fingerCount === 2) {
      audioElement.volume = Math.min(audioElement.volume + 0.05, 1);
    } else if (fingerCount === 1) {
      audioElement.volume = Math.max(audioElement.volume - 0.05, 0);
    }
  }
});
