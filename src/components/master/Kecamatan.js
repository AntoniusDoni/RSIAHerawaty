import React, { Component } from "react";
import ModalComponent from "../modals/modal.component";
import Table from "../data-table/data-list-default";
import axios from "axios";
import authHeader from "../../services/auth-header";

const { REACT_APP_API_ENDPOINT } = process.env;
export default class Kecamatan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formInput:undefined,
            listKecamatan:[],
            listkabupaten:[]
        }
    }
     getkabupaten() {
        return  axios.get(REACT_APP_API_ENDPOINT+'/master/getlistkabupaten/', { headers: authHeader() }).then(
            reseponse => {
                const options = reseponse.data.map(d => ({     
                    "value" : d.id,
                    "label" : d.nm_kab
              
                  }))
                this.setState({ listkabupaten: options },this.setFiledInpu)
            }
        )
    }
    getKecamatan() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistkecamatan/', { headers: authHeader() }).then(
            reseponse => {
               
                this.setState({ listKecamatan: reseponse.data })
            }
        )
    }

    componentAction= cellInfo =>{
        const cellValue = this.state.listKecamatan[cellInfo.row.index];
        // console.log(cellValue)
        return (
            <>
                <ModalComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="Kecamatan" formInput={this.state.formInput}  actionform="master/editKecamatan"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapusKecamatan} value={cellValue.id}>Hapus </button>
            </>
        )
      }
   
      hapusKecamatan = e => {
        let id = e.target.value;
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
          axios.delete(REACT_APP_API_ENDPOINT+`/master/deleteKecamatan/${id}`, { headers: authHeader() }).then(
            response => response.data)
            .then(Kecamatan => {
              this.RemoveListToState(id)
            })
            .catch(err => console.log(err))
        }
    }
   
    
      RemoveListToState(id) { 
        const itemIndex = this.state.listKecamatan.findIndex(data => data.id === id)
        this.state.listKecamatan.splice(itemIndex, 1);
        this.setState(this.state.listKecamatan);
      }
      componentDidMount(){
        this.getkabupaten()
        this.getKecamatan()
        
        
      }
      setFiledInpu(){
        const formInput=[
            {
                inputname:"id",
                label:"",
                typeinput:"hidden"
            },
            {
                inputname:"nm_kec",
                label:"Nama Kecamatan",
                typeinput:"text"
            },
            {
                inputname:"idkab",
                label:"Nama Kabupaten",
                typeinput:"select",
                optionlist:this.state.listkabupaten
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
              Header: "Nama Kabupaten",
              accessor:"kabupaten_kotum.nm_kab",
            },
            {
                Header: "Nama Kecamatan",
                accessor:"nm_kec",
              },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listKecamatan;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Kecamatan</li>
                    </ol>
                </nav>
                <ModalComponent buttonLabel="Tambah Kecamatan" labelcomponent="Kecamatan" formInput={this.state.formInput}                
                actionform="master/addKecamatan"/>
                <Table columns={column} data={data} size={10} filter="nm_kec" placeholder="Nama Kecamatan"/>
            </>
        )
    }
}