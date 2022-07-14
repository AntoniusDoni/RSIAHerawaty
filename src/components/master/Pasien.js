import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from "axios";
import authHeader from "../../services/auth-header";
import InputPasien from "./InputPasien";
import PenjabPasien from './PenjabPasien'
import { connect } from "react-redux";
import {io} from 'socket.io-client'
import Modalconfirmation from  "../modals/modalconfirmation";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FormGroup, Input, Row, Col } from 'reactstrap';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import padLeadingZeros from "../PadLeadingZeros";
import style from '../../pasein.module.css'
const { REACT_APP_API_ENDPOINT } = process.env;

class Pasien extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listpasien: [],
            listprovince: [],
            listkabupaten: [],
            listkecamatan: [],
            listkelurahan: [], 
            step:1,
            isopen:false,
            selectTab:1,
            labelcomponent:"",
            isedit:false,
            page: 1,
            digitLength:4,
            searchRm:"",
            searchnama:"",
            searchAlamat:"",
            searchtgl_reg:"",
            formData:{
                no_rm: "",
                nm_pasien: "",
                nik: "",
                alamat: "",
                ttgl_lahir: "",
                jk: "1",
                no_tlp: "",
                tempat_lahir: "",
                idprop: "1",
                idkabupaten: "1",
                idkecamatan: "2",
                idkelurahan: "",
                umur: "",
                sst_perkawinan: "1",
                gol_darah: "",
                pekerjaan: "",
                nm_ibu: "",
                no_kartu: "",
                idks: "",
                nm_penanggung: "",
                tgl_lahir: "",
                alamatpenjab: "",
                no_tlppenjab: "",
                no_ktp: "",
                id_kelurahanPen: "",
                hub_pasien:""
            }
        }
        this.addPasien=this.addPasien.bind(this)
        this.UpdatePasien=this.UpdatePasien.bind(this)
        this.clearAction=this.clearAction.bind(this)
    }
    onNext=e=>{
        const steps=parseInt(this.state.step)+1;
        this.setState({step:steps})
    }
    onPrev=e=>{
        const steps=parseInt(this.state.step)-1;
        this.setState({step:steps})
    }
    getPasien() {
        return axios.get(REACT_APP_API_ENDPOINT + '/master/getlistpasien/', { headers: authHeader() }).then(
            reseponse => {
                this.setState({listpasien: reseponse.data })
            }
        )
    }
   
     getage= input => e =>{
        const {value } = e.target;
        // console.log(value)
        let today = new Date(),
        dob = new Date(value),
        diff = today.getTime() - dob.getTime(),
        years = Math.floor(diff / 31556736000),
        days_diff= Math.floor((diff % 31556736000) / 86400000),
        months = Math.floor(days_diff / 30.4167),
        days = Math.floor(days_diff % 30.4167);
        const age=years+" Tahun "+months+" Bulan "+days+" hari";
    this.setState(Object.assign(this.state.formData,{umur:age}));
    }
    handleInputData= input => e =>{
        let values=e.target.value
        this.setState(Object.assign(this.state.formData,{[input]:values}));
    }
    
    renderSwictComponent(param){
    switch(param) {
            case 1:
      return (
        <div>
             <InputPasien nextStep={this.onNext} handleFormData={this.handleInputData} values={this.state.formData} getage={this.getage}
                listprovince={this.state.listprovince} listkabupaten={this.state.listkabupaten} listkecamatan={this.state.listkecamatan}
                listkelurahan={this.state.listkelurahan} onChangeselectedProp={this.onChangeselectedProp} onChangeselectekab={this.onChangeselectekab}
                onChangeselectekec={this.onChangeselectekec}
              />    
                     
        </div>
      );
      case 2:
        return (
            <PenjabPasien prevStep={this.onPrev} addPasien={this.addPasien} handleFormData={this.handleInputData} values={this.state.formData} 
                listprovincepenjab={this.state.listprovince} listkabupatenpenjab={this.state.listkabupaten} listkecamatanpenjab={this.state.listkecamatan}
                listkelurahanpenjab={this.state.listkelurahan} onChangeselectedProp={this.onChangeselectedProp} onChangeselectekab={this.onChangeselectekab}
                onChangeselectekec={this.onChangeselectekec}
            />
        );
            default:
              return (<>
               
              </>);
          }
    }
    getProvince() {
        return axios.get(REACT_APP_API_ENDPOINT + '/master/getlistprovinsi/', { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listprovince: reseponse.data },this.getkabupaten)
            }
        )
    }
    getkabupaten() {
        return axios.post(REACT_APP_API_ENDPOINT + '/master/getlistkabupatenbyprop/',{idprop:this.state.formData.idprop}, { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listkabupaten: reseponse.data },this.getkecamatan)
                if(reseponse.data.length===0){
                    this.setState(Object.assign(this.state.formData,{idkecamatan:"-",idkelurahan:"-",id_kelurahanPen:"-"}));  
                }
            }
        )
    }
    getkecamatan() {
        return axios.post(REACT_APP_API_ENDPOINT + '/master/getlistkecamatanbyidkab/',{idkab:this.state.formData.idkabupaten}, { headers: authHeader() }).then(
            reseponse => {               
                this.setState({ listkecamatan: reseponse.data },this.getkelurahan)
                if(reseponse.data.length===0){
                    this.setState(Object.assign(this.state.formData,{idkelurahan:"-",id_kelurahanPen:"-"}));  
                }
            }
        )
    }
    getkelurahan() {
        return axios.post(REACT_APP_API_ENDPOINT + '/master/getlistkelurahanbyidkec/',{idkec:this.state.formData.idkecamatan}, { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listkelurahan: reseponse.data })
            }
        )
    }
    onChangeselectedProp= e =>{
        let values=e.target.value
        this.setState(Object.assign(this.state.formData,{idprop:values}),this.getkabupaten);        
    }
    onChangeselectekab= e =>{
        let values=e.target.value
        this.setState(Object.assign(this.state.formData,{idkabupaten:values}),this.getkecamatan);
    }
    onChangeselectekec= e =>{
        let values=e.target.value
        this.setState(Object.assign(this.state.formData,{idkecamatan:values}),this.getkelurahan);
    }

   
    getlastRM(){
        return axios.get(REACT_APP_API_ENDPOINT + '/master/getlastrm/', { headers: authHeader() }).then(
            response => {
                let arrnopo;
                let laspo;
                if (response.data.no_rm.rows.length > 0) {
                    // arrnopo = response.data.no_rm.rows[0].no_rm.split("-");
                    arrnopo = response.data.no_rm.rows[0].no_rm
                    laspo = parseInt(arrnopo) + 1
                } else {
                    laspo = parseInt(response.data.no_rm.count) + 1;
                }
                // console.log(this.padLeadingZeros(laspo, 4))
                var digitLength=laspo.toString().length+1;
               this.setState({digitLength:digitLength});
                this.setState(Object.assign(this.state.formData,{no_rm: padLeadingZeros(laspo, digitLength)}));
            }, error => {
                this.setState(Object.assign(this.state.formData,{no_rm: ''}));
            }
        )
    }
   
    addPasien(){
        return axios.post(REACT_APP_API_ENDPOINT + '/master/addpasien/', this.state.formData,{ headers: authHeader() }).then(
            reseponse => {               
              this.setState({isopen:true,labelcomponent:"Data Berhasil Disimpan"})
              this.cleartStateInput();
            }
        )
    }
    cleartStateInput=()=>{
        this.setState(Object.assign(this.state.formData,{ 
            nm_pasien: "",
            nik: "",
            alamat: "",
            ttgl_lahir: "",
            jk: "1",
            no_tlp: "",
            tempat_lahir: "",
            idprop: "1",
            idkabupaten: "1",
            idkecamatan: "2",
            idkelurahan: "",
            umur: "",
            sst_perkawinan: "1",
            gol_darah: "",
            pekerjaan: "",
            nm_ibu: "",
            no_kartu: "",
            idks: "",
            nm_penanggung: "",
            tgl_lahir: "",
            alamatpenjab: "",
            no_tlppenjab: "",
            no_ktp: "",
            id_kelurahanPen: "",
            hub_pasien:""}));
    }
   
    editpasien= e=>{
        this.setState({selectTab:0,isedit:true})
        const data = this.state.listpasien.find(data => data.no_rm === parseInt(e.target.value));
        var digitLength=data.no_rm.toString().length+1;
        if(data.penanggung_jawab_pasiens.length>0){       
        this.setState(Object.assign(this.state.formData,{ 
            no_rm:padLeadingZeros(data.no_rm, digitLength),
            nm_pasien: data.nm_pasien,
            nik: data.nik,
            alamat: data.alamat,
            ttgl_lahir: data.ttgl_lahir,
            jk: data.jk,
            no_tlp: data.no_tlp,
            tempat_lahir: data.tempat_lahir,
            idprop: data.kelurahan.kecamatan.kabupaten_kotum.idprop,
            idkabupaten:data.kelurahan.kecamatan.idkab,
            idkecamatan: data.kelurahan.idkec,
            idkelurahan: data.id_kelurahan,
            umur: data.umur,
            sst_perkawinan: data.sst_perkawinan,
            gol_darah:data.gol_darah,
            pekerjaan: data.pekerjaan,
            nm_ibu: data.nm_ibu,
            no_kartu: "",
            idks: "",
            nm_penanggung: data.penanggung_jawab_pasiens[0].nm_penanggung,
            tgl_lahir: data.penanggung_jawab_pasiens[0].tgl_lahir,
            alamatpenjab: data.penanggung_jawab_pasiens[0].alamat,
            no_tlppenjab: data.penanggung_jawab_pasiens[0].no_tlp,
            no_ktp: data.penanggung_jawab_pasiens[0].no_ktp,
            // id_kelurahanPen:data.penanggung_jawab_pasiens[0].id_kelurahan,
            hub_pasien:data.penanggung_jawab_pasiens[0].hub_pasien}));
        // console.log(data)
        }else{
            this.setState(Object.assign(this.state.formData,{ 
            no_rm:padLeadingZeros(data.no_rm, digitLength),
            nm_pasien: data.nm_pasien,
            nik: data.nik,
            alamat: data.alamat,
            ttgl_lahir: data.ttgl_lahir,
            jk: data.jk,
            no_tlp: data.no_tlp,
            tempat_lahir: data.tempat_lahir,
            idprop: data.kelurahan.kecamatan.kabupaten_kotum.idprop,
            idkabupaten:data.kelurahan.kecamatan.idkab,
            idkecamatan: data.kelurahan.idkec,
            idkelurahan: data.id_kelurahan,
            umur: data.umur,
            sst_perkawinan: data.sst_perkawinan,
            gol_darah:data.gol_darah,
            pekerjaan: data.pekerjaan,
            nm_ibu: data.nm_ibu,
            no_kartu: "",
            idks: "",
            nm_penanggung: "",
            tgl_lahir: "",
            alamatpenjab: "",
            no_tlppenjab: "",
            no_ktp: "",
            // id_kelurahanPen:data.penanggung_jawab_pasiens[0].id_kelurahan,
            hub_pasien:""}));
        }
    }
    UpdatePasien(){
        // console.log("sd")
        return axios.post(REACT_APP_API_ENDPOINT + '/master/updatepasien/', this.state.formData,{ headers: authHeader() }).then(
            reseponse => { 
                // console.log(reseponse.data)              
              this.setState({isopen:true,labelcomponent:"Data Berhasil Diperbaharui"})
              this.cleartStateInput();
              this.getlastRM();
              this.clearAction()
              let data = [...this.state.listpasien];
              const pasien=reseponse.data;
              const itemIndex = this.state.listpasien.findIndex(data => data.no_rm === reseponse.data.no_rm)          
              data[itemIndex].nm_pasien=pasien.nm_pasien
              data[itemIndex].nik=pasien.nik
              data[itemIndex].alamat=pasien.alamat
              data[itemIndex].ttgl_lahir=pasien.ttgl_lahir
              data[itemIndex].jk=pasien.jk
              data[itemIndex].no_tlp=pasien.no_tlp
              data[itemIndex].tempat_lahir=pasien.tempat_lahir
              data[itemIndex].id_kelurahan=pasien.id_kelurahan
              data[itemIndex].umur=pasien.umur
              data[itemIndex].sst_perkawinan=pasien.sst_perkawinan
              data[itemIndex].gol_darah=pasien.gol_darah
              data[itemIndex].pekerjaan=pasien.pekerjaan
              data[itemIndex].nm_ibu=pasien.nm_ibu
              data[itemIndex].pesien_penjamins=pasien.pesien_penjamins
              data[itemIndex].kelurahan=pasien.kelurahan
              this.setState({ data });
            }
        )
    }
    hapuspasien= e =>{
        let id = e.target.value;
        var digitLength=id.toString().length+1;
        confirmAlert({
          title: 'Konfirmasi Hapus Data',
          message: 'Apakah Anda akan Menghapus Data Pasien dengan No RM '+padLeadingZeros(id, digitLength),
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.inactivepasien(id)            
            },
            {
              label: 'No',            
            }
          ]
        });
      }
    inactivepasien= id =>{      
        return axios.post(REACT_APP_API_ENDPOINT + '/master/deletpasien/',{no_rm:id},{ headers: authHeader() }).then(
            response=>{
            // console.log(response.data.delete===true)
            if(response.data.delete===true){
            const index = this.state.listpasien.findIndex(data => data.no_rm === id)
            this.state.listpasien.splice(index, 1);
            this.setState(this.state.listpasien);
            }         
            }
        )
    }
    clearAction=e=>{
        
        this.setState({isedit:false})
        this.cleartStateInput();
        this.getlastRM();
    }
    toggle = () => {
        this.setState(prevState => ({
            isopen: !prevState.isopen
        }))
      }
    handleInputDateChange = (date) => {
        // console.log(date)
        this.setState({ searchtgl_reg: date }, this.getFilterPasien)
    }
    onChangeInputSearch = e => {
        this.setState({ [e.target.name]: e.target.value },this.getFilterPasien)
    }
    getFilterPasien(){
        var no_rm="";
        if(this.state.searchRm!==""){
            no_rm=parseInt(this.state.searchRm);
        }
        return axios.post(REACT_APP_API_ENDPOINT + '/master/getfilterlistpasien/',{
            searchrm:no_rm,
            searchnama:this.state.searchnama,
            searchAlamat:this.state.searchAlamat,
            searchtgl_reg:this.state.searchtgl_reg,
        }, { headers: authHeader() }).then(
            reseponse => {
                this.setState({listpasien: reseponse.data })
            }
        )
    }
    componentDidMount() {
        this.getProvince();
        this.getkabupaten();
        this.getlastRM();
        this.getPasien();
        // console.log(this.props.user)
        let token=this.props.user.accessToken
        const socket = io.connect('http://localhost:3000', {
                  query: {token}
              })
              
        socket.on("newRM", data => {
        //   console.log(data) 
        var digitLength=data.toString().length+1;
          this.setState(Object.assign(this.state.formData,{no_rm: padLeadingZeros(data, digitLength)}));
          });
          socket.on("pasien", pasien => {
            const itemIndex = this.state.listpasien.findIndex(data => data.no_rm === pasien.no_rm)               
                const newArray = {
                    "no_rm":pasien.no_rm,
                    "nm_pasien":pasien.nm_pasien,
                    "nik":pasien.nik,
                    "alamat":pasien.alamat,
                    "ttgl_lahir":pasien.ttgl_lahir,
                    "jk":pasien.jk,
                    "no_tlp":pasien.no_tlp,
                    "tempat_lahir":pasien.tempat_lahir,
                    "id_kelurahan":pasien.id_kelurahan,
                    "umur":pasien.umur,
                    "sst_perkawinan":pasien.sst_perkawinan,
                    "gol_darah":pasien.gol_darah,
                    "pekerjaan":pasien.pekerjaan,
                    "nm_ibu":pasien.nm_ibu,
                    "penanggung_jawab_pasiens":pasien.penanggung_jawab_pasiens,
                    "kelurahan":pasien.kelurahan
                }
                if (itemIndex === -1) {
                    this.setState(prevState => ({
                        listpasien: [...prevState.listpasien, newArray]
                    }))
                }
            });
          socket.on('disconnect', () => {
            // console.log('Disconnected');
            
        })
    }
   
    addRegPasien(pasien){
        if(this.props.labelpasien==='Pilih pasien'){
          
            const data=this.state.listpasien.find(data=>data.no_rm===pasien);
            // console.data(data)
            return(
                <button className="btn btn-primary" style={{margin:"10px"}} onClick={this.props.addRegpasien(data)}>Add</button>
            )
        }else{
            return(<></>)
        }
    }
    sliceData = (data, page, rowsPerPage) => {
        // if (data !== null) {
            return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
        // }

    };
    calculateRange = (data, rowsPerPage) => {
        const range = [];
        // if (data !== null) {
            const num = Math.ceil(data.length / rowsPerPage);
            for (let i = 1; i <= num; i++) {
                range.push(i);
            }
        // }
        return range;
    }
    setPage = data => e => {
        this.setState({ page: data })
    }
    render(){
       
        const slice = this.sliceData(this.state.listpasien, this.state.page, 20)
        const range = this.calculateRange(this.state.listpasien, 20);
        const listPasien=slice.map((pasien,index)=>{
            var numberIndexpage=0;
            if(this.state.page!==1){
                numberIndexpage=this.state.page*10;
            }
            var incriment=1;
            if(pasien.no_rm.toString().length<3){
                incriment=3;
            }
            var digitLength=pasien.no_rm.toString().length+incriment;
            
            return(
                <tr key={pasien.no_rm+"-"+index}>
                    <td>{index+1+numberIndexpage}</td>
                    <td>{padLeadingZeros(pasien.no_rm, digitLength)}</td>
                    <td>{pasien.nm_pasien}</td>
                    <td>{pasien.ttgl_lahir}</td>
                    <td>{pasien.alamat}</td>
                    <td>{pasien.no_tlp}</td>
                    <td>
                    {this.addRegPasien(pasien.no_rm)}
                        <button className="btn btn-warning" style={{margin:"10px"}} onClick={this.editpasien} value={pasien.no_rm}>Ubah</button>
                        <button className="btn btn-danger" onClick={this.hapuspasien} value={pasien.no_rm} style={{margin:"10px"}}>Hapus</button>
                    </td>
                </tr>
            )
        })
        return(
            <>
             <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Pasien</li>
                    </ol>
                </nav>
            <Tabs 
            selectedIndex={this.state.selectTab}    
            onSelect={(index) => this.setState({selectTab:index})}       
            // onChange={(index) => this.setState({selectTab:index })}
            >
            <TabList >
                <Tab >Input Pasien</Tab>
                <Tab>Daftar Pasien</Tab>
            </TabList>
            <TabPanel tabIndex={0}>
             {
                this.state.isedit===false ?(<>
                    {this.renderSwictComponent(this.state.step)}
                    </>
                ):(<>
                    <InputPasien nextStep={this.onNext} handleFormData={this.handleInputData} values={this.state.formData} getage={this.getage}
                listprovince={this.state.listprovince} listkabupaten={this.state.listkabupaten} listkecamatan={this.state.listkecamatan}
                listkelurahan={this.state.listkelurahan} onChangeselectedProp={this.onChangeselectedProp} onChangeselectekab={this.onChangeselectekab}
                onChangeselectekec={this.onChangeselectekec} isedit={this.state.isedit} UpdatePasien={this.UpdatePasien} clearAction={this.clearAction}
              />   
                </>)
             }
               
            </TabPanel>
            <TabPanel tabIndex={1}>
            <FormGroup className="search-formgrup">
                            <Row className="justify-content-md-center">

                                <Col className="col-auto">
                                    <Input type="text" name="searchRm" placeholder="No RM" onChange={this.onChangeInputSearch}></Input>
                                </Col>
                                <Col className="col-auto">
                                    <Input type="text" name="searchnama" placeholder="Nama" onChange={this.onChangeInputSearch}></Input>
                                </Col>
                                <Col className="col-auto">
                                    <Input type="text" name="searchAlamat" placeholder="Alamat" onChange={this.onChangeInputSearch}></Input>
                                </Col>
                                <Col className="col-auto">
                                    {/* <DatePicker name="searchtgl_reg" id="searchtgl_reg"
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.state.searchtgl_reg}
                                        onChange={(date) => this.handleInputDateChange(date)}
                                        className="form-control"

                                    /> */}
                                    <Input type="date" name="searchtgl_reg" placeholder="Tanggal Lahir" onChange={this.onChangeInputSearch}></Input>
                                </Col>
                                <Col className="col-auto">
                                    {/* <button type="button" className="btn btn-secondary" onClick={this.getFilterPasien()}>Cari</button> */}
                                </Col>
                            </Row>
                        </FormGroup>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>No RM</td>
                            <td>Nama Pasien</td>
                            <td>Tgl Lahir</td>
                            <td>Alamat</td>
                            <td>Telpone</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>{listPasien}</tbody>
                </table>
                <nav aria-label="Page navigation example">
                            <ul className={style.pagination+" justify-content-start"} >

                                {
                                    range.map((el, index) => (
                                        <li className="page-item" key={index}>
                                            <button className={style.pageLink+" page-link"} onClick={this.setPage(el)}>{el}</button>
                                        </li>
                                    ))
                                }

                            </ul>
                        </nav>
            </TabPanel>
        </Tabs>
        <Modalconfirmation isopen={this.state.isopen} labelcomponent={this.state.labelcomponent} toggle={this.toggle}/>
        </>
        )
    }
}
function mapStateToProps(state) {
    const { user } = state.auth;
    return {
      user
    };
  }
  export default connect(mapStateToProps)(Pasien);