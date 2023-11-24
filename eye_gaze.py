import zmq
import msgpack
import json
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


def connect_to_pupil():
    ctx = zmq.Context()
    pupil_remote = ctx.socket(zmq.REQ)
    ip = "localhost"  # or the IP address where Pupil Labs Core is running
    port = 50020  # default port for Pupil Remote
    pupil_remote.connect(f"tcp://{ip}:{port}")

    pupil_remote.send_string("SUB_PORT")
    sub_port = pupil_remote.recv_string()

    subscriber = ctx.socket(zmq.SUB)
    subscriber.connect(f"tcp://{ip}:{sub_port}")
    subscriber.subscribe("gaze.")  # Subscribe to gaze data

    return subscriber


@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("start_stream")
def start_gaze_stream():
    subscriber = connect_to_pupil()
    while True:
        topic, payload = subscriber.recv_multipart()
        message = msgpack.loads(payload)
        gaze_data = {"topic": topic.decode("utf-8"), "data": message}
        socketio.emit("gaze_data", json.dumps(gaze_data))
        socketio.sleep(0.01)  # Adjust this for desired refresh rate


if __name__ == "__main__":
    socketio.run(app, port=5000)
