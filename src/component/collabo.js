import React, { Component } from 'react';
import '../index.css';
import { tsImportEqualsDeclaration } from '@babel/types';

/*
    Const variables
*/

const IDLE_STATUS = "Recherche un programme";
const AD_STATUS = "Regarde des publicités";
const WATCH_STATUS = "Regarde du contenu";

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
        this.statusClass = "bg-info";
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
            expectedCredits: 0,
            _simulationState: "Pause",
            _simulationDate: 0,
            _simulationDateString: "9:00",
            _disconnectedUserTimeAverageString: "0:00"
        };
        this._loopIdentifier = setInterval(this._mainLoop, 10);
        console.log(this.state._simulationDate);
    }

    /*
        User simulation
    */

    spawnUser = () => {
        if (this.state.users.length < 18) {
            this.state.users.push(new User());
        }
    }

    disconnectUser = (item, index) => {
        var liveRate = 0.0015 * ((item.timeSpent / 1800) + 1);

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

    /*
        Control simulation behavior
    */

    updateAverage = () => {
        this.setState({
            _disconnectedUserTimeAverageString: fancyTimeString(this.state.disconnectedUserTimeAverage)
        });
    }

    updateDate = () => {
        var timestamp = this.state._simulationDate + 5;
        var dateString = fancyTimeString(timestamp + 32400);

        if (timestamp >= 43200) {
            timestamp = 0;
            this._pause();
        }
        this.setState({_simulationDate: timestamp, _simulationDateString : dateString});
    }

    _mainLoop = () => {
        if (Math.random() < 0.01) { this.spawnUser(); }
        for (var i = 0; i < this.state.users.length; i++) {
            var item = this.state.users[i];
            item.timeSpent += 5;
            this.disconnectUser(item, i);
        }
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
                            <img className="center-img w-50" src={item.image} alt="bullshit" />
                        </div>
                        <div className={"card-text mt-0 text-center p-2 font-weight-bold " + item.statusClass}>
                            {item.status}
                        </div>
                    </div>
                ))}
                <div className="infobar bg-dark row">
                    <div className="col-lg-1 text-right clock mt-2">
                        {this.state._simulationDateString}
                    </div>
                    <div className="col-lg-1 pause-btn mt-3">
                        <button
                            className="btn btn-block btn-info comments font-weight-bold"
                            onClick={ this._pause }
                        >
                            {this.state._simulationState}
                        </button>
                    </div>
                    <div className="col-lg-10">
                        Temps moyen passé sur la plateforme {this.state._disconnectedUserTimeAverageString}
                    </div>

                    
                    
                    
                </div>
            </div>
        );
    }

}
export default Collabo;