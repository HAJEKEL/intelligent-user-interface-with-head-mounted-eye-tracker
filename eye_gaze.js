const socket = io.connect('http://localhost:5000');

socket.on('connect', function() {
    console.log('Connected to Python server');
    socket.emit('start_stream'); // Start the gaze data stream
});

socket.on('gaze_data', function(data) {
    const gaze = JSON.parse(data);
    console.log(gaze);

    // Use gaze.data to display the eye tracking information on your application
    // For example, draw a dot on an image at the gaze position
});
