import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from "axios";
import authHeader from '../../services/auth-header';
const { REACT_APP_API_ENDPOINT } = process.env;
class AddEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submitFormEdit = this.submitFormEdit.bind(this);
        // this.submitFormAdd = this.submitFormAdd.bind(this);
      }
    
    renderInput = (name, type, value='') =>{
  
        return <Input onChange={this.onChange} name={name} type={type} value={this.state[name] || value}/>;
      
     
    }
    renderInputSelect=(name, type, value='')=>{
      const data = this.props.formInput.find(data => data.inputname === name)
      const option=data.optionlist.map((list,index)=>{
        // console.log(list)
        return(
          <option value={list.value} key={index}>{list.label}</option>
        )
      })
      return (
          <select className="form-select" onChange={this.onChange} name={name} type={type} value={this.state[name]} multiple={false}>
            <option value={""}>-</option>
            {option}
          </select>
      )
    }
    

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
      }
      submitFormEdit = e => {
        e.preventDefault()
        return axios.post(REACT_APP_API_ENDPOINT+"/"+this.props.actionform,this.state,{ headers: authHeader() }).then(
          response=>{
            // console.log(response.data) 
            this.props.toggle()
            window.location.reload();
          }
        )
      }
      submitFormAdd = e => {
        e.preventDefault()
        return axios.post(REACT_APP_API_ENDPOINT+"/"+this.props.actionform,this.state,{ headers: authHeader() }).then(
          response=>response.data
        ).then(list=>{
          this.props.toggle();
         window.location.reload();
        })
      
      }
      componentDidMount(){
        if(this.props.dataprops){
          const data=this.props.dataprops;
          for (var key in data) {
            var obj = data[key];
            this.setState({[key]: obj})
          }
        }
        
      }
    render(){
      
       const fromgroup=this.props.formInput.map((formsinput,index)=>{
        if(formsinput.typeinput==='select'){
          return (
          <FormGroup key={formsinput.inputname}>
          <Label for={formsinput.inputname}>{formsinput.label}</Label>
          {this.renderInputSelect(formsinput.inputname,formsinput.typeinput)}
        </FormGroup>)
        }else{
            return(
        <FormGroup key={formsinput.inputname}>
          <Label for={formsinput.inputname}>{formsinput.label}</Label>
            {this.renderInput(formsinput.inputname,formsinput.typeinput)}
        </FormGroup>
            )
          }
       })
        return(
            <Form onSubmit={this.props.formaction ? this.submitFormEdit : this.submitFormAdd}>
                {fromgroup}
                <Button >Simpan</Button>
            </Form>
        )
    }
}
export default AddEditForm