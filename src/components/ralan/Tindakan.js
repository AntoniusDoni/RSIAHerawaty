import React, { Component } from "react";

export default class Tindakan extends Component{

    render(){
        const params = new URLSearchParams(window.location.search);
        console.log(params.get("noreg"))
        return(
            <>
            <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Tindakan & Pemeriksaan</li>
                    </ol>
                </nav>
                
            </>
        )
    }
}