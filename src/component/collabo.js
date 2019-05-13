import React, { Component } from 'react';
import '../index.css';

const IDLE_STATUS = "Recherche un programme";
const AD_STATUS = "Regarde des publicités";
const WATCH_STATUS = "Regarde du contenu";

const adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
const nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];

function randomEl(list) {
    var i = Math.floor(Math.random() * list.length);
    return list[i];
}

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