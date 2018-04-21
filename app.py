from flask import Flask, render_template, jsonify, request, stream_with_context, Response
from twitter_mood.mood_gatherer import TwitterMoodGatherer
import twitter
import os
from pathlib import Path
import random

app = Flask(__name__)

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

@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/get-mood', methods=['GET'])
def get_mood():
    hashtag = request.args.get('hashtag')
    mood = TwitterMoodGatherer(twitter_api, hashtag)
    mood.gather_tweets()
    result = mood.get_moods()
    list_of_tweets = sorted(
        [
            {
                'polarity': x.sentiment.polarity,
                'subjectivity': x.sentiment.subjectivity,
                'time': x.epoch_time
            } for x in result
        ], key=lambda x: x['time']
    )
    return jsonify(list_of_tweets)

@app.route('/stream-test', methods=['GET'])
def stream_test():
    def generate():
        yield 'Hello '
        yield '!'
        yield 'what'
        yield '?'
    return Response(stream_with_context(generate()))

if __name__ == '__main__':
    app.run(debug=True)
