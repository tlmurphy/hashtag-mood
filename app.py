from gevent import monkey
monkey.patch_all()

from threading import Lock
from flask import Flask, render_template, jsonify, request, stream_with_context, Response
from flask_socketio import SocketIO, emit, disconnect
from twitter_mood.mood_gatherer import TwitterMoodGatherer
import twitter
import os
from pathlib import Path

app = Flask(__name__)
socketio = SocketIO(app)
thread = None
thread_lock = Lock()

my_file = Path("./twitter-config")
try:
    my_abs_path = my_file.resolve()
except FileNotFoundError:
    consumer_key = os.environ['CON_KEY']
    consumer_secret = os.environ['CON_SECRET']
    access_token_key = os.environ['ACC_KEY']
    access_token_secret = os.environ['ACC_SECRET']
else:
    config = {}
    exec(open("./.twitter-config").read(), config)
    consumer_key = config['consumer_key']
    consumer_secret = config['consumer_secret']
    access_token_key = config['access_key']
    access_token_secret = config['access_secret']

twitter_api = twitter.Api(consumer_secret=consumer_secret,
                          access_token_key=access_token_key,
                          access_token_secret=access_token_secret,
                          consumer_key=consumer_key)


def stream_tweets(hashtag):
    mood = TwitterMoodGatherer(twitter_api, '#' + hashtag)
    mood.gather_tweet_stream()
    for time_sentiment in mood.get_mood_stream():
        if not thread:
            return
        payload = {
            'polarity': time_sentiment.sentiment.polarity,
            'subjectivity': time_sentiment.sentiment.subjectivity,
            'link': time_sentiment.url
        }
        socketio.sleep(1)
        socketio.emit('tweet', payload)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/get-mood', methods=['GET'])
def get_mood():
    hashtag = request.args.get('hashtag')
    mood = TwitterMoodGatherer(twitter_api, '#' + hashtag)
    mood.gather_tweets()
    result = mood.get_moods()
    list_of_tweets = sorted(
        [
            {
                'polarity': x.sentiment.polarity,
                'subjectivity': x.sentiment.subjectivity,
                'time': x.created_at,
                'link': x.url
            } for x in result
        ], key=lambda x: x['time']
    )
    return jsonify(list_of_tweets)

@app.route('/get-trends', methods=['GET'])
def get_trends():
    trends = twitter_api.GetTrendsWoeid(23424977)  # Current trends in the US
    trend_list = []
    for t in trends:
        if t.name[:1] == '#':  # Only get hashtag trends
            trend_list.append(t.name)
    return jsonify({'trends': trend_list})


@socketio.on('connect')
def start_stream():
    hashtag = request.args['hashtag']
    global thread
    with thread_lock:
        thread = socketio.start_background_task(stream_tweets, hashtag)


@socketio.on('disconnect')
def disconnect_from_client():
    global thread
    thread = None  # Use thread variable as a flag for the child to stop
    disconnect()


if __name__ == '__main__':
    socketio.run(app, debug=True)
