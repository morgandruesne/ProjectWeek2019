import React, { Component } from 'react';
import '../index.css';

const IDLE_STATUS = "Recherche un programme";
const AD_STATUS = "Regarde des publicités";
const WATCH_STATUS = "Regarde du contenu";

class User {
    constructor() {
        this.id = '_' + Math.random().toString(36).substr(2, 9);
        this.timeSpent = 0;
        this.image = "user/" + (Math.floor(Math.random() * 4) + 1) + ".png";
        this.status = IDLE_STATUS;
        this.statusClass = "bg-info";
    }
}

class Collabo extends Component {

    constructor(props){
        super(props);
        this.state = {
            moyenne: 0,
            total: 0,
            died: 0,
            users: [],
            expectedCredits: 0
        };
        setInterval(this._mainLoop, 10);
    }

    spawnUser = () => {
        if (this.state.users.length < 18) {
            this.state.users.push(new User());
        }
    }

    disconnectUser = (item, index) => {
        var liveRate = 0.0015 * ((item.timeSpent / 1800) + 1);

        if (Math.random() < liveRate) {
            var moyenne = this.state.moyenne;
            var total = this.state.total + item.timeSpent;
            var died = this.state.died + 1;
            moyenne = total / died;
            this.setState({died, moyenne, total});
            this.state.users.splice(index, 1);
        }
        this.setState({item});
    }

    _mainLoop = () => {
        if (Math.random() < 0.01) { this.spawnUser(); }
        for (var i = 0; i < this.state.users.length; i++) {
            var item = this.state.users[i];

            item.timeSpent += 5;
            this.disconnectUser(item, i);
        }
        console.log("mainLoop end.");
        this.forceUpdate();
    }

    render = () => {
        var moyenne = this.state.moyenne;
        return (
            <div>
                {this.state.users.map((item, index) => (
                    <div className="card card-width text-white bg-dark mt-3 ml-3 d-inline-block" key={index} item={item}>
                        <div className="card-header">{item.id}</div>
                        <div className="card-body">
                            <img className="center-img w-50" src={item.image} alt="bullshit" />
                        </div>
                        <div className={"card-text mt-3 text-center p-2 " + item.statusClass}>
                            {item.status}
                        </div>
                    </div>
                ))}
                <div className="infobar">
                    Durée moyenne {moyenne}
                </div>
            </div>
        );
    }

}
export default Collabo;