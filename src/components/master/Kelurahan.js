import React, { Component } from "react";
import ModalComponent from "../modals/modal.component";
import Table from "../data-table/data-list-default";
import axios from "axios";
import authHeader from "../../services/auth-header";
const { REACT_APP_API_ENDPOINT } = process.env;

export default class Kelurahan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formInput:undefined,
            listKelurahan:[],
            listkecamatan:[]
        }
    }
     getkecamatan() {
        return  axios.get(REACT_APP_API_ENDPOINT+'/master/getlistkecamatan/', { headers: authHeader() }).then(
            reseponse => {
                const options = reseponse.data.map(d => ({     
                    "value" : d.id,
                    "label" : d.nm_kec
              
                  }))
                //   console.log(options)
                this.setState({ listkecamatan: options },this.setFiledInpu)
            }
        )
    }
    getKelurahan() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistkelurahan/', { headers: authHeader() }).then(
            reseponse => {
               
                this.setState({ listKelurahan: reseponse.data })
            }
        )
    }

    componentAction= cellInfo =>{
        const cellValue = this.state.listKelurahan[cellInfo.row.index];
        // console.log(cellValue)
        return (
            <>
                <ModalComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="Kelurahan" formInput={this.state.formInput}  actionform="master/editkelurahan"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapusKelurahan} value={cellValue.id}>Hapus </button>
            </>
        )
      }
   
      hapusKelurahan = e => {
        let id = e.target.value;
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
          axios.delete(REACT_APP_API_ENDPOINT+`/master/deletekelurahan/${id}`, { headers: authHeader() }).then(
            response => response.data)
            .then(Kelurahan => {
              this.RemoveListToState(id)
            })
            .catch(err => console.log(err))
        }
    }
   
    
      RemoveListToState(id) { 
        const itemIndex = this.state.listKelurahan.findIndex(data => data.id === id)
        this.state.listKelurahan.splice(itemIndex, 1);
        this.setState(this.state.listKelurahan);
      }
      componentDidMount(){
        this.getkecamatan()
        this.getKelurahan()
        
        
      }
      setFiledInpu(){
       
        const formInput=[
            {
                inputname:"id",
                label:"",
                typeinput:"hidden"
            },
            {
                inputname:"nm_kel",
                label:"Nama Kelurahan",
                typeinput:"text"
            },
            {
                inputname:"idkec",
                label:"Nama Kecamatan",
                typeinput:"select",
                optionlist:this.state.listkecamatan
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
              Header: "Nama Kecamatan",
              accessor:"kecamatan.nm_kec",
            },
            {
                Header: "Nama Kelurahan",
                accessor:"nm_kel",
              },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listKelurahan;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Kelurahan</li>
                    </ol>
                </nav>
                <ModalComponent buttonLabel="Tambah Kelurahan" labelcomponent="Kelurahan" formInput={this.state.formInput}                
                actionform="master/addkelurahan"/>
                <Table columns={column} data={data} size={10} filter="nm_kel" placeholder="Nama Kelurahan"/>
            </>
        )
    }
}