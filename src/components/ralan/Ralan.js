import React, { Component } from "react";
import { connect } from "react-redux";
import padLeadingZeros from '../PadLeadingZeros'
import axios from "axios";
import authHeader from "../../services/auth-header";
import { io } from 'socket.io-client'
import { FormGroup, Input, Row, Col } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import moment from 'moment';
const { REACT_APP_API_ENDPOINT, REACT_APP_API_HOST } = process.env;
moment.defineLocale('id', { weekdays: 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'), })

class Ralan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRegister: [],
            jnsRawt: "Rawat Jalan",
            hari: moment().format('dddd'),
            jam: moment().format('h:mm:ss'),
            searchtgl_reg: new Date(),
            searchRm: "",
            searchpoli: "",
            searchdokter: "",
            serachstts_daftar: "",
            page: 1,
            listpoli: [],
            listdokter: [],
            listpenjamin: [],
            stts_rawat: "1",
            visible:false,
            yPos:"0px",
            xPos:"0px",
            contextValue:"",
        }
    }
    onChangeInputSearch = e => {
        this.setState({ [e.target.name]: e.target.value })
    }
    onChangeSelectSearch = input => e => {
        if (e === null) {
            this.setState({ [input]: "" }, this.getRegistrasi)
        } else {
            this.setState({ [input]: e.value }, this.getRegistrasi)
        }
    }
    handleInputDateChange = (date) => {
        // console.log(date)
        this.setState({ searchtgl_reg: date }, this.getRegistrasi)
    }
    getPenjamin() {
        return axios.get(REACT_APP_API_ENDPOINT + '/master/getlistpenjamin/', { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listpenjamin: reseponse.data })
            }
        )
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
        return axios.get(REACT_APP_API_ENDPOINT + '/master/getlistdokter/', { headers: authHeader() }).then(
            reseponse => {
                const options = reseponse.data.map(d => ({
                    "value": d.kode_dokter,
                    "label": d.nm_dokter

                }))
                this.setState({ listdokter: options })


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
            stts_rawat: this.state.stts_rawat,
            stts_daftar: this.state.serachstts_daftar,
            no_rm: no_rm
        }, { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listRegister: reseponse.data })
            }
        )
    }
    sliceData = (data, page, rowsPerPage) => {
        if (data !== null) {
            return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
        }

    };
    calculateRange = (data, rowsPerPage) => {
        const range = [];
        if (data !== null) {
            const num = Math.ceil(data.length / rowsPerPage);
            for (let i = 1; i <= num; i++) {
                range.push(i);
            }
        }
        return range;
    }
    setPage = data => e => {
        this.setState({ page: data })
    }
    contextMenu=no_reg=>(event) =>{
        event.preventDefault();
       
        this.setState({contextValue:no_reg});
        this.setState({ visible: true,  yPos:`${event.pageY}px`,xPos:`${event.pageX}px` });
    }
    componentDidMount() {
        this.getPenjamin();
        this.getPoli();
        this.getRegistrasi();
        let token = this.props.user.accessToken
        const socket = io.connect(REACT_APP_API_HOST, {
            query: { token }
        })
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

    render() {
        const slice = this.sliceData(this.state.listRegister, this.state.page, 10)
        const range = this.calculateRange(this.state.listRegister, 10);
        const reg = slice.map((regis, index) => {
            return (
                <tr key={index + "-" + regis.no_reg} onContextMenu={this.contextMenu(regis.no_reg)} onClick={()=>this.setState({visible:false,contextValue:""})}>
                    <td>{index + 1}</td>
                    <td>{regis.no_reg}</td>
                    <td>{moment(regis.tgl_reg).format('DD/MM/yyyy')}</td>
                    <td>{padLeadingZeros(regis.pasien.no_rm, 4)}</td>
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
                </tr>
            )
        })
        return (<div onClick={()=>this.setState({visible:false})}>
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
                        <Input type="text" name="searchdokter" placeholder="Dokter"></Input>
                    </Col>
                    <Col className="col-auto">
                        <Input type="text" name="serachstts_daftar" placeholder="Jenis Bayar"></Input>
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
            {this.state.visible===true?(
                <div ref={ref => {this.root = ref}} className="contextMenu"  style={{
               top: this.state.yPos,
                left: this.state.xPos,
               position:"absolute",
               background:"White",
               padding:"10px",
               fontSize:"12px",
               boxShadow: "1px 1px 5px 1px",
              }}>
                    <ul style={{padding:"initial"}}>
                        <li>
                            <button className="dropdown-item">Status Rawat</button>
                            <a className="dropdown-item" href={"tindakan?noreg="+this.state.contextValue}>Pemeriksaan & Tindakan</a>
                            <button className="dropdown-item">Triase</button>
                            <button className="dropdown-item">Permintaan RO</button>
                            <button className="dropdown-item">Permintaan Lab</button>
                        </li>

                    </ul>
                </div>
            ):(<></>)}

        </div>)
    }
}
function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user
    };
}
export default connect(mapStateToProps)(Ralan);