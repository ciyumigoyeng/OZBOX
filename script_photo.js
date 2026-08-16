// Modern approach using mediaDevices API
const video = document.getElementById('webcam');
const captureButton = document.getElementById('capture');
const stopTimerButton = document.getElementById('stop-timer');
const timerDisplay = document.getElementById('timer-display');
const previewContainer = document.getElementById('preview-container');
const previewCanvas = document.getElementById('preview');
const saveButton = document.getElementById('save');
const retakeButton = document.getElementById('retake');
const frameOverlay = document.getElementById('frame-overlay');

let capturedImageBlob;
let timerInterval;
let frameImage = new Image();
frameImage.src = 'osoz.png';

// Request webcam access
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(onSuccess)
    .catch(onError);

function onSuccess(stream) {
    video.srcObject = stream;
    video.play();
    
    // Handle capture button - starts timer
    captureButton.addEventListener('click', () => {
        startTimer();
    });
    
    // Handle stop timer button
    stopTimerButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        capturePhoto();
    });
    
    // Handle save button
    saveButton.addEventListener('click', () => {
        if (capturedImageBlob) {
            const url = URL.createObjectURL(capturedImageBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'photo_' + new Date().getTime() + '.png';
            a.click();
            
            // Redirect to index.html after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    });
    
    // Handle retake button
    retakeButton.addEventListener('click', () => {
        resetCamera();
    });
}

function startTimer() {
    let countdown = 5;
    captureButton.style.display = 'none';
    stopTimerButton.style.display = 'block';
    timerDisplay.style.display = 'block';
    timerDisplay.textContent = countdown;
    
    timerInterval = setInterval(() => {
        countdown--;
        timerDisplay.textContent = countdown;
        
        if (countdown === 0) {
            clearInterval(timerInterval);
            capturePhoto();
        }
    }, 1000);
}

function capturePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    // Draw frame overlay on canvas if image is loaded
    if (frameImage.complete && frameImage.naturalWidth > 0) {
        ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    }
    
    // Display preview with frame
    const previewCtx = previewCanvas.getContext('2d');
    previewCtx.drawImage(video, 0, 0);
    if (frameImage.complete && frameImage.naturalWidth > 0) {
        previewCtx.drawImage(frameImage, 0, 0, previewCanvas.width, previewCanvas.height);
    }
    
    // Show preview and hide video/timer
    video.style.display = 'none';
    timerDisplay.style.display = 'none';
    previewContainer.style.display = 'block';
    stopTimerButton.style.display = 'none';
    
    // Store blob for saving
    canvas.toBlob(blob => {
        capturedImageBlob = blob;
    });
}

function resetCamera() {
    video.style.display = 'block';
    previewContainer.style.display = 'none';
    captureButton.style.display = 'block';
    timerDisplay.style.display = 'none';
    stopTimerButton.style.display = 'none';
    capturedImageBlob = null;
    clearInterval(timerInterval);
}

function onError(error) {
    console.error('Webcam error:', error);
    alert('Error accessing webcam: ' + error.message);
}