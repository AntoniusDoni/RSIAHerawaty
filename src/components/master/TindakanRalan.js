import React, { Component } from "react";
import ModalwidthComponent from "../modals/modalwidth.component";
import Table from "../data-table/data-list-default";
import axios from "axios";
import authHeader from "../../services/auth-header";
import { kelas } from "./Kelas";
import rupiah from '../rupiah'
const { REACT_APP_API_ENDPOINT } = process.env;
const formInput=[
    {
        inputname:"id",
        label:"",
        typeinput:"hidden"
    },
    {
        inputname:"kode_tindakan",
        label:"Kode Tindakan",
        typeinput:"text"
    },
    {
        inputname:"nm_tindakan",
        label:"Nama Tindakan",
        typeinput:"text"
    },
    {
        inputname:"biaya_dokter",
        label:"Biaya Dokter",
        typeinput:"number"
    },
    {
        inputname:"jasa_rs",
        label:"Jasa RS",
        typeinput:"number"
    },
    {
        inputname:"bhp",
        label:"BHP",
        typeinput:"number"
    },
    {
        inputname:"jns_tindakan",
        label:"Jenis Tindakan",
        typeinput:"select",
        optionlist:[
            {value:1,label:"Rajal"},
            {value:2,label:"Ranap"}],
    },
    {
        inputname:"kelas",
        label:"Kelas",
        typeinput:"select",
        optionlist:kelas,
    },
]
export default class TindakanRalan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTindakan:[],
        }
    }
    getTindakan() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistTindakan/', { headers: authHeader() }).then(
            reseponse => {
               
                this.setState({ listTindakan: reseponse.data })
            }
        )
    }

    componentAction= cellInfo =>{
        const cellValue = this.state.listTindakan[cellInfo.row.index];
        // console.log(cellValue)
        return (
            <>
                <ModalwidthComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="Tindakan" formInput={formInput}  actionform="master/editTindakan"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapusTindakan} value={cellValue.id}>Hapus </button>
            </>
        )
      }
   
      hapusTindakan = e => {
        let id = e.target.value;
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
          axios.delete(REACT_APP_API_ENDPOINT+`/master/deleteTindakan/${id}`, { headers: authHeader() }).then(
            response => response.data)
            .then(Tindakan => {
              this.RemoveListToState(id)
            })
            .catch(err => console.log(err))
        }
    }
    jns_tindakan= cellInfo =>{
      const cellValue = this.state.listTindakan[cellInfo.row.index].jns_tindakan;
      let status="";
      if(cellValue===1){
          status=<label  key={this.state.listTindakan[cellInfo.row.index].kode_tindakan}>Rajal</label>
      }else if(cellValue===2){
        status=<label  key={this.state.listTindakan[cellInfo.row.index].kode_tindakan}>Ranap</label>
    
      }else{
          status=<label  key={this.state.listTindakan[cellInfo.row.index].kode_tindakan}>-</label>
      }
      return(
          <>{status}</>
      )
    }
    kelasKamar= cellInfo =>{
      const cellValue = this.state.listTindakan[cellInfo.row.index].kelas;
      let status="";
      if(cellValue===5){
          status=<label  key={this.state.listTindakan[cellInfo.row.index].kode_tindakan}>Kelas VVIP</label>
      }else if(cellValue===4){
        status=<label  key={this.state.listTindakan[cellInfo.row.index].kode_tindakan}>Kelas VIP</label>
    
      }else if(cellValue===3){
        status=<label  key={this.state.listTindakan[cellInfo.row.index].kode_tindakan}>Kelas 3</label>
    
      }
      else if(cellValue===2){
        status=<label c key={this.state.listTindakan[cellInfo.row.index].kode_tindakan}>Kelas 2</label>
    
      }else if(cellValue===1){
        status=<label key={this.state.listTindakan[cellInfo.row.index].kode_tindakan}>Kelas 1</label>
    
      }
      else{
          status=<label key={this.state.listTindakan[cellInfo.row.index].kode_tindakan}>-</label>
      }
      return(
        <>{status}</>
    )
    }
      RemoveListToState(id) { 
        const itemIndex = this.state.listTindakan.findIndex(data => data.id === id)
        this.state.listTindakan.splice(itemIndex, 1);
        this.setState(this.state.listTindakan);
      }
      componentDidMount(){
        this.getTindakan()
      }
    render(){
        const column=[
            {
                Header: "#",
                accessor: (row, i) => i+1,
            },
            {
              Header: "Kode Tindakan",
              accessor:"kode_tindakan",
            },
            {
                Header: "Nama Tindakan",
                accessor:"nm_tindakan",
              },
              {
                Header: "Biaya Dokter",
                accessor: row => rupiah(row.biaya_dokter),
              },
              {
                Header: "Jasa Rs",
                accessor: row => rupiah(row.jasa_rs),
              },
              {
                Header: "BHP",
                accessor: row => rupiah(row.bhp),
              },
              {
                Header: "Total",
                accessor: row => rupiah(row.total_tarif),
              },
              {
                Header: "Jenis",
                accessor:"jns_tindakan",
                Cell:this.jns_tindakan 
              },
              {
                Header: "Kelas",
                accessor:"kelas",
                Cell:this.kelasKamar 
              },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listTindakan;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Tindakan</li>
                    </ol>
                </nav>
                <ModalwidthComponent buttonLabel="Tambah Tindakan" labelcomponent="Tindakan" formInput={formInput}  
                actionform="master/addTindakan"/>
                <Table columns={column} data={data} size={10} filter="nm_tindakan" placeholder="Nama Tindakan"/>
            </>
        )
    }
}