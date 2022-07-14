import React, { Component } from "react";
import { connect } from "react-redux";
class HomeComponents extends Component {

   render(){
   
  
   return(
    <div className="col-md-12">
    <div className="card card-container">
    <h3>Selamat Datang Di SIM RS </h3>
    </div>
    </div>
   )
   }
}

function mapStateToProps(state) {  
    const { setting } = state.setting;
    return {
      setting
    };
  }
  
  export default connect(mapStateToProps)(HomeComponents);
// export default HomeComponents;