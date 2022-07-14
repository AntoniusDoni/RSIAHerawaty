import React, { Component } from "react";
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import InputRegistrasi from './InputRegistrasi'
import moment from 'moment';
import padLeadingZeros from '../PadLeadingZeros'
import axios from "axios";
import authHeader from "../../services/auth-header";
import { io } from 'socket.io-client'
import * as Icon from 'react-bootstrap-icons'
import Modalconfirmation from '../modals/modalconfirmation'
import { FormGroup, Input, Row, Col } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { confirmAlert } from 'react-confirm-alert';
import {ComponentPrintReg} from '../print/componentPrintReg';
import ReactToPrint from "react-to-print";
const { REACT_APP_API_ENDPOINT, REACT_APP_API_HOST } = process.env;
moment.defineLocale('id', { weekdays: 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'), })

class Registrasipoli extends Component {
    constructor(props) {
        super(props);
        this.componentRef = React.createRef();
        this.state = {
            jnsRawt: "Rawat Jalan",
            listRegister: [],
            listpoli: [],
            listdokter: [],
            listiks: [],
            listpenjamin: [],
            ispenjamin: false,
            selectTab: 1,
            isedit: false,
            isnokartu: false,
            hari: moment().format('dddd'),
            jam: moment().format('h:mm:ss'),
            contextValue:[],
            formData: {
                no_reg: "",
                no_rm: "",
                nama_pasien: "",
                nik: "",
                alamat: "",
                ttgl_lahir: "",
                jk: "1",
                no_tlp: "",
                tgl_reg: new Date(),
                kode_dokter: "",
                kode_poli: "",
                idiks: "",
                idpenjamin: "1",
                stts_daftar: "1",
                stts_bayar: "Belum Lunas",
                stts_rawat: "1",
                stts_periksa: "",
                umurdaftar: "",
                nm_penanggung: "",
                alamatPj: "",
                no_tlpPj: "",
                hub_pasien: "",
                no_kartu: "",
                idpj:"0"
            },
            isopen: false,
            isopenConfirm: false,
            searchtgl_reg: new Date(),
            searchRm: "",
            searchpoli: "",
            searchdokter: "",
            serachstts_daftar: "",
            page: 1,
            ispj:"disabled",
            visible:false,
            yPos:"0px",
            xPos:"0px"
        }
        this.addRegPasien = this.addRegPasien.bind(this)
        this.UpdateRegPasien = this.UpdateRegPasien.bind(this)
        this.cleartStateInput = this.cleartStateInput.bind(this)
        this.getRegistrasi = this.getRegistrasi.bind(this)
    }
    keyShort = (event) => {
        if (event.key === 'Shift') {
            this.setState(prevState => ({
                isopen: !prevState.isopen
            }))
        }
    }
    checkPj=e=>{
        this.setState(prevState => ({
            ispj: !prevState.ispj
        }))
    }
    toggle = e => {
        this.setState(prevState => ({
            isopen: !prevState.isopen
        }))
    }
    toggleConfrim = e => {
        this.setState(prevState => ({
            isopenConfirm: !prevState.isopenConfirm
        }))
    }
    handleInputData = input => e => {
        if (input === 'tgl_reg') {

            this.setState(Object.assign(this.state.formData, { [input]: e }));
        } else {
            let values = e.target.value

            if (input === 'idpenjamin') {
                if (values === '3') {
                    this.setState({ ispenjamin: true, isnokartu: true })
                } else {
                    this.setState({ ispenjamin: false })
                }
                if (values === '2' || values === '3') {
                    this.setState({ isnokartu: true })
                } else {
                    this.setState({ isnokartu: false })
                }
                this.setState(Object.assign(this.state.formData, { [input]: values, stts_daftar: values }), this.getIks);
            }
            else {
                this.setState(Object.assign(this.state.formData, { [input]: values }));
            }
        }
    }
    onChangeInputSearch = e => {
        this.setState({ [e.target.name]: e.target.value },this.getRegistrasi)
    }
    onChangeSelectSearch = input => e => {
        if (e === null) {
            this.setState({ [input]: "" }, this.getRegistrasi)
        } else {
            this.setState({ [input]: e.value }, this.getRegistrasi)
        }

    }
    adddpasien = pasien => e => {
        // console.log(pasien)
        let today = new Date(),
            dob = new Date(pasien.ttgl_lahir),
            diff = today.getTime() - dob.getTime(),
            years = Math.floor(diff / 31556736000),
            days_diff = Math.floor((diff % 31556736000) / 86400000),
            months = Math.floor(days_diff / 30.4167),
            days = Math.floor(days_diff % 30.4167);
        const age = years + " Tahun " + months + " Bulan " + days + " hari";
        // console.log(pasien.penanggung_jawab_pasiens[0])
        var incriment=1;
        if(pasien.no_rm.toString().length<3){
            incriment=3;
        }
        var digitLength=pasien.no_rm.toString().length+incriment;   
        if(pasien.penanggung_jawab_pasiens.length>0){    
            if(pasien.penanggung_jawab_pasiens[0].nm_penanggung!=="-"){
                this.setState(Object.assign(this.state.formData, {          
                    no_rm: padLeadingZeros(pasien.no_rm, digitLength),
                    nama_pasien: pasien.nm_pasien,
                    nik: pasien.nik,
                    ttgl_lahir: pasien.ttgl_lahir,
                    umurdaftar: age,
                    jk: pasien.jk,
                    alamat: pasien.alamat + "," + pasien.kelurahan.nm_kel + ", " + pasien.kelurahan.kecamatan.nm_kec + ", " + pasien.kelurahan.kecamatan.kabupaten_kotum.nm_kab + "," + pasien.kelurahan.kecamatan.kabupaten_kotum.provinsi.nm_pro,
                    no_tlp: pasien.no_tlp,
                    nm_penanggung: pasien.penanggung_jawab_pasiens[0].nm_penanggung,
                    alamatPj: pasien.penanggung_jawab_pasiens[0].alamat + "," + pasien.penanggung_jawab_pasiens[0].kelurahan.nm_kel + ", " + pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.nm_kec + ", " + pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.kabupaten_kotum.nm_kab + "," + pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.kabupaten_kotum.provinsi.nm_pro,
                    no_tlpPj: pasien.penanggung_jawab_pasiens[0].no_tlp,
                    hub_pasien: pasien.penanggung_jawab_pasiens[0].hub_pasien,
                    idpj:pasien.penanggung_jawab_pasiens[0].id
                }));
            }else{
                this.setState({ispj:""})
                this.setState(Object.assign(this.state.formData, {          
                    no_rm: padLeadingZeros(pasien.no_rm, digitLength),
                    nama_pasien: pasien.nm_pasien,
                    nik: pasien.nik,
                    ttgl_lahir: pasien.ttgl_lahir,
                    umurdaftar: age,
                    jk: pasien.jk,
                    alamat: pasien.alamat + "," + pasien.kelurahan.nm_kel + ", " + pasien.kelurahan.kecamatan.nm_kec + ", " + pasien.kelurahan.kecamatan.kabupaten_kotum.nm_kab + "," + pasien.kelurahan.kecamatan.kabupaten_kotum.provinsi.nm_pro,
                    no_tlp: pasien.no_tlp,
                    nm_penanggung: pasien.penanggung_jawab_pasiens[0].nm_penanggung,
                    alamatPj: pasien.penanggung_jawab_pasiens[0].alamat + "," + pasien.penanggung_jawab_pasiens[0].kelurahan.nm_kel + ", " + pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.nm_kec + ", " + pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.kabupaten_kotum.nm_kab + "," + pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.kabupaten_kotum.provinsi.nm_pro,
                    no_tlpPj: pasien.penanggung_jawab_pasiens[0].no_tlp,
                    hub_pasien: pasien.penanggung_jawab_pasiens[0].hub_pasien,
                    idpj:pasien.penanggung_jawab_pasiens[0].id
                }));
            }          
    }else{
        
        this.setState(Object.assign(this.state.formData, {         
            no_rm: padLeadingZeros(pasien.no_rm, digitLength),
            nama_pasien: pasien.nm_pasien,
            nik: pasien.nik,
            ttgl_lahir: pasien.ttgl_lahir,
            umurdaftar: age,
            jk: pasien.jk,
            alamat: pasien.alamat + "," + pasien.kelurahan.nm_kel + ", " + pasien.kelurahan.kecamatan.nm_kec + ", " + pasien.kelurahan.kecamatan.kabupaten_kotum.nm_kab + "," + pasien.kelurahan.kecamatan.kabupaten_kotum.provinsi.nm_pro,
            no_tlp: pasien.no_tlp,
            nm_penanggung: "",
            alamatPj: "",
            no_tlpPj: "",
            hub_pasien: "",
            idpj:pasien.penanggung_jawab_pasiens[0].id
        }));
        this.setState({ispj:""})
    }
        this.toggle()
    }
    getPenjamin() {
        return axios.get(REACT_APP_API_ENDPOINT + '/master/getlistpenjamin/', { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listpenjamin: reseponse.data })
            }
        )
    }
    getIks() {
        return axios.post(REACT_APP_API_ENDPOINT + '/master/getlistiksByIdPenjamin/', { idpenjamin: this.state.idpenjamin }, { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listiks: reseponse.data })
            }
        )
    }
    handleChangeSelect = input => e => {
        if (input === 'kode_dokter') {
            // console.log(e)
            if (e === null) {
                this.setState(Object.assign(this.state.formData, { [input]: null }));
            } else {
                this.setState(Object.assign(this.state.formData, { kode_dokter: e.value }));
            }
            // 
        } else {
            this.setState(Object.assign(this.state.formData, { [input]: e.value }), this.getDokter);
        }

    }

    getPoli() {
        return axios.get(REACT_APP_API_ENDPOINT + '/master/getlistpoli/', { headers: authHeader() }).then(
            reseponse => {
                const options = reseponse.data.map(d => ({
                    "value": d.kode_poli,
                    "label": d.nama_poli

                }))
                this.setState({ listpoli: options }, this.getDokter)

            }
        )
    }

    getDokter() {
        return axios.post(REACT_APP_API_ENDPOINT + '/master/getlistdokterbypolijadwal/', { kode_poli: this.state.formData.kode_poli, hari: this.state.hari, jam: this.state.jam }, { headers: authHeader() }).then(
            reseponse => {
                const options = reseponse.data.map(d => ({
                    "value": d.kode_dokter,
                    "label": d.nm_dokter

                }))
                this.setState({ listdokter: options })


            }
        )
    }
    addRegPasien() {
        return axios.post(REACT_APP_API_ENDPOINT + '/master/addregpasien/', this.state.formData, { headers: authHeader() }).then(
            reseponse => {
                this.setState({ isopenConfirm: true, labelcomponent: "Data Berhasil Disimpan" })
                this.cleartStateInput();
            }
        )
    }
    UpdateRegPasien() {
        return axios.post(REACT_APP_API_ENDPOINT + '/master/updateregpasien/', this.state.formData, { headers: authHeader() }).then(
            reseponse => {
                this.setState({ isopenConfirm: true, labelcomponent: "Data Berhasil Diperbaharui" })
                this.cleartStateInput();
            }
        )
    }
    cleartStateInput() {
        this.setState(Object.assign(this.state.formData, {
            no_reg: "",
            no_rm: "",
            nama_pasien: "",
            nik: "",
            alamat: "",
            ttgl_lahir: "",
            jk: "1",
            no_tlp: "",
            tgl_reg: new Date(),
            kode_dokter: "DR001",
            kode_poli: "IGD",
            idiks: "",
            idpenjamin: "1",
            stts_daftar: "1",
            stts_bayar: "Belum Lunas",
            stts_rawat: "1",
            stts_periksa: "",
            umurdaftar: "",
            nm_penanggung: "",
            alamatPj: "",
            no_tlpPj: "",
            hub_pasien: "",
            no_kartu: ""
        }))
        this.setState({ ispenjamin: false, isnokartu: false })
    }
    editRegister = dataedit => e => {
        this.setState({ selectTab: 0, isedit: true })
        const data = this.state.listRegister.find(data => data.no_reg === dataedit);
        // console.log(data)
        if (data.stts_daftar === 3) {
            this.setState({ ispenjamin: true, isnokartu: true }, this.getIks)
        } else if (data.stts_daftar === 2) {
            this.setState({ ispenjamin: false, isnokartu: true })
        }
        else {
            this.setState({ ispenjamin: false, isnokartu: false })
        }
        this.setState(Object.assign(this.state.formData, { kode_poli: data.kode_poli, tgl_reg: new Date(data.tgl_reg), hari: moment(data.tgl_reg).format('dddd'), jam: moment(data.tgl_reg).format('h:mm:ss') }), this.getDokter)
        var incriment=1;
        if(data.pasien.no_rm.toString().length<3){
            incriment=3;
        }
        var digitLength=data.pasien.no_rm.toString().length+incriment;
        this.setState(Object.assign(this.state.formData, {
            no_reg: data.no_reg,
            no_rm: padLeadingZeros(data.pasien.no_rm, digitLength),
            nama_pasien: data.pasien.nm_pasien,
            nik: data.pasien.nik,
            alamat: data.pasien.alamat + "," + data.pasien.kelurahan.nm_kel + ", " + data.pasien.kelurahan.kecamatan.nm_kec + ", " + data.pasien.kelurahan.kecamatan.kabupaten_kotum.nm_kab + "," + data.pasien.kelurahan.kecamatan.kabupaten_kotum.provinsi.nm_pro,
            ttgl_lahir: data.pasien.ttgl_lahir,
            jk: data.pasien.jk,
            no_tlp: data.pasien.no_tlp,

            kode_dokter: data.kode_dokter,
            idiks: data.idiks,
            idpenjamin: data.stts_daftar,
            umurdaftar: data.umurdaftar,
            nm_penanggung: data.pasien.penanggung_jawab_pasiens[0].nm_penanggung,
            alamatPj: data.pasien.penanggung_jawab_pasiens[0].alamat + "," + data.pasien.penanggung_jawab_pasiens[0].kelurahan.nm_kel + ", " + data.pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.nm_kec + ", " + data.pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.kabupaten_kotum.nm_kab + "," + data.pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.kabupaten_kotum.provinsi.nm_pro,
            no_tlpPj: data.pasien.penanggung_jawab_pasiens[0].no_tlp,
            hub_pasien: data.pasien.penanggung_jawab_pasiens[0].hub_pasien,
            no_kartu: data.no_kartu,
            stts_daftar: data.stts_daftar
        }))

    }
    deleteRegister = input => e => {
        let id = input;
        confirmAlert({
            title: 'Konfirmasi Hapus Data',
            message: 'Apakah Anda akan Menghapus Data Registrasi Pasien dengan No Registrasi ' + id,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.removeRegis(id)
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    removeRegis = id => {
        axios.post(REACT_APP_API_ENDPOINT + `/master/deletereg/`, {
            id: id,
            tgl_reg: moment(this.state.searchtgl_reg).format('yyyy-MM-DD'),
            kode_poli: this.state.searchpoli,
            kode_dokter: this.state.searchdokter,
            stts_rawat: this.state.stts_rawat,
            stts_daftar: this.state.serachstts_daftar,
            no_rm: ""
        }, { headers: authHeader() }).then(
            response => response.data)
            .then(reg => {

            })
            .catch(err => console.log(err))
    }
    getMonths(date) {
        return moment(date).format("DD/MM/YY");
    }
    getNoReg() {
        return axios.post(REACT_APP_API_ENDPOINT + '/master/getlastreg/', { tgl_reg: moment(this.state.formData.tgl_reg).format('yyyy-MM-DD') }, { headers: authHeader() }).then(
            response => {
                let arrnopo;
                let laspo;
                if (response.data.no_reg.rows.length > 0) {
                    arrnopo = response.data.no_reg.rows[0].no_reg.split("/")
                    laspo = parseInt(arrnopo[3]) + 1
                } else {
                    laspo = parseInt(response.data.no_reg.count) + 1;
                }
                var incriment=1;
                if(laspo.toString().length<3){
                    incriment=3;
                }
                var digitLength=laspo.toString().length+incriment;
                this.setState(Object.assign(this.state.formData, { no_reg: this.getMonths(this.state.formData.tgl_reg) + "/" + padLeadingZeros(laspo, digitLength) }));
            }, error => {
                this.setState(Object.assign(this.state.formData, { no_reg: '' }));
            }
        )
    }
    getRegistrasi() {
        let no_rm = "";
        if (this.state.searchRm !== "") {
            no_rm = parseInt(this.state.searchRm)
        }
        return axios.post(REACT_APP_API_ENDPOINT + '/master/getlistregistrasi/', {
            tgl_reg: moment(this.state.searchtgl_reg).format('yyyy-MM-DD'),
            kode_poli: this.state.searchpoli,
            searchdokter: this.state.searchdokter,
            stts_rawat: this.state.formData.stts_rawat,
            stts_daftar: this.state.serachstts_daftar,
            no_rm: no_rm
        }, { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listRegister: reseponse.data })
            }
        )
    }
    onChangeInput = e => {
        this.setState({ [e.target.name]: e.target.value })
        //  this.setState({searchpoli:e.target.value})
    }
    handleInputDateChange = (date) => {
        // console.log(date)
        this.setState({ searchtgl_reg: date }, this.getRegistrasi)
    }
    contextMenu=no_reg=>(event) =>{
        event.preventDefault();
        // console.log(no_reg)
        const data = this.state.listRegister.find(data => data.no_reg === no_reg);
        this.setState({contextValue:data});
        this.setState({ visible: true,  yPos:`${event.pageY}px`,xPos:`${event.pageX}px` });
    }
    printRegis=noreg=>{
        // console.log(e)
        // const data = this.state.listRegister.find(data => data.no_reg === noreg);
        // this.setState({dataprint:noreg});
        
   
    }
    componentDidMount() {
        this.getPenjamin();
        this.getNoReg()
        this.getPoli();
        this.getRegistrasi();
        let token = this.props.user.accessToken
        const socket = io.connect(REACT_APP_API_HOST, {
            query: { token }
        })

        socket.on("no_reg", data => {
            // console.log(data)
            let arrnopo;
            let laspo;
            if (data.rows.length > 0) {
                arrnopo = data.rows[0].no_reg.split("/")
                laspo = parseInt(arrnopo[3]) + 1
            } else {
                laspo = parseInt(data.count) + 1;
            }
            var incriment=1;
            if(laspo.toString().length<3){
                incriment=3;
            }
            var digitLength=laspo.toString().length+incriment;
            this.setState(Object.assign(this.state.formData, { no_reg: this.getMonths(this.state.formData.tgl_reg) + "/" + padLeadingZeros(laspo, digitLength) }));
        });
        socket.on("register", register => {
            const itemIndex = this.state.listRegister.findIndex(data => data.no_rg === register.no_rm) 
            const newArray = {
                dokter:register.dokter,
                idiks:register.idiks,
                kode_dokter: register.kode_dokter,
                kode_poli: register.kode_poli,
                no_kartu:register.no_kartu,
                no_reg: register.no_reg,
                no_rm: register.no_rm,
                pasien: register.pasien,
                poli: register.poli,
                stts_bayar:register.stts_bayar,
                stts_daftar:register.stts_daftar,
                stts_periksa: register.stts_periksa,
                stts_rawat:register.stts_rawat,
                tgl_reg: register.tgl_reg,
                umurdaftar:register.umurdaftar,
            }
            if (itemIndex === -1) {
                this.setState(prevState => ({
                    listRegister: [...prevState.listRegister, newArray]
                }))
            }           
        })
        socket.on("updateregister", dataIo => {
            // console.log(data)
            let data = [...this.state.listRegister];
            const itemIndex = this.state.listRegister.findIndex(datareg => datareg.no_reg === dataIo.no_reg)
            data[itemIndex].no_reg = dataIo.no_reg
            data[itemIndex].dokter = dataIo.dokter
            data[itemIndex].idiks = dataIo.idiks
            data[itemIndex].kode_dokter = dataIo.kode_dokter
            data[itemIndex].kode_poli = dataIo.kode_poli
            data[itemIndex].no_kartu = dataIo.no_kartu
            data[itemIndex].no_reg = dataIo.no_reg
            data[itemIndex].no_rm = dataIo.no_rm
            data[itemIndex].pasien = dataIo.pasien
            data[itemIndex].poli = dataIo.poli
            data[itemIndex].stts_bayar = dataIo.stts_bayar
            data[itemIndex].stts_daftar = dataIo.stts_daftar
            data[itemIndex].stts_periksa = dataIo.stts_periksa
            data[itemIndex].stts_rawat = dataIo.stts_rawat
            data[itemIndex].tgl_reg = dataIo.tgl_reg
            data[itemIndex].umurdaftar = dataIo.umurdaftar
            this.setState({ data });

        })
        socket.on("delregistrasi",delData=>{
            if(delData.status===1){
                const index = this.state.listRegister.findIndex(data => data.no_reg === delData.no_reg)
                this.state.listRegister.splice(index, 1);
                this.setState(this.state.listRegister);
            }
            
        })

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
    render() {
        const optionpenjamin = this.state.listpenjamin.map((penjamin, index) => {
            return (
                <option value={penjamin.id} key={penjamin.nama_penjab + "-" + penjamin.id}>{penjamin.nama_penjab}</option>
            )
        })
        const slice = this.sliceData(this.state.listRegister, this.state.page, 10)
        const range = this.calculateRange(this.state.listRegister, 10);
        // console.log(slice)
        const reg = slice.map((regis, index) => {
            var incriment=1;
            if(regis.pasien.no_rm.toString().length<3){
                incriment=3;
            }
            var digitLength=regis.pasien.no_rm.toString().length+incriment;
            return (
                <tr key={index + "-" + regis.no_reg} onContextMenu={this.contextMenu(regis.no_reg)} onClick={()=>this.setState({visible:false,contextValue:""})}>
                    <td>{index + 1}</td>
                    <td>{regis.no_reg}</td>
                    <td>{moment(regis.tgl_reg).format('DD/MM/yyyy')}</td>
                    <td>{padLeadingZeros(regis.pasien.no_rm, digitLength)}</td>
                    <td>{regis.pasien.nm_pasien}</td>
                    <td style={{ width: "10%" }} >{regis.pasien.alamat + "," + regis.pasien.kelurahan.nm_kel + ", " + regis.pasien.kelurahan.kecamatan.nm_kec + ", " + regis.pasien.kelurahan.kecamatan.kabupaten_kotum.nm_kab + "," + regis.pasien.kelurahan.kecamatan.kabupaten_kotum.provinsi.nm_pro}</td>
                    <td>{regis.pasien.no_tlp}</td>
                    <td>{regis.pasien.penanggung_jawab_pasiens[0].nm_penanggung}</td>
                    <td style={{ width: "10%" }}>{regis.pasien.penanggung_jawab_pasiens[0].alamat + "," + regis.pasien.penanggung_jawab_pasiens[0].kelurahan.nm_kel + ", " + regis.pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.nm_kec + ", " + regis.pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.kabupaten_kotum.nm_kab + "," + regis.pasien.penanggung_jawab_pasiens[0].kelurahan.kecamatan.kabupaten_kotum.provinsi.nm_pro}</td>
                    <td>{regis.pasien.penanggung_jawab_pasiens[0].no_tlp}</td>
                    <td>{regis.poli.nama_poli}</td>
                    <td>{regis.dokter.nm_dokter}</td>
                    <td style={{ width: "5%" }}>{regis.stts_daftar === 1 ? (<>Umum</>) : regis.stts_daftar === 2 ? (<>BPJS</>) : (<>IKS</>)}</td>
                    <td>{regis.stts_rawat === 1 ? (<>Rajal</>) : (<>Ranap</>)}</td>
                    <td>{regis.stts_bayar === 1 ? (<>Lunas</>) : regis.stts_bayar === 2 ? (<>Piutang</>) : (<>Blm Lunas</>)}</td>
                    <td style={{ width: "8%" }}>
                        <button type="button" className="btn btn-warning" style={{ fontSize: "0.75rem", margin: "2px" }} onClick={this.editRegister(regis.no_reg)} ><Icon.PencilSquare /></button>
                        <button type="button" className="btn btn-danger" style={{ fontSize: "0.75rem", margin: "2px" }} onClick={this.deleteRegister(regis.no_reg)}><Icon.Trash></Icon.Trash></button>
                    </td>
                </tr>
            )
        })
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Pendaftaran Rawat Jalan</li>
                    </ol>
                </nav>
                <Tabs
                    selectedIndex={this.state.selectTab}
                    onSelect={(index) => this.setState({ selectTab: index })}>
                    <TabList >
                        <Tab >Input Pendaftaran</Tab>
                        <Tab>Daftar Pasien Rawat Jalan</Tab>
                    </TabList>
                    <TabPanel tabIndex={0}>
                        <InputRegistrasi jnsRawt={this.state.jnsRawt}
                            handleFormData={this.handleInputData} values={this.state.formData}
                            toggle={this.toggle} isopen={this.state.isopen} keyShort={this.keyShort}
                            adddpasien={this.adddpasien} listpenjamin={this.state.listpenjamin} listiks={this.state.listiks}
                            ispenjamin={this.state.ispenjamin} isnokartu={this.state.isnokartu}
                            listpoli={this.state.listpoli} handleChangeSelect={this.handleChangeSelect}
                            listdokter={this.state.listdokter} addRegPasien={this.addRegPasien} isedit={this.state.isedit} UpdateRegPasien={this.UpdateRegPasien}
                            cleartStateInput={this.cleartStateInput} ispj={this.state.ispj} checkPj={this.checkPj}
                        ></InputRegistrasi>
                    </TabPanel>
                    <TabPanel tabIndex={1}>
                        <FormGroup className="search-formgrup">
                            <Row className="justify-content-md-center">

                                <Col className="col-auto">
                                    <Input type="text" name="searchRm" placeholder="No RM" onChange={this.onChangeInputSearch}></Input>
                                </Col>
                                <Col className="col-auto">
                                    {/* <Input type="text" name="searchpoli" placeholder="Poli"></Input> */}
                                    <Select options={this.state.listpoli}
                                        isClearable
                                        // defaultValue={this.state.listpoli[indexSelectPoli]} 
                                        onChange={this.onChangeSelectSearch('searchpoli')} name="searchpoli" id='searchpoli' />
                                </Col>
                                <Col className="col-auto">
                                    <Input type="text" name="searchdokter" placeholder="Dokter" onChange={this.onChangeInputSearch}></Input>
                                </Col>
                                <Col className="col-auto">
                                   
                                    <select name="serachstts_daftar"placeholder="Jenis Bayar"onChange={this.onChangeInputSearch} multiple={false} className="form-control" >
                                    <option value={""}>Semua</option>
                                    {optionpenjamin}
                                    </select>
                                   
                                </Col>
                                <Col className="col-auto">
                                    <DatePicker name="searchtgl_reg" id="searchtgl_reg"
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.state.searchtgl_reg}
                                        onChange={(date) => this.handleInputDateChange(date)}
                                        className="form-control"

                                    />
                                </Col>
                                <Col className="col-auto">
                                    <button type="button" className="btn btn-secondary" onClick={this.getRegistrasi}>Cari</button>
                                </Col>
                            </Row>
                        </FormGroup>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <td>#</td>
                                    <td>No Reg</td>
                                    <td>Tanggal</td>
                                    <td>No RM</td>
                                    <td>Nama</td>
                                    <td>Alamat</td>
                                    <td>Tlp</td>
                                    <td>Penanggung Jawab</td>
                                    <td>Alamat PJ</td>
                                    <td>Tlp Pj</td>
                                    <td>Poli</td>
                                    <td>Dokter</td>
                                    <td>Jenis Bayar</td>
                                    <td>Status Rawat</td>
                                    <td>Status Bayar</td>
                                    <td>Action</td>
                                </tr>
                            </thead>
                            <tbody className="fs-7">
                                {reg}
                            </tbody>

                        </table>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-end">

                                {
                                    range.map((el, index) => (
                                        <li className="page-item" key={index}>
                                            <button className="page-link" onClick={this.setPage(el)}>{el}</button>
                                        </li>
                                    ))
                                }

                            </ul>
                        </nav>
                    </TabPanel>
                </Tabs>
                <Modalconfirmation isopen={this.state.isopenConfirm} labelcomponent={this.state.labelcomponent} toggle={this.toggleConfrim} />
                {this.state.visible===true?(
                <div ref={ref => {this.root = ref}} className="contextMenu"  style={{
                top: this.state.yPos,
                left: this.state.xPos,
               position:"absolute",
               background:"White",
               padding:"10px",
               fontSize:"12px",
               boxShadow: "1px 1px 5px 1px"
              }}>
                    <ul style={{padding:"initial"}}>
                        <li>
                        <ReactToPrint
          trigger={() => <button type="button" className="dropdown-item" >Cetak Bukti Register</button>}
          onBeforePrint={this.printRegis(this.state.contextValue)}
          onBeforeGetContent={()=>{this.setState({visible:false})}}
          content={() => this.componentRef}
        />
                            {/* <button className="dropdown-item" onClick={this.printRegis} value={this.state.contextValue}>Cetak Bukti Register</button>                            */}
                        </li>

                    </ul>
                </div>
            ):(<></>)}
            <ComponentPrintReg ref={(el) => (this.componentRef = el)} dataprint={this.state.contextValue} setting={this.props.setting.settings}/>
            </>
        )
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    const { setting } = state.setting;
    return {
        user,
        setting
    };
}
export default connect(mapStateToProps)(Registrasipoli);