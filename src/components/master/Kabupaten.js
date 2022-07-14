import React, { Component } from "react";
import ModalComponent from "../modals/modal.component";
import Table from "../data-table/data-list-default";
import axios from "axios";
import authHeader from "../../services/auth-header";

const { REACT_APP_API_ENDPOINT } = process.env;
export default class Kabupaten extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formInput:undefined,
            listkabupaten:[],
            listprovince:[]
        }
    }
     getProvince() {
        return  axios.get(REACT_APP_API_ENDPOINT+'/master/getlistprovinsi/', { headers: authHeader() }).then(
            reseponse => {
                const options = reseponse.data.map(d => ({     
                    "value" : d.id,
                    "label" : d.nm_pro
              
                  }))
                //   console.log(options)
                this.setState({ listprovince: options },this.setFiledInpu)
            }
        )
    }
    getKabupaten() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistkabupaten/', { headers: authHeader() }).then(
            reseponse => {
               
                this.setState({ listkabupaten: reseponse.data })
            }
        )
    }

    componentAction= cellInfo =>{
        const cellValue = this.state.listkabupaten[cellInfo.row.index];
        // console.log(cellValue)
        return (
            <>
                <ModalComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="Kabupaten" formInput={this.state.formInput}  actionform="master/editKabupaten"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapusKabupaten} value={cellValue.id}>Hapus </button>
            </>
        )
      }
   
      hapusKabupaten = e => {
        let id = e.target.value;
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
          axios.delete(REACT_APP_API_ENDPOINT+`/master/deleteKabupaten/${id}`, { headers: authHeader() }).then(
            response => response.data)
            .then(Kabupaten => {
              this.RemoveListToState(id)
            })
            .catch(err => console.log(err))
        }
    }
   
    
      RemoveListToState(id) { 
        const itemIndex = this.state.listkabupaten.findIndex(data => data.id === id)
        this.state.listkabupaten.splice(itemIndex, 1);
        this.setState(this.state.listkabupaten);
      }
      componentDidMount(){
        this.getProvince()
        this.getKabupaten()
        
        
      }
      setFiledInpu(){
       
        const formInput=[
            {
                inputname:"id",
                label:"",
                typeinput:"hidden"
            },
            {
                inputname:"nm_kab",
                label:"Nama Kabupaten",
                typeinput:"text"
            },
            {
                inputname:"idprop",
                label:"Nama Provinsi",
                typeinput:"select",
                optionlist:this.state.listprovince
            }
        ]
        this.setState({formInput:formInput})
      }
    render(){
       
        const column=[
            {
                Header: "#",
                accessor: (row, i) => i+1,
            },
            {
              Header: "Nama Provinsi",
              accessor:"provinsi.nm_pro",
            },
            {
                Header: "Nama Kabupaten",
                accessor:"nm_kab",
              },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listkabupaten;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Kabupaten</li>
                    </ol>
                </nav>
                <ModalComponent buttonLabel="Tambah Kabupaten" labelcomponent="Kabupaten" formInput={this.state.formInput}                
                actionform="master/addKabupaten"/>
                <Table columns={column} data={data} size={10} filter="nm_kab" placeholder="Nama Kabupaten"/>
            </>
        )
    }
}