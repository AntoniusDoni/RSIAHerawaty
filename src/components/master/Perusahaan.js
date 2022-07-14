import React, { Component } from "react";
import ModalwidthComponent from "../modals/modalwidth.component";
import Table from "../data-table/data-list-default";
import axios from "axios";
import authHeader from "../../services/auth-header";

const { REACT_APP_API_ENDPOINT } = process.env;

export default class Perusahaan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formInput:undefined,
            listpenjamin:[],
            listperusahaan:[]
        }
    }
    getpenjamin() {
        return  axios.get(REACT_APP_API_ENDPOINT+'/master/getlistpenjamin/', { headers: authHeader() }).then(
            reseponse => {
                const options = reseponse.data.map(d => ({     
                    "value" : d.id,
                    "label" : d.nama_penjab
              
                  }))
                this.setState({ listpenjamin: options },this.setFiledInpu)
            }
        )
    }

    getperusahaan() {
        return axios.get(REACT_APP_API_ENDPOINT+'/master/getlistiks/', { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listperusahaan: reseponse.data })
            }
        )
    }
    componentAction= cellInfo =>{
        const cellValue = this.state.listperusahaan[cellInfo.row.index];
        return (
            <>
                <ModalwidthComponent buttonLabel="Ubah" dataprops={cellValue} labelcomponent="Perusahaan" formInput={this.state.formInput}  actionform="master/editiks"/>
                {" "}
                <button className="btn btn-danger" onClick={this.hapusperusahaan} value={cellValue.id}>Hapus </button>
            </>
        )
      }
      hapusperusahaan = e => {
        let id = e.target.value;
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
          axios.delete(REACT_APP_API_ENDPOINT+`/master/deleteiks/${id}`, { headers: authHeader() }).then(
            response => response.data)
            .then(kamar => {
              this.RemoveListToState(id)
            })
            .catch(err => console.log(err))
        }
    }
    RemoveListToState(id) { 
        const itemIndex = this.state.listperusahaan.findIndex(data => data.id === id)
        this.state.listperusahaan.splice(itemIndex, 1);
        this.setState(this.state.listperusahaan);
      }
      setFiledInpu(){
        const formInput=[
            {
                inputname:"id",
                label:"",
                typeinput:"hidden"
            },
            {
                inputname:"nama_perusahaan",
                label:"Nama Perusahaan",
                typeinput:"text",
            },
            {
                inputname:"alamat",
                label:"Alamat",
                typeinput:"text",
            },
            {
                inputname:"no_tlp",
                label:"Telephone",
                typeinput:"text",
            },
            {
                inputname:"no_kontrak",
                label:"No Kontrak",
                typeinput:"text",
            },
            {
                inputname:"tgl_mulai",
                label:"Tgl Mulai",
                typeinput:"date",
            },
            {
                inputname:"tgl_selesai",
                label:"Tgl Selesai",
                typeinput:"date",
            },
            {
                inputname:"idpenjamin",
                label:"Jenis Penjamin",
                typeinput:"select",
                optionlist:this.state.listpenjamin,
            },
           
        ]
        this.setState({formInput:formInput})
      }
      componentDidMount(){
        this.getpenjamin();
        this.getperusahaan()
      }
    render(){
        const column=[
            {
                Header: "#",
                accessor: (row, i) => i+1,
            },
            {
              Header: "Nama Perusahaan",
              accessor:"nama_perusahaan",
            },
            {
                Header: "Alamat",
                accessor:"alamat",
              },
              {
                Header: "Telphone",
                accessor:"no_tlp",
              },
              {
                Header: "No Kontrak",
                accessor:"no_kontrak",
              },
              {
                Header: "Tgl Mulai",
                accessor:"tgl_mulai",
              },
              {
                Header: "Tgl Selesai",
                accessor:"tgl_selesai",
              },
              {
                Header: "Jenis",
                accessor:"penjamin.nama_penjab",
              },
            {
                Header:"Action",
                accessor:"id",
                Cell:this.componentAction 
              }
        ];
        
        const data = this.state.listperusahaan;
        return(
            <>
                <nav  aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">kamar</li>
                    </ol>
                </nav>
                <ModalwidthComponent buttonLabel="Tambah Rekanan" labelcomponent="Rekanan" formInput={this.state.formInput}                
                actionform="master/addiks"/>
                <Table columns={column} data={data} size={10} filter="nama_perusahaan" placeholder="Nama Rekanan"/>
            </>
        )
    }
}