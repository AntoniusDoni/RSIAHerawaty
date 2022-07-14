import React, { Component } from "react";
import ModalwidthComponent from "../modals/modalwidth.component";
import Table from "../data-table/data-list-default";
import axios from "axios";
import authHeader from "../../services/auth-header";
import { kelas } from "./Kelas";
import { sttskmar } from "./StatusKamar";
const { REACT_APP_API_ENDPOINT } = process.env;

export default class Kamar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formInput:undefined,
            listkamar:[],
            listbangsal:[]
        }
    }
     getbangsal() {
        return  axios.get(REACT_APP_API_ENDPOINT+'/master/getlistbangsal/', { headers: authHeader() }).then(
            reseponse => {
                const options = reseponse.data.map(d => ({     
                    "value" : d.id,
                    "label" : d.nm_bangsal
              
                  }))
                //   console.log(options)
                this.setState({ listbangsal: options },this.setFiledInpu)
            }
        )
    }
    getkamar() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistkamar/', { headers: authHeader() }).then(
            reseponse => {
               
                this.setState({ listkamar: reseponse.data })
            }
        )
    }

    componentAction= cellInfo =>{
        const cellValue = this.state.listkamar[cellInfo.row.index];
        // console.log(cellValue)
        return (
            <>
                <ModalwidthComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="kamar" formInput={this.state.formInput}  actionform="master/editkamar"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapuskamar} value={cellValue.id}>Hapus </button>
            </>
        )
      }
      statusKamar= cellInfo =>{
        const cellValue = this.state.listkamar[cellInfo.row.index].stts_kamar;
        let status="";
        if(cellValue===0){
            status=<label className="text-success" key={this.state.listkamar[cellInfo.row.index].kode_kamar}>Kosong</label>
        }else{
            status=<label className="text-success" key={this.state.listkamar[cellInfo.row.index].kode_kamar}>Isi</label>
        }
        return(
            <>{status}</>
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
        const itemIndex = this.state.listkamar.findIndex(data => data.id === id)
        this.state.listkamar.splice(itemIndex, 1);
        this.setState(this.state.listkamar);
      }
      componentDidMount(){
        this.getbangsal()
        this.getkamar()
        
        
      }
      setFiledInpu(){
       
        const formInput=[
            {
                inputname:"id",
                label:"",
                typeinput:"hidden"
            },
            {
                inputname:"idbangsal",
                label:"Nama Bangsal",
                typeinput:"select",
                optionlist:this.state.listbangsal
            },
            {
                inputname:"kode_kamar",
                label:"Kode Kamar",
                typeinput:"text"
            },
            {
                inputname:"nm_kamar",
                label:"Nama Kamar",
                typeinput:"text"
            },           
            {
                inputname:"harga",
                label:"Harga",
                typeinput:"number"
            },
            {
                inputname:"kelas",
                label:"Kelas",
                typeinput:"select",
                optionlist:kelas,
            },
            {
                inputname:"stts_kamar",
                label:"Status Kamar",
                typeinput:"select",
                optionlist:sttskmar,
            },
            {
                inputname:"isactive",
                label:"Status Aktifasi",
                typeinput:"select",
                optionlist:[{value:"1",label:"Aktif"},{value:"0",label:"Inaktif"}],
            },
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
              Header: "Nama bangsal",
              accessor:"bangsal.nm_bangsal",
            },
            {
                Header: "Kode kamar",
                accessor:"kode_kamar",
              },
              {
                Header: "Nama kamar",
                accessor:"nm_kamar",
              },
              {
                Header: "Status kamar",
                accessor:"stts_kamar",
                Cell:this.statusKamar 
              },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listkamar;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">kamar</li>
                    </ol>
                </nav>
                <ModalwidthComponent buttonLabel="Tambah kamar" labelcomponent="Kamar" formInput={this.state.formInput}                
                actionform="master/addkamar"/>
                <Table columns={column} data={data} size={10} filter="nm_kab" placeholder="Nama Kamar"/>
            </>
        )
    }
}