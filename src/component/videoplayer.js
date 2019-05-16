import React, { Component } from 'react';
import '../App.css'
import Flickity from 'flickity';

class VideoPlayer extends Component {
    constructor(props){
        super(props);
        this.state = {
            ViewVideo: 0,
            slideIndex: 1,
            changing: false,
            element: [],
            carousel: {},
            pubTime: 10,
            FinPub: false,
            OnProg: false,
        };
        var element = [];
        element.push("video/miss_dior_the_new_eau_de_parfum.mp4");
        element.push("video/ovo.mp4");
        element.push("video/iPhone_XR.mp4");
        console.log("render");
        this.state.element = element;
        setInterval(this._Loop, 1000);
    }
    
    sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }

    _PlayVideo () {
        var video = document.getElementById("video"+(this.state.slideIndex - 1));
        if (video.paused == true) {
            video.play();
        } else {
            video.pause();
        }
    }


    showDivs(n) {
        var i;
        var x = document.getElementsByClassName("carousel-cell-video");
        if (n > x.length) {
            this.state.slideIndex = 1;
            this.state.lastIndex = 1;
        }
        if (n < 1) {
            this.state.slideIndex = x.length;
        }
        var video = document.getElementById("video"+(this.state.slideIndex - 1));
        video.play();
    }
    
    plusDivs(n) {
        console.log(this.state.slideIndex);
        var video = document.getElementById("video" + (this.state.slideIndex - 1));
        video.pause();
        video.currentTime = 0;
        this.showDivs(this.state.slideIndex += n);
        this.sleep(400).then(() => {
            var tmp = this.state.carousel.cells[0].element;
            this.state.carousel.remove(this.state.carousel.cells[0].element);
            this.state.carousel.append(tmp);
            var tmp2 = this.state.element[0];
            this.state.element.shift();
            this.state.element.push(tmp2);
            this.forceUpdate();
        })
    }
    
    closeinfobar () {
        this.state.changing = true;
        var info = document.getElementById("video-info"+(this.state.slideIndex - 1));
        info.style.opacity = 0;
    }

    creatcarousel () {
        var carousel = document.getElementById("carousel");
        var flkty = new Flickity( carousel, {
            prevNextButtons: false,
            pageDots: false,
            on: {
                dragStart: (event, pointer) => {
                    if (this.state.changing === false) {
                        this.state.changing = true;
                    }
                    console.log(this.state.changing);
                },
                dragEnd: () => {
                    this.state.mouveleft = 0;
                },
                change: () => {
                    var info = document.getElementById("video-info"+(this.state.slideIndex - 1));
                    info.style.opacity = 0;
                    this.plusDivs(1);
                },
                pointerMove: (event, pointer, moveVector) => {
                    if (this.state.FinPub == false || this.state.OnProg == false) {
                        var info = document.getElementById("video-info"+(this.state.slideIndex - 1));
                        if (moveVector.x > 15 && this.state.changing == true) {
                            info.style.opacity = 0.85;
                            console.log(moveVector.x);
                            this.state.isokai = false;
                        }
                        if (this.state.changing == false) {
                            info.style.opacity = 0;
                        }
                    }
                },
            }
        });
        this.state.carousel = flkty;
    }
    
    creatprogam = (item, id) => {
        var cell = document.createElement('div');
        cell.className = 'carousel-cell';
        var video = document.createElement('video');
        video.className = 'carousel-cell-video';
        video.controls = true;
        video.id = "video" + id;
        video.width = "700";
        video.height = "400";
        var source = document.createElement('source');
        source.src = item;
        source.type = "video/mp4";

        video.appendChild(source);
        cell.appendChild(video);
        return (cell);
    }

    passpub = () => {
        if (this.state.pubTime <= 0 && this.state.FinPub == true) {
            while (this.state.carousel.cells[0] && this.state.carousel.cells[1]) {
                this.state.carousel.remove(this.state.carousel.cells[0].element);
            }
            this.state.carousel.append(this.creatprogam("video/SKAM_FRANCE.mp4", 0));
            this.state.carousel.remove(this.state.carousel.cells[0].element);
            this.state.FinPub = true;
            this.state.slideIndex = 1;
            this.showDivs(1);
            this.state.OnProg = true;
            var controle = document.getElementById("video-controls");
            controle.style.display = "none";
        }
        console.log("plop");
    }

    _Loop = () => {
        if (this.state.pubTime <= 0 && this.state.FinPub == false) {
            var list = document.getElementsByClassName("carousel-cell-pass");
            for (let item of list) {
                item.style.display = "block";
            }
            this.state.FinPub = true;
        }
        else {
            this.state.pubTime -= 1;
        }
    }

    changevolume () {
        var video = document.getElementById("video" + (this.state.slideIndex - 1));
        var volumeBar = document.getElementById("volume-bar");
        video.volume = volumeBar.value;
    }

    passvideo () {
        this.state.carousel.next();
    }

    likevideo () {
        var info = document.getElementById("video-info"+(this.state.slideIndex - 1));
        if (info.style.opacity == 0.85) {
            info.style.opacity = 0;
        } else {
            info.style.opacity = 0.85;
        }
    }

    componentDidMount () {
        this.creatcarousel();
        this.showDivs(this.state.slideIndex);
    }

    render() {
        console.log(this.state.element);
        return (
            <div>
                <div className="Menu">
                <hr/>
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
                    <hr/>
                    <div id="carousel">
                    {this.state.element.map((item, index) => (
                        <div class="carousel-cell">
                            <div id={"video-pass" + index} className="carousel-cell-pass"><a href="#" className="pass-pub-link" onClick={() => this.passpub()}>Regarder mon programme</a></div>
                            <div id={"video-info" + index} class="carousel-cell-info">
                            <a href="#" class="close" onClick={() => this.closeinfobar()}>
                            </a>
                            <div className="info-text">
                                <h3>XXXXXXXX</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                            </div>
                            </div>
                            <video id={"video" + index} className="carousel-cell-video" width="700" height="400">
                                <source src={item} type="video/mp4"></source>
                            </video>
                        </div>
                    ))}
                    </div>
                    <div id="video-controls" className="middle">
                        <div className="buton-center">
                            <button type="button" className="btn btn-secondary btn-space" onClick={() => this.passvideo()}><img src="dislike.png" height="35" width="auto" alt="a"></img></button>
                            <button type="button" id="play-pause" className="btn btn-secondary play-btn btn-space" onClick={() => this._PlayVideo()}><i class="fa fa-play"></i></button>
                            <button type="button" className="btn btn-secondary btn-space" onClick={() => this.likevideo()}><img src="like.png" height="35" width="auto" alt="a"></img></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default VideoPlayer;