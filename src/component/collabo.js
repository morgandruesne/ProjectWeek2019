import React, { Component } from 'react';
import '../index.css';
import { tsImportEqualsDeclaration } from '@babel/types';

/*
    Const variables
*/

const FRANCETV_ALGORITHM = false;
const ONETIME_COLLABORATION = false;
const ADBLOCK_USERS = true;
const CONTINUE_SIMULATION = true;

const IDLE_STATUS = "Recherche un programme";
const AD_STATUS = "Regarde des publicités";
const WATCH_STATUS = "Regarde du contenu";

const NONE_STATUS = "";
const FILM_STATUS = " (film)";
const SERIES_STATUS = " (série)";
const TVSHOW_STATUS = " (émission)";

const ID_NONE = -1;
const ID_SERIES = 0;
const ID_FILM = 1;
const ID_TVSHOW = 2;

const adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
const nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];

/*
    Misc functions
*/

function randomEl(list) {
    var i = Math.floor(Math.random() * list.length);
    return list[i];
}

function fancyTimeString(timestamp) {
    var hours = Math.floor(timestamp / 3600);
    var minute = Math.floor((timestamp % 3600) / 60);
    var dateString = hours + ":" + ((minute < 10) ? "0" + minute : minute);

    return (dateString);
}

/*
    User class
*/

class User {
    constructor() {
        this.id = randomEl(adjectives) + ' ' + randomEl(nouns);
        this.timeSpent = 0;
        this.image = "user/" + (Math.floor(Math.random() * 4) + 1) + ".png";
        this.status = IDLE_STATUS;
        this.statusComplement = NONE_STATUS;
        this.statusClass = "bg-info";
        this.watchRemaining = 0;
        this.adRemaining = 0;
        this.watchId = 0;
        this.lastWatchId = ID_NONE;
        this.lastAd = 0;

        if (ADBLOCK_USERS === true && Math.random() < 0.28) {
            this.adBlock = true;
        } else {
            this.adBlock = false;
        }
    }
}

class Collabo extends Component {

    /*
        Constructor
    */

    constructor(props){
        super(props);
        this.state = {
            disconnectedUserTimeAverage: 0,
            disconnectedUserTotalTimeSpent: 0,
            disconnectedUserAmount: 0,
            users: [],
            userAmount: 0,
            _simulationState: "Pause",
            _simulationDate: 0,
            _simulationDateString: "9:00",
            _disconnectedUserTimeAverageString: "0:00",
            _globalAdWatch: 0,
            _globalContentWatch: 0,
            _satisfactionScore: 0,
            _adWatched: 0,
            _expectedCredits: 0,
            _credits: 0,
            _watchTime: 0,
            _watchScore: 30
        };
        this._loopIdentifier = setInterval(this._mainLoop, 5);
    }

    /*
        User simulation
    */

    spawnUser = () => {
        // if (this.state.users.length < 18) {
            this.state.users.push(new User());
            this.setState({userAmount: this.state.userAmount + 1});
        // }
    }

    disconnectUser = (item, index) => {
        var liveRate = 0.0015 * ((item.timeSpent / 1800) + 1);

        if (item.watchId === ID_SERIES) {
            liveRate /= 2;
        }
        if (item.watchId === ID_FILM) {
            liveRate /= 4;
        }
        if (item.lastWatchId === ID_FILM) {
            liveRate *= 4;
        }
        if (Math.random() < liveRate) {
            var disconnectedUserTimeAverage = this.state.disconnectedUserTimeAverage;
            var disconnectedUserTotalTimeSpent = this.state.disconnectedUserTotalTimeSpent + item.timeSpent;
            var disconnectedUserAmount = this.state.disconnectedUserAmount + 1;
            disconnectedUserTimeAverage = Math.floor(disconnectedUserTotalTimeSpent / disconnectedUserAmount);
            this.setState({disconnectedUserAmount, disconnectedUserTimeAverage, disconnectedUserTotalTimeSpent});
            this.state.users.splice(index, 1);
        }
        this.setState({item});
    }

    watchAdFranceTV = (item) => {
        if (item.adBlock === true) {
            return;
        }
        item.status = AD_STATUS;
        item.statusClass = "bg-warning";
        if (item.watchId === ID_SERIES) {
            item.adRemaining = 30;
        } else if (item.watchId === ID_FILM) {
            item.adRemaining = 60;
        } else {
            item.adRemaining = 60;
        }
        this.setState({
            _adWatched: this.state._adWatched + item.adRemaining / 30,
            _satisfactionScore: this.state._satisfactionScore - 10
        });
    }

    watchAdHestia = (item) => {
        var expectedCredits = this.state._expectedCredits;
        var credits = this.state._credits;
        var satisfactionScore = this.state._satisfactionScore;

        expectedCredits += (item.watchId === ID_SERIES) ? this.state._watchScore : this.state._watchScore * 2;
        if (item.adBlock === true) {
            return;
        }
        if (credits < expectedCredits && item.lastAd === 0) {
            item.lastAd = 2;
            credits += (item.watchId === ID_SERIES) ? 90 : 180;
            item.adRemaining += (item.watchId === ID_SERIES) ? 90 : 180;
            item.status = AD_STATUS;
            item.statusClass = "bg-warning";
            satisfactionScore -= 20;
        }
        satisfactionScore += 10;
        this.setState({
            _adWatched: this.state._adWatched + item.adRemaining / 30,
            _satisfactionScore: satisfactionScore,
            _expectedCredits: expectedCredits,
            _credits: credits
        });
    }

    findContent = (item) => {
        var chooseRate = 0.0015 * ((item.timeSpent / 100) + 1);

        if (item.status === IDLE_STATUS && Math.random() < chooseRate) {
            item.status = WATCH_STATUS;
            item.statusClass = "bg-success"
            if (Math.random() < 0.50) {
                item.watchRemaining = 1200;
                item.watchId = ID_SERIES;
                item.statusComplement = SERIES_STATUS;
            } else if (Math.random() < 0.75) {
                item.watchRemaining = 7200;
                item.watchId = ID_TVSHOW;
                item.statusComplement = TVSHOW_STATUS;
            } else {
                item.watchRemaining = 5200;
                item.watchId = ID_FILM;
                item.statusComplement = FILM_STATUS;
            }

            if (FRANCETV_ALGORITHM === true) {
                this.watchAdFranceTV(item);
            } else {
                this.watchAdHestia(item);
            }
        }
    }

    /*
        Control simulation behavior
    */

    updateWatchTime = (item) => {
        if (item.status === WATCH_STATUS && item.watchRemaining > 0) {
            item.watchRemaining -= 5;
            this.setState({_globalContentWatch: this.state._globalContentWatch + 5});
        }
        if (item.status === WATCH_STATUS && item.watchRemaining === 0) {
            item.status = IDLE_STATUS;
            item.statusComplement = NONE_STATUS;
            item.lastWatchId = item.watchId;
            item.watchId = ID_NONE;
            item.statusClass = "bg-info";
            if (ONETIME_COLLABORATION === false && item.lastAd > 0) {
                item.lastAd -= 1;
            }
        }
        if (item.status === AD_STATUS && item.adRemaining > 0) {
            item.adRemaining -= 5;
            this.setState({_globalAdWatch: this.state._globalAdWatch + 5});
        }
        if (item.status === AD_STATUS && item.adRemaining === 0) {
            item.status = WATCH_STATUS;
            item.statusClass = "bg-success";
        }
    }

    updateAverage = () => {
        var watchTime = (((this.state._globalAdWatch) / this.state._globalContentWatch) * 100).toFixed(2);

        this.setState({
            _disconnectedUserTimeAverageString: fancyTimeString(this.state.disconnectedUserTimeAverage),
            _watchTime: watchTime
        });
    }

    updateDate = () => {
        var timestamp = this.state._simulationDate + 5;
        var dateString = fancyTimeString(timestamp + 32400);

        if (timestamp >= 43200) {
            timestamp = 0;
            if (CONTINUE_SIMULATION === false) {
                this._pause();
            }
        }
        this.setState({_simulationDate: timestamp, _simulationDateString : dateString});
    }

    _mainLoop = () => {
        // Spawn behavior
        if (Math.random() < 0.015) {
            this.spawnUser();
        }

        // Users iterations and actions
        for (var i = 0; i < this.state.users.length; i++) {
            var item = this.state.users[i];
            item.timeSpent += 5;
            this.disconnectUser(item, i);
            this.updateWatchTime(item);
            this.findContent(item);
        }

        // Updating informations about simulation and users
        this.updateAverage();
        this.updateDate();
        this.forceUpdate();
    }

    _pause = (postId, e) => {
        if (this.state._simulationState === "Pause") {
            this.setState({_simulationState: "Reprendre"});
            clearInterval(this._loopIdentifier);
        } else {
            this.setState({_simulationState: "Pause"});
            this._loopIdentifier = setInterval(this._mainLoop, 10);
        }
    }

    _reset = (postId, e) => {
        this.setState({
            disconnectedUserTimeAverage: 0,
            disconnectedUserTotalTimeSpent: 0,
            disconnectedUserAmount: 0,
            users: [],
            userAmount: 0,
            _simulationState: "Pause",
            _simulationDate: 0,
            _simulationDateString: "9:00",
            _disconnectedUserTimeAverageString: "0:00",
            _globalAdWatch: 0,
            _globalContentWatch: 0,
            _satisfactionScore: 0,
            _adWatched: 0,
            _expectedCredits: 0,
            _credits: 0,
            _watchTime: 0,
            _watchScore: 30
        });
    }

    /*
        Render
    */

    render = () => {
        return (
            <div>
                {this.state.users.map((item, index) => (
                    <div className="card card-width text-white bg-dark mt-3 ml-3 d-inline-block" key={index} item={item}>
                        <div className="card-header card-title">
                            {item.id}
                        </div>
                        <div className="bg-light">
                            <img className="center-img w-25" src={item.image} alt="bullshit" />
                        </div>
                        <div className={"card-text mt-0 text-center p-2 font-weight-bold " + item.statusClass}>
                            {item.status}{item.statusComplement}
                        </div>
                        <div className="card-text mt-0 text-center p-2 font-weight-bold">
                            <span>{fancyTimeString(item.timeSpent)}</span>
                            {item.adBlock ?
                                <span className="text-success"> AdBlock</span> : <span className="text-danger"> AdBlock</span>
                            }
                        </div>
                    </div>
                ))}
                <div className="infobar bg-dark row">
                    <div className="col-lg-2 text-center clock infobar-bubble">
                        {this.state._simulationDateString}
                        <button
                            className="btn btn-block btn-info comments font-weight-bold"
                            onClick={ this._pause }
                        >
                            {this.state._simulationState}
                        </button>
                        <button
                            className="btn btn-block btn-danger comments font-weight-bold"
                            onClick={ this._reset }
                        >
                            Reset
                        </button>
                    </div>
                    {/* <div className="col-lg-2 pause-btn text-center infobar-bubble">
                        <br/>
                        {ADBLOCK_USERS ? <span className="text-success"> Prend en compte AdBlock</span> : <span className="text-danger"> Prend en compte AdBlock</span>} <br/>
                        {!FRANCETV_ALGORITHM ? <span className="text-success"> Algorithme collaboratif</span> : <span className="text-danger"> Algorithme collaboratif</span>} <br/>
                        {ONETIME_COLLABORATION ? <span className="text-success"> Une publicité par jour par utilisateur</span> : <span className="text-danger"> Une publicité par jour par utilisateur</span>}
                    </div> */}
                    <div className="col-lg-2 pause-btn text-center infobar-bubble bg-primary">
                        <br/> Satisfaction<br/>
                        <span className="font-weight-bold font-60">{this.state._satisfactionScore}</span>
                    </div>
                    <div className="col-lg-2 pause-btn text-center infobar-bubble bg-info">
                        <br/> Utilisateurs<br/>
                        <span className="font-weight-bold font-60">{this.state.userAmount}</span>
                    </div>
                    <div className="col-lg-2 pause-btn text-center infobar-bubble bg-success">
                        <br/> WatchTime<br/>
                        <span className="font-weight-bold font-60">{this.state._watchTime < 3.5 ? this.state._watchTime : <span>NA</span>}%</span>
                    </div>
                    <div className="col-lg-4 font-weight-light">
                        Temps moyen passé sur la plateforme <span className="font-weight-bold">{this.state._disconnectedUserTimeAverageString}</span> <br/>
                        Spots publicitaires regardés <span className="font-weight-bold">{this.state._adWatched}</span> <br/>
                        Heures de publicités <span className="font-weight-bold">{fancyTimeString(this.state._globalAdWatch)}</span> <br/>
                        Heures de programmes <span className="font-weight-bold">{fancyTimeString(this.state._globalContentWatch)}</span>
                    </div>
                </div>
            </div>
        );
    }

}
export default Collabo;