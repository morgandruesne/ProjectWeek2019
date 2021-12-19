import React, { Component } from 'react';
import './PubSwipper.scss';
import Flickity from 'flickity';

class PubSwipper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            element: [
                "video/miss_dior_the_new_eau_de_parfum.mp4",
                "video/ovo.mp4",
                "video/iPhone_XR.mp4",
                "video/miss_dior_the_new_eau_de_parfum.mp4",
                "video/ovo.mp4"

            ],
            swipper: {},
            Timer: 10,
            prev: 0,
        };
        setInterval(this.checkTimer, 1000);
    }

    playCurrentVideo() {
        if (this.state.swipper.selectedIndex !== undefined) {
            var video = document.getElementById("video" + (this.state.swipper.selectedIndex));
            video.play();
        }
    }

    closeInfoOverlay(id) {
        var info = document.getElementById("video-info" + (id));
        info.style.opacity = 0;
    }

    createSwipper() {
        var swipper = document.getElementById("swipper");
        this.setState({
            swipper: new Flickity(swipper, {
                prevNextButtons: false,
                pageDots: false,
                on: {
                    change: () => {
                        this.closeInfoOverlay(this.state.prev);
                        var video = document.getElementById("video" + (this.state.prev));
                        video.pause();
                        video.currentTime = 0;
                        this.playCurrentVideo();
                        this.setState({ prev: this.state.swipper.selectedIndex });
                    }
                }
            })
        });
    }

    removeAllSwipper = () => {
        if (this.state.Timer <= 0) {
            while (this.state.swipper.cells[0]) {
                this.state.swipper.remove(this.state.swipper.cells[0].element);
            }
        }
    }

    openPubInfo() {
        var info = document.getElementById("video-info" + (this.state.swipper.selectedIndex));
        if (info.style.opacity === 0.75) {
            info.style.opacity = 0;
        } else {
            info.style.opacity = 0.85;
        }
    }

    checkTimer = () => {
        if (this.state.Timer <= 0) {
            var list = document.getElementsByClassName("swipper-cell-pass");
            for (let item of list) {
                item.style.display = "block";
            }
        }
        else
            this.setState({
                Timer: this.state.Timer - 1
            })
    }

    componentDidMount() {
        this.createSwipper();
        this.playCurrentVideo();
    }

    render() {
        return (
            <div>
                <div id="swipper">
                    {this.state.element.map((item, index) => (
                        <div key={"swipper-cell" + index} className="swipper-cell">
                            <div id={"video-pass" + index} className="swipper-cell-pass"><a href="/#" className="pass-pub-link" onClick={() => this.removeAllSwipper()}>Regarder mon programme</a></div>
                            <div id={"video-info" + index} className="swipper-cell-info">
                                <a href="/#" className="close" onClick={() => this.closeInfoOverlay(this.state.swipper.selectedIndex)}>
                                </a>
                                <div className="info-text">
                                    <h3>XXXXXXXX</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                                </div>
                            </div>
                            <video id={"video" + index} className="swipper-cell-video" width="700" height="400">
                                <source src={item} type="video/mp4"></source>
                            </video>
                        </div>
                    ))}
                </div>
                <div id="video-controls" className="middle">
                    <div className="buton-container">
                        <button type="button" className="btn btn-secondary btn-space" onClick={() => this.state.swipper.next()}><img src="dislike.png" height="35" width="auto" alt="a"></img></button>
                        <button type="button" className="btn btn-secondary btn-space" onClick={() => this.openPubInfo()}><img src="like.png" height="35" width="auto" alt="a"></img></button>
                    </div>
                </div>
            </div>
        );
    }
}
export default PubSwipper;