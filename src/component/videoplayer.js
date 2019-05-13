import React, { Component } from 'react';
import '../App.css'

class VideoPlayer extends Component {
    constructor(props){
        super(props);
        var element;
        this.state = {
            ViewVideo: 0,
            slideIndex: 1,
            pos1: 1,
            pos2: 1,
            pos3: 1,
            pos4: 1,
            BaseoffsetLeft: 1,
        };
    }
    
    _PlayVideo () {
        var video = document.getElementById("video" + (this.state.slideIndex - 1));
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
            this.state.slideIndex = 1;
        }
        if (n < 1) {
            this.state.slideIndex = x.length;
        }
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none"
        }
        x[this.state.slideIndex - 1].style.display = "block"
        var video = document.getElementById("video" + (this.state.slideIndex - 1));
        video.play();
    }

    plusDivs(n) {
        var video = document.getElementById("video" + (this.state.slideIndex - 1));
        video.pause();
        video.currentTime = 0;
        this.showDivs(this.state.slideIndex += n);
    }


    async closeDragElement() {
        this.element.style.opacity = (parseFloat(this.element.offsetLeft)*-1) * 0.5/96*(-1)+1;
        document.onmouseup = null;
        document.onmousemove = null
        this.dragElement(document.getElementById("video" + (this.state.slideIndex - 1)));
    }


    elementDrag (e) {
        e = e || window.event;
        e.preventDefault();
        this.state.pos1 = this.state.pos3 - e.clientX;
        this.state.pos2 = this.state.pos4 - e.clientY;
        this.state.pos3 = e.clientX;
        this.state.pos4 = e.clientY;
        this.element.style.opacity = (parseFloat(this.element.offsetLeft)*-1) * 0.5/96*(-1)+1;
        console.log(this.element.offsetLeft);
        if (this.element.offsetLeft < -192) {
            this.plusDivs(1);
        }
        if (this.state.pos1 > 0)
            this.element.style.left = (this.element.offsetLeft - this.state.pos1) + "px";
    }


    dragMouseDown (e) {
        e = e || window.event;
        e.preventDefault();
        this.state.pos3 = e.clientX;
        this.state.pos4 = e.clientY;
        document.onmouseup = this.closeDragElement.bind(this);
        document.onmousemove = this.elementDrag.bind(this);
    }


    dragElement (elmnt) {
        this.element = elmnt;
        this.state.BaseoffsetLeft = this.element.offsetLeft;
        this.element.onmousedown = this.dragMouseDown.bind(this);
    }


    componentDidMount () {
        this.showDivs(this.state.slideIndex);
        this.dragElement(document.getElementById("video" + (this.state.slideIndex - 1)));
    }


    render() {
        return (
            <div>
                <div className="Menu">
                </div>
                <div className="container PageContent">
                    <hr/>
                    <div className="row header">
                        <div className="col"><p>chaînes</p></div>
                        <div className="col"><p>catégories</p></div>
                        <div className="col"><h4>France <i className="fa fa-circle franceTvDot"></i> TV</h4></div>
                        <div className="col"><p>mon espace</p></div>
                        <div className="col"><p>rechercher</p></div>
                    </div>
                    <div className="VideoContainer" width="640" height="365">
                        <div id="pub1" className="Slidder" width="640" height="365">
                            <video className="SlidderHeader" id="video0" width="640" height="365">
                                <source src="video/miss_dior_the_new_eau_de_parfum.mp4" type="video/mp4"></source>
                            </video>
                        </div>
                        <div id="pub2" className="Slidder" width="640" height="365">
                            <video className="SlidderHeader" id="video1" width="640" height="365">
                                <source src="video/ovo.mp4" type="video/mp4"></source>
                            </video>
                        </div>
                        <div id="pub3" className="Slidder" width="640" height="365">
                            <video className="SlidderHeader" id="video2" width="640" height="365">
                                <source src="video/iPhone_XR.mp4" type="video/mp4"></source>
                            </video>
                        </div>
                    </div>                    <div id="video-controls">
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
export default VideoPlayer;