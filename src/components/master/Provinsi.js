import React, { Component } from "react";
import ModalComponent from "../modals/modal.component";
import Table from "../data-table/data-list-default";
import axios from "axios";
import authHeader from "../../services/auth-header";

const { REACT_APP_API_ENDPOINT } = process.env;
const formInput=[
    {
        inputname:"id",
        label:"",
        typeinput:"hidden"
    },
    {
        inputname:"nm_pro",
        label:"Nama Provinsi",
        typeinput:"text"
    },
]
export default class Provinsi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listprovince:[],
        }
    }
    getProvince() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistprovinsi/', { headers: authHeader() }).then(
            reseponse => {
               
                this.setState({ listprovince: reseponse.data })
            }
        )
    }

    componentAction= cellInfo =>{
        const cellValue = this.state.listprovince[cellInfo.row.index];
        // console.log(cellValue)
        return (
            <>
                <ModalComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="Provinsi" formInput={formInput}  actionform="master/editprovinsi"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapusProvinsi} value={cellValue.id}>Hapus </button>
            </>
        )
      }
   
      hapusProvinsi = e => {
        let id = e.target.value;
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
          axios.delete(REACT_APP_API_ENDPOINT+`/master/deleteprovinsi/${id}`, { headers: authHeader() }).then(
            response => response.data)
            .then(provinsi => {
              this.RemoveListToState(id)
            })
            .catch(err => console.log(err))
        }
    }
   
    
      RemoveListToState(id) { 
        const itemIndex = this.state.listprovince.findIndex(data => data.id === id)
        this.state.listprovince.splice(itemIndex, 1);
        this.setState(this.state.listprovince);
      }
      componentDidMount(){
        this.getProvince()
      }
    render(){
    // console.log(this.state.listprovince)
        const column=[
            {
                Header: "#",
                accessor: (row, i) => i+1,
            },
            {
              Header: "Nama Provinsi",
              accessor:"nm_pro",
            },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listprovince;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Provinsi</li>
                    </ol>
                </nav>
                <ModalComponent buttonLabel="Tambah Provinsi" labelcomponent="Provinsi" formInput={formInput}  
                actionform="master/addprovinsi"/>
                <Table columns={column} data={data} size={10} filter="nm_pro" placeholder="Nama Provinsi"/>
            </>
        )
    }
}