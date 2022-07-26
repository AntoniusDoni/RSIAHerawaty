import React, { Component } from "react";
import authHeader from '../services/auth-header';
import axios from "axios";
import { connect } from "react-redux";
import { Button,Form, FormGroup, Label, Input } from 'reactstrap';
import { setting } from "../actions/auth";

class settingMaster extends Component {
    state = {
        title:  this.props.setting.settings[0].attr,
        margin: this.props.setting.settings[3].attr,
        address:this.props.setting.settings[1].attr, 
        logo:"", 
      
        // settingname:this.props.setting.settingname      
      }
      onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }
    updateSetting(){
        const formData = new FormData();
        formData.append("title",this.state.title);
        formData.append("margin",this.state.margin);
        formData.append("address",this.state.address);
        console.log(this.state.logo)
        if(this.state.logo){
            formData.append("logo",this.state.logo,this.state.logo.name);
        }
        

        return axios.post('http://localhost:3000/api/setting/updateSetting',
        
            formData
    
        ,{headers: authHeader(),'Content-Type': 'multipart/form-data'}
        ).then(response=>{
            this.getSetting()
            // window.location.reload();
        })
    }
    getSetting() {
        const { dispatch } = this.props;
        dispatch(setting()).then(
          () => {
    
          }
        )
      }
      handleFile= e => {
       
        this.setState({ logo: e.target.files[0] });
      };
    render() {
        return (
            <>
                <h3>Pengaturan</h3>
                <Form encType="multipart/form-data">
                    <FormGroup >
                        <Label for="no_po">Title</Label>
                        <Input type="text" name="title" id="title" onChange={this.onChange} value={this.state.title === null ? '' : this.state.title}  />
                    </FormGroup>
                    <FormGroup >
                        <Label for="Margin">Margin</Label>
                        <Input type="text" name="margin" id="margin" onChange={this.onChange} value={this.state.margin === null ? '' : this.state.margin}  />
                    </FormGroup>
                    <FormGroup >
                        <Label for="address">Alamat</Label>
                        <Input type="text" name="address" id="address" onChange={this.onChange} value={this.state.address === null ? '' : this.state.address}  />
                    </FormGroup>
                    <FormGroup >
                        <Label for="address">Logo</Label>
                         <Input
            type="file"
            name="logo"
           
            onChange={this.handleFile}
          />
                    </FormGroup>
                    
                    <Button className='btn btn-primary' onClick={this.updateSetting.bind(this)}>Simpan</Button>
                </Form>
            </>
        )
    }
}

function mapStateToProps(state) {
    const { setting } = state.setting;
    return {
        setting,
    };
}
export default connect(mapStateToProps)(settingMaster);