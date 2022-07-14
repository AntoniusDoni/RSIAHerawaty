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
        inputname:"kode_bangsal",
        label:"Kode Bangsal",
        typeinput:"text"
    },
    {
        inputname:"nm_bangsal",
        label:"Nama Bangsal",
        typeinput:"text"
    },
]

export default class Bangsal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listbangsal:[],
        }
    }
    getbangsal() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistbangsal/', { headers: authHeader() }).then(
            reseponse => {
               
                this.setState({ listbangsal: reseponse.data })
            }
        )
    }

    componentAction= cellInfo =>{
        const cellValue = this.state.listbangsal[cellInfo.row.index];
        // console.log(cellValue)
        return (
            <>
                <ModalComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="Bangsal" formInput={formInput}  actionform="master/editBangsal"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapusBangsal} value={cellValue.id}>Hapus </button>
            </>
        )
      }
   
      hapusBangsal = e => {
        let id = e.target.value;
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
          axios.delete(REACT_APP_API_ENDPOINT+`/master/deleteBangsal/${id}`, { headers: authHeader() }).then(
            response => response.data)
            .then(Bangsal => {
              this.RemoveListToState(id)
            })
            .catch(err => console.log(err))
        }
    }
   
    
      RemoveListToState(id) { 
        const itemIndex = this.state.listbangsal.findIndex(data => data.id === id)
        this.state.listbangsal.splice(itemIndex, 1);
        this.setState(this.state.listbangsal);
      }
      componentDidMount(){
        this.getbangsal()
      }
    render(){
    // console.log(this.state.listbangsal)
        const column=[
            {
                Header: "#",
                accessor: (row, i) => i+1,
            },
            {
                Header: "Kode Bangsal",
                accessor:"kode_bangsal",
              },
            {
              Header: "Nama Bangsal",
              accessor:"nm_bangsal",
            },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listbangsal;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Bangsal</li>
                    </ol>
                </nav>
                <ModalComponent buttonLabel="Tambah Bangsal" labelcomponent="Bangsal" formInput={formInput}  
                actionform="master/addBangsal"/>
                <Table columns={column} data={data} size={10} filter="nm_pro" placeholder="Nama Bangsal"/>
            </>
        )
    }
}