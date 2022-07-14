import React, { Component } from "react";
import ModalwidthComponent from "../modals/modalwidth.component";
import Table from "../data-table/data-list-default";
import axios from "axios";
import authHeader from "../../services/auth-header";
import { hari } from "./ListHari";
const { REACT_APP_API_ENDPOINT } = process.env;

export default class Jadwal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formInput:undefined,
            listdokter:[],
            listpoli:[],
            listjadwal:[]
        }
    }
     getdokter() {
        return  axios.get(REACT_APP_API_ENDPOINT+'/master/getlistdokter/', { headers: authHeader() }).then(
            reseponse => {
                const options = reseponse.data.map(d => ({     
                    "value" : d.kode_dokter,
                    "label" : d.nm_dokter
              
                  }))
                //   console.log(options)
                this.setState({ listdokter: options },this.setFiledInpu)
            }
        )
    }
    getpoli() {
        return  axios.get(REACT_APP_API_ENDPOINT+'/master/getlistpoli/', { headers: authHeader() }).then(
            reseponse => {
                const options = reseponse.data.map(d => ({     
                    "value" : d.kode_poli,
                    "label" : d.nama_poli
              
                  }))
                //   console.log(options)
                this.setState({ listpoli: options },this.setFiledInpu)
            }
        )
    }
    getkJadwal() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistjadwal/', { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listjadwal: reseponse.data })
            }
        )
    }

    componentAction= cellInfo =>{
        const cellValue = this.state.listjadwal[cellInfo.row.index];
        // console.log(cellValue)
        return (
            <>
                <ModalwidthComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="kamar" formInput={this.state.formInput}  actionform="master/editjadwal"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapuskamar} value={cellValue.id}>Hapus </button>
            </>
        )
      }
    
   
      hapuskamar = e => {
        let id = e.target.value;
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
          axios.delete(REACT_APP_API_ENDPOINT+`/master/deletekamar/${id}`, { headers: authHeader() }).then(
            response => response.data)
            .then(kamar => {
              this.RemoveListToState(id)
            })
            .catch(err => console.log(err))
        }
    }
   
    
      RemoveListToState(id) { 
        const itemIndex = this.state.listjadwal.findIndex(data => data.id === id)
        this.state.listjadwal.splice(itemIndex, 1);
        this.setState(this.state.listjadwal);
      }
      componentDidMount(){
        this.getdokter()
        this.getpoli()
        this.getkJadwal()
      }
      setFiledInpu(){
       
        const formInput=[
            {
                inputname:"id",
                label:"",
                typeinput:"hidden"
            },
            {
                inputname:"kd_dokter",
                label:"Nama Dokter",
                typeinput:"select",
                optionlist:this.state.listdokter
            },
            {
                inputname:"kd_poli",
                label:"Poli",
                typeinput:"select",
                optionlist:this.state.listpoli
            },
            {
                inputname:"hari",
                label:"Hari",
                typeinput:"select",
                optionlist:hari
            },
            {
                inputname:"jam_mulai",
                label:"Jam Mulai",
                typeinput:"time"
            },
            {
                inputname:"jam_selesai",
                label:"Jam Selesai",
                typeinput:"time"
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
              Header: "Nama Dokter",
              accessor:"dokter.nm_dokter",
            },
            {
                Header: "Poli",
                accessor:"kd_poli",
              },
              {
                Header: "Hari",
                accessor:"hari",
              },
              {
                Header: "Jam Mulai",
                accessor:"jam_mulai",
              },
              {
                Header: "Jam Selesai",
                accessor:"jam_selesai",
              },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listjadwal;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">kamar</li>
                    </ol>
                </nav>
                <ModalwidthComponent buttonLabel="Tambah Jadwal" labelcomponent="Jadwal" formInput={this.state.formInput}                
                actionform="master/addjadwal"/>
                <Table columns={column} data={data} size={10} filter="nm_kab" placeholder="Nama Kamar"/>
            </>
        )
    }
}