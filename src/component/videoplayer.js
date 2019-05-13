import React, { Component } from 'react';
import '../App.css'

class Controle extends Component {
    constructor(props){
        super(props);
        this.state = {
            ViewVideo: 0,
            slideIndex: 1,
        };
    }
    _PlayVideo () {
        var video = document.getElementById("video" + this.state.ViewVideo);
        if (video.paused == true) {
            video.play();
        } else {
            video.pause();
        }
    }
    showDivs(n) {
        var i;
        var x = document.getElementsByClassName("Slidder");
        if (n > x.length) {
            this.setState({slideIndex: 1})
        }
        if (n < 1) {
            this.setState({slideIndex: x.length})
        }
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        console.log("plop");
        x[this.state.slideIndex - 1].style.display = "block";
    }
    plusDivs(n) {
        console.log(n);
        this.showDivs(this.state.slideIndex += n);
    }
    componentDidMount () {
        this.showDivs(this.state.slideIndex)
    }
    render() {
        return (
            <div>
                <div id="video-container">
                    <div className="">
                        <video className="Slidder" id="video0" width="640" height="365">
                            <source src="video/miss_dior_the_new_eau_de_parfum.mp4" type="video/mp4"></source>
                        </video>
                        <video className="Slidder" id="video1" width="640" height="365">
                            <source src="video/ovo.mp4" type="video/mp4"></source>
                        </video>
                    </div>
                    <div id="video-controls">
                        <button class="w3-button w3-black w3-display-left" onClick={() => this.plusDivs(-1)}>&#10094;</button>
                        <button class="w3-button w3-black w3-display-right" onClick={() => this.plusDivs(1)}>&#10095;</button>
                        <button type="button" id="play-pause" onClick={() => this._PlayVideo()}>Play</button>
                        <input type="range" id="seek-bar" value="0"/>
                        <button type="button" id="mute">Mute</button>
                        <input type="range" id="volume-bar" min="0" max="1" step="0.1" value="1"/>
                        <button type="button" id="full-screen">Full-Screen</button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Controle;