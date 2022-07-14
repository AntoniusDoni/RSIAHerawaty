import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import axios from "axios";
import authHeader from "../../services/auth-header";
const { REACT_APP_API_ENDPOINT } = process.env;
export default class PenjabPasien extends Component{
    constructor(props) {
        super(props);
        this.state = {
            listprovince: [],
            listkabupaten: [],
            listkecamatan: [],
            listkelurahan: [],
            idprop: "1",
            idkabupaten: "1",
            idkecamatan: "2",
            
        }
    }
    getProvincepenjab() {
        return axios.get(REACT_APP_API_ENDPOINT + '/master/getlistprovinsi/', { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listprovince: reseponse.data },this.getkabupaten)
            }
        )
    }
    getkabupatenpenjab() {
        return axios.post(REACT_APP_API_ENDPOINT + '/master/getlistkabupatenbyprop/',{idprop:this.state.idprop}, { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listkabupaten: reseponse.data },this.getkecamatan)
                if(reseponse.data.length===0){
                    this.setState({idkecamatan:"-",idkelurahan:"-",id_kelurahanPen:"-"});  
                }
            }
        )
    }
    getkecamatanpenjab() {
        return axios.post(REACT_APP_API_ENDPOINT + '/master/getlistkecamatanbyidkab/',{idkab:this.state.idkabupaten}, { headers: authHeader() }).then(
            reseponse => {               
                this.setState({ listkecamatan: reseponse.data },this.getkelurahan)
                if(reseponse.data.length===0){
                    // this.setState({idkelurahan:"-",id_kelurahanPen:"-"});  
                }
            }
        )
    }
    getkelurahanpenjab() {
        return axios.post(REACT_APP_API_ENDPOINT + '/master/getlistkelurahanbyidkec/',{idkec:this.state.idkecamatan}, { headers: authHeader() }).then(
            reseponse => {
                this.setState({ listkelurahan: reseponse.data })
            }
        )
    }

    onChangeselectedProppenjab= e =>{
        let values=e.target.value
        this.setState({idprop:values},this.getkabupatenpenjab);        
    }
    onChangeselectekabpenjab= e =>{
        let values=e.target.value
        this.setState({idkabupaten:values},this.getkecamatanpenjab);
    }
    onChangeselectekecpenjab= e =>{
        let values=e.target.value
        this.setState({idkecamatan:values},this.getkelurahanpenjab);
    }
    addPasien=e=>{
        e.preventDefault();
        this.props.addPasien()
    }
    componentDidMount() {
        this.getProvincepenjab();
        this.getkabupatenpenjab();
    }
    render(){
        const optionpropinsi = this.state.listprovince.map((provinsi, index) => {
            return (
                <option value={provinsi.id} key={provinsi.nm_pro+"-"+provinsi.id}>{provinsi.nm_pro}</option>
            )
        })
        const optionkabupaten= this.state.listkabupaten.map((kab, index) => {
            return (
                <option value={kab.id} key={kab.nm_kab+"-"+kab.id}>{kab.nm_kab}</option>
            )
        })
        const optionkecamatan= this.state.listkecamatan.map((kec, index) => {
            return (
                <option value={kec.id} key={kec.nm_kec+"-"+kec.id}>{kec.nm_kec}</option>
            )
        })
        const optionkelurahan=this.state.listkelurahan.map((kel, index) => {
            return (
                <option value={kel.id} key={kel.nm_kel+"-"+kel.id}>{kel.nm_kel}</option>
            )
        })
        return (
            <>
                <h3 className="text-center">Data Penanggung Jawab Pasien</h3>
                <Form>
                    <FormGroup>
                    <Row>
                        <Col xl={2}>
                        <Label for="no_ktp">No KTP</Label>
                        <Input type="text" name="no_ktp" value={this.props.values.no_ktp} onChange={this.props.handleFormData("no_ktp")} required></Input>
                        </Col>
                        <Col xl={2}>
                        <Label for="hub_pasien">Hungan dengan Pasien</Label>
                        <Input type="text" name="hub_pasien" value={this.props.values.hub_pasien} onChange={this.props.handleFormData("hub_pasien")} required></Input>
                        </Col>
                        <Col xl={6}>
                        <Label for="nm_penanggung">Nama</Label>
                        <Input type="text" name="nm_penanggung" value={this.props.values.nm_penanggung} onChange={this.props.handleFormData("nm_penanggung")} required></Input>
                        </Col>                       
                    </Row>
                    </FormGroup>
                    <FormGroup>
                    <Row>
                        <Col xl={2}>
                        <Label for="tgl_lahir">Tgl Lahir</Label>
                        <Input type="date" name="tgl_lahir" value={this.props.values.tgl_lahir} onChange={this.props.handleFormData("tgl_lahir")} ></Input>
                        </Col>
                        <Col xl={10}>
                        <Label for="alamatpenjab">Alamat</Label>
                        <Input type="text" name="alamatpenjab" value={this.props.values.alamatpenjab} onChange={this.props.handleFormData("alamatpenjab")} required></Input>
                        </Col>
                    </Row>
                    </FormGroup>
                    <FormGroup>
                    <Row>
                        <Col xl={2}>
                        <Label for="no_tlppenjab">Telpone</Label>
                        <Input type="text" name="no_tlppenjab" value={this.props.values.no_tlppenjab} onChange={this.props.handleFormData("no_tlppenjab")} required></Input>
                        </Col>
                        <Col xl={3}>
                                        <Label for="idprop">Provinsi</Label>
                                        <select name="idprop" value={this.state.idprop} onChange={this.onChangeselectedProppenjab} multiple={false} className="form-control"  >
                                        <option>-</option>
                                            {optionpropinsi}
                                        </select>
                                    </Col>
                                    <Col xl={2}>
                                        <Label for="idkabupaten">Kabupaten</Label>
                                        <select name="idkabupaten" value={this.state.idkabupaten} onChange={this.onChangeselectekabpenjab} multiple={false} className="form-control"  >
                                            <option>-</option>
                                            {optionkabupaten}
                                        </select>
                                    </Col>
                                    <Col xl={2}>
                                        <Label for="idkecamatan">Kecamatan</Label>
                                        <select name="idkecamatan" value={this.state.idkecamatan} onChange={this.onChangeselectekecpenjab} multiple={false} className="form-control"  >
                                            <option>-</option>
                                            {optionkecamatan}
                                        </select>
                                    </Col>
                                    <Col xl={3}>
                                        <Label for="idkelurahan">Kelurahan</Label>
                                        <select name="idkelurahan" value={this.props.values.id_kelurahanPen} onChange={this.props.handleFormData("id_kelurahanPen")} multiple={false} className="form-control"  >
                                            <option>-</option>
                                           {optionkelurahan}
                                        </select>
                                    </Col>
                    </Row>
                    </FormGroup>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <Button onClick={this.props.prevStep}>Kembali</Button>
                        <Button onClick={this.addPasien}>Simpan</Button>
                    </div>
                </Form>
            </>
        )
    }
}