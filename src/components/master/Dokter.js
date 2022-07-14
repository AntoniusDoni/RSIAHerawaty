import React, { Component } from "react";
import ModalComponent from "../modals/modalwidth.component";
import Table from "../data-table/data-list-default";
import axios from "axios";
import authHeader from "../../services/auth-header";
import {goldarah} from './GolDarah'
import {spesialistik} from './Spesialistik'
const { REACT_APP_API_ENDPOINT } = process.env;
const formInput=[
    {
        inputname:"kode_dokter",
        label:"Kode Dokter",
        typeinput:"text"
    },
    {
        inputname:"nm_dokter",
        label:"Nama Dokter",
        typeinput:"text"
    },
    {
        inputname:"jk",
        label:"Jenis Kelamin",
        typeinput:"select",
        optionlist:[{value:1,label:"Laki-laki"},{value:0,label:"Perempuan"}]
    },
    {
        inputname:"tgl_lahir",
        label:"Tanggal Lahir",
        typeinput:"date"
    },
    {
        inputname:"alamat",
        label:"Alamat",
        typeinput:"text"
    },
    {
        inputname:"no_tlp",
        label:"Telpon",
        typeinput:"text"
    },
    {
        inputname:"no_ijin",
        label:"No Ijin",
        typeinput:"text"
    },
    {
        inputname:"gol_darah",
        label:"Golongan Darah",
        typeinput:"select",
        optionlist:goldarah
    },
    {
        inputname:"kd_sp",
        label:"Spesialis",
        typeinput:"select",
        optionlist:spesialistik
    },
    {
        inputname:"status_doktor",
        label:"Status ",
        typeinput:"select",
        optionlist:[{value:1,label:"Aktif"},{value:0,label:"Tidak Aktif"}]
    }
]
export default class Dokter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listdokter:[],
        }
    }
    getdokter() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistdokter/', { headers: authHeader() }).then(
            reseponse => {
               
                this.setState({ listdokter: reseponse.data })
            }
        )
    }

    componentAction= cellInfo =>{
        const cellValue = this.state.listdokter[cellInfo.row.index];
        // console.log(cellValue)
        return (
            <>
                <ModalComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="Dokter" formInput={formInput}  actionform="master/editdokter"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapusdokter} value={cellValue.kode_dokter}>Hapus </button>
            </>
        )
      }
      statusDokter=cellInfo =>{
        const cellValue = this.state.listdokter[cellInfo.row.index].status_doktor;
        let status="";
        if(cellValue===0){
            status=<label  key={this.state.listdokter[cellInfo.row.index].kode_dokter}>Tidak Aktif</label>
        }else{
            status=<label  key={this.state.listdokter[cellInfo.row.index].kode_dokter}>Aktif</label>
        }
        return(
            <>{status}</>
        )
      }
      hapusdokter = e => {
        let id = e.target.value;
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
          axios.delete(REACT_APP_API_ENDPOINT+`/master/deletedokter/${id}`, { headers: authHeader() }).then(
            response => response.data)
            .then(dokter => {
              this.RemoveListToState(id)
            })
            .catch(err => console.log(err))
        }
    }
   
    
      RemoveListToState(id) { 
        const itemIndex = this.state.listdokter.findIndex(data => data.id === id)
        this.state.listdokter.splice(itemIndex, 1);
        this.setState(this.state.listdokter);
      }
      componentDidMount(){
        this.getdokter()
      }
    render(){
    // console.log(this.state.listdokter)
        const column=[
            {
                Header: "#",
                accessor: (row, i) => i+1,
            },
            {
                Header: "Kode Dokter",
                accessor:"kode_dokter",
              },
            {
              Header: "Nama Dokter",
              accessor:"nm_dokter",
            },
            {
                Header: "Telphone ",
                accessor:"no_tlp",
            },
            {
                Header: "No Ijin ",
                accessor:"no_ijin",
              },
              {
                Header: "Status ",
                accessor:"status_doktor",
                Cell:this.statusDokter
              },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listdokter;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">dokter</li>
                    </ol>
                </nav>
                <ModalComponent buttonLabel="Tambah Dokter" labelcomponent="Dokter" formInput={formInput}  
                actionform="master/adddokter"/>
                <Table columns={column} data={data} size={10} filter="nm_pro" placeholder="Nama dokter"/>
            </>
        )
    }
}