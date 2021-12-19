import React from "react";
import './HomeContainer.scss';

function HomeContainer({ children }) {
    return (
        <div className="container">
            <div className="row header">
                <div className="col"><h5>chaînes</h5></div>
                <div className="col"><h5>catégories</h5></div>
                <div className="col"><h1>TV</h1></div>
                <div className="col"><h5>mon espace</h5></div>
                <div className="col"><h5>rechercher</h5></div>
            </div>
            <div className="container pageContent">
                {children}
            </div>
        </div>
    );
}

export default HomeContainer;