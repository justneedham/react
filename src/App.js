import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';

var PLAYERS = [
    {
        name: 'Justin',
        score: 10
    },
    {
        name: 'Jenna',
        score: 15
    },
    {
        name: 'Jace',
        score: 22
    }
];


function Player(props) {
    return (
        <div className="player">
            <div className="player-name">
                <button className="remove-player" onClick={props.onRemove}>Remove</button>
                {props.name}
            </div>
            <div className="player-score">
                <Counter score={props.score} onChange={props.onScoreChange}/>
            </div>
        </div>
    )
}


function Counter(props) {
    return (
        <div className="counter">
            <button className="counter-action decrement" onClick={function () {
                props.onChange(-1)
            }}> - </button>
            <div className="counter-score"> {props.score} </div>
            <button className="counter-action increment" onClick={function () {
                props.onChange(1)
            }}> + </button>
        </div>
    )
}

Counter.propTypes = {
    score: PropTypes.number,
    onChange: PropTypes.func
};


function Stats(props) {
    var totalPlayers = props.players.length;
    var totalPoints = props.players.reduce(function (total, player) {
        return total + player.score
    }, 0);

    return (
        <table className="stats">
            <tbody>
            <tr>
                <td>Players:</td>
                <td>{totalPlayers}</td>
            </tr>
                <td>Total Points</td>
                <td>{totalPoints}</td>
            </tbody>
        </table>
    )
}

Stats.propTypes = {
    players: PropTypes.array
};


function Header(props) {
    return (
        <div className="header">
            <Stats players={props.players}/>
            <h1>{props.title}</h1>
            <Stopwatch />
        </div>
    )
}

class Stopwatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            running: false,
            elapsedTime: 0,
            previousTime: 0,
        };
        this.onTick = this.onTick.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onReset = this.onReset.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }

    onTick() {
        if (this.state.running) {
            var now = Date.now();
            this.setState({
                previousTime: now,
                elapsedTime: this.state.elapsedTime + (now - this.state.previousTime)
            })
        }
    }

    componentDidMount() {
        setInterval(this.onTick, 100)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    onStop() {
        this.setState({
            running: false
        })
    }

    onStart() {
        this.setState({
            running: true,
            previousTime: Date.now(),
        })
    }

    onReset() {
        this.setState({
            elapsedTime: 0,
            previousTime: Date.now(),
        })
    }

    render() {
        var seconds = Math.floor(this.state.elapsedTime / 1000);
        return (
            <div className="stopwatch">
                <h2>Stopwatch</h2>
                <div className="stopwatch-time">{seconds}</div>
                { this.state.running ?
                    <button onClick={this.onStop}>Stop</button>
                    :
                    <button onClick={this.onStart}>Start</button> }
                <button onClick={this.onReset}>Reset</button>
            </div>
        )
    }
}

class AddPlayerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        };
        this.onNameChange = this.onNameChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault()
        this.props.onAdd(this.state.name);
        this.setState({name: ""})
    }

    onNameChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    render() {
        return (
            <div className="add-player-form">
                <form onSubmit={this.onSubmit}>
                    <input type="text" value={this.state.name} onChange={this.onNameChange}/>
                    <input type="submit" value="Add Player" onSubmit={this.onSubmit}/>
                </form>
            </div>
        )
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: props.players
        };
        this.onScoreChange = this.onScoreChange.bind(this);
        this.onPlayerAdd = this.onPlayerAdd.bind(this);
        this.onRemovePlayer = this.onRemovePlayer.bind(this);
    }

    onScoreChange(index, delta) {
        this.state.players[index].score += delta;
        this.setState(this.state)
    }

    onPlayerAdd(name) {
        this.state.players.push({
            name: name,
            score: 0,
            id: this.state.players.length
        });
        this.setState(this.state)
    }

    onRemovePlayer(index) {
        this.state.players.splice(index, 1);
        this.setState(this.state)
    }

  render() {
    return (
        <div className="scoreboard">
            <Header title={this.props.title} players={this.state.players}/>
            <div className="players">
                {this.state.players.map(function (player, index) {
                    return (
                        <Player
                            onScoreChange={function (delta) {
                                this.onScoreChange(index, delta)
                            }.bind(this)}
                            onRemove={ function () {
                                this.onRemovePlayer(index)
                            }.bind(this)}
                            name={player.name}
                            score={player.score}
                            key={player.id}/>
                    );
                }.bind(this))}
            </div>
            <AddPlayerForm onAdd={this.onPlayerAdd}/>
        </div>
    );
  }
}

App.defaultProps = {
    players: PLAYERS,
    title: 'Scoreboard'
};


export default App;
