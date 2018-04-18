from flask import Flask, render_template, jsonify, request
from twitter_mood.mood_gatherer import TwitterMoodGatherer
import twitter
import os
from pathlib import Path

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
    result = mood.get_mood()
    return jsonify({'polarity': result[0], 'subjectivity': result[1]})


if __name__ == '__main__':
    app.run(debug=True)
