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
        inputname:"nama_penjab",
        label:"Nama Penjamin",
        typeinput:"text"
    },
];
export default class Penjamin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listPenjamin:[],
        }
    }
    getPenjamin() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistpenjamin/', { headers: authHeader() }).then(
            reseponse => {
               
                this.setState({ listPenjamin: reseponse.data })
            }
        )
    }

    componentAction= cellInfo =>{
        const cellValue = this.state.listPenjamin[cellInfo.row.index];
        // console.log(cellValue)
        return (
            <>
                <ModalComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="Penjamin" formInput={formInput}  actionform="master/editpenjamin"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapusPenjamin} value={cellValue.id}>Hapus </button>
            </>
        )
      }
   
      hapusPenjamin = e => {
        let id = e.target.value;
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
          axios.delete(REACT_APP_API_ENDPOINT+`/master/deletepenjamin/${id}`, { headers: authHeader() }).then(
            response => response.data)
            .then(Penjamin => {
              this.RemoveListToState(id)
            })
            .catch(err => console.log(err))
        }
    }
   
    
      RemoveListToState(id) { 
        const itemIndex = this.state.listPenjamin.findIndex(data => data.id === id)
        this.state.listPenjamin.splice(itemIndex, 1);
        this.setState(this.state.listPenjamin);
      }
      componentDidMount(){
        this.getPenjamin()
      }
    render(){
    // console.log(this.state.listPenjamin)
        const column=[
            {
                Header: "#",
                accessor: (row, i) => i+1,
            },
            {
              Header: "Nama Penjamin",
              accessor:"nama_penjab",
            },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listPenjamin;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Penjamin</li>
                    </ol>
                </nav>
                <ModalComponent buttonLabel="Tambah Penjamin" labelcomponent="Penjamin" formInput={formInput}  
                actionform="master/addpenjamin"/>
                <Table columns={column} data={data} size={10} filter="nama_penjab" placeholder="Nama Penjamin"/>
            </>
        )
    }
}