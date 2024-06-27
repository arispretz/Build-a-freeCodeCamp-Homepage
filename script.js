import * as React from "https://cdn.skypack.dev/react@17.0.1";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";
import * as htmlEntities from "https://cdn.skypack.dev/html-entities@2.3.2";
import moment from "https://cdn.skypack.dev/moment@2.29.1";

moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%ds",
    ss: "%ds",
    m: "%dm",
    mm: "%dm",
    h: "%dh",
    hh: "%dh",
    d: "%d",
    dd: "%dd",
    M: "%dM",
    MM: "%dM",
    y: "%dy",
    yy: "%dY"
  }
});

class Forum extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      posts: []
    };

    this.callApi = this.callApi.bind(this);
    this.findUser = this.findUser.bind(this);
    this.reload = this.reload.bind(this);

    window.addEventListener("load", this.callApi);
  }

  callApi() {
    fetch("https://forum-proxy.freecodecamp.rocks/latest")
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          users: data.users,
          posts: data.topic_list.topics
        });
      });
  }

  findUser(id) {
    return this.state.users.find((user) => user.id == id);
  }

  reload() {
    const loader = document.querySelector("#loader");
    loader.classList.remove("hide");
    this.callApi();
    setTimeout(() => loader.classList.add("hide"), 1500);
  }

  render() {
    return (
      <div id="fcc-forum-homepage">
        <div id="refresh">
          <button onClick={this.reload}>
            Reload <i class="fas fa-redo-alt fa-lg"></i>
          </button>
        </div>

        <div id="hdg">
          <h1>#</h1>
          <h1>Topics</h1>
          <h1>Replies</h1>
          <h1>Views</h1>
          <h1>Activity</h1>
        </div>

        <div id="list">
          {this.state.posts.map((post, i) => {
            return <Post rank={i + 1} post={post} findUser={this.findUser} />;
          })}
        </div>
      </div>
    );
  }
}

const Post = (props) => {
  const topic = htmlEntities.decode(props.post.fancy_title);

  return (
    <a
      className="post"
      title={topic}
      href={`https://forum.freecodecamp.org/t/${props.post.slug}`}
      target="_blank"
    >
      <p className="rank">{props.rank}</p>
      <div className="wrap">
        <p className="topic">{topic}</p>
        <div className="users">
          {props.post.posters.map((poster) => {
            const user = props.findUser(poster.user_id);
            return (
              <a
                title={user.username}
                href={`https://www.freecodecamp.org/forum/u/${user.username}`}
                target="_blank"
              >
                <img
                  src={`https://www.freecodecamp.org/forum${user.avatar_template.replace(
                    "{size}",
                    40
                  )}`}
                  alt={user.username}
                />
              </a>
            );
          })}
        </div>
      </div>
      <p className="replies">{props.post.reply_count}</p>
      <p className="views">{props.post.views}</p>
      <p className="activity">{moment(props.post.bumped_at).fromNow(true)}</p>
    </a>
  );
};

ReactDOM.render(<Forum />, document.querySelector("#forum"));
