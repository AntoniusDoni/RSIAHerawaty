import React, { Component } from "react";
import ModalComponent from "../modals/modal.component";
import Table from "../data-table/data-list-default";
import axios from "axios";
import authHeader from "../../services/auth-header";

const { REACT_APP_API_ENDPOINT } = process.env;
const formInput=[
    {
        inputname:"kode_poli",
        label:"Kode Poli",
        typeinput:"text"
    },
    {
        inputname:"nama_poli",
        label:"Nama Poli",
        typeinput:"text"
    },
]

export default class Poli extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listPoli:[],
        }
    }
    getPoli() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistpoli/', { headers: authHeader() }).then(
            reseponse => {
               
                this.setState({ listPoli: reseponse.data })
            }
        )
    }

    componentAction= cellInfo =>{
        const cellValue = this.state.listPoli[cellInfo.row.index];
        // console.log(cellValue)
        return (
            <>
                <ModalComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="Poli" formInput={formInput}  actionform="master/editpoli"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapuspoli} value={cellValue.kode_poli}>Hapus </button>
            </>
        )
      }
   
      hapuspoli = e => {
        let id = e.target.value;
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
          axios.delete(REACT_APP_API_ENDPOINT+`/master/deletepoli/${id}`, { headers: authHeader() }).then(
            response => response.data)
            .then(poli => {
              this.RemoveListToState(id)
            })
            .catch(err => console.log(err))
        }
    }
   
    
      RemoveListToState(id) { 
        const itemIndex = this.state.listPoli.findIndex(data => data.id === id)
        this.state.listPoli.splice(itemIndex, 1);
        this.setState(this.state.listPoli);
      }
      componentDidMount(){
        this.getPoli()
      }
    render(){
    // console.log(this.state.listPoli)
        const column=[
            {
                Header: "#",
                accessor: (row, i) => i+1,
            },
            {
                Header: "Kode Poli",
                accessor:"kode_poli",
              },
            {
              Header: "Nama Poli",
              accessor:"nama_poli",
            },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listPoli;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">poli</li>
                    </ol>
                </nav>
                <ModalComponent buttonLabel="Tambah Poli" labelcomponent="poli" formInput={formInput}  
                actionform="master/addpoli"/>
                <Table columns={column} data={data} size={10} filter="nm_pro" placeholder="Nama poli"/>
            </>
        )
    }
}