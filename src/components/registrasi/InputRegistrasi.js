import React, { Component } from "react";
import {  Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import Pasien from "../master/Pasien";
import * as Icon from 'react-bootstrap-icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
export default class InputRegistrasi extends Component {
    // constructor(props){
    //     super(props);
    //     this.state={
    //         isopen:false
    //     }
    // }
    
    submitFormData = e => {
        e.preventDefault()
        if(this.props.isedit===true){
            this.props.UpdateRegPasien()
            }else{
                this.props.addRegPasien()
            }
        
    }

    render() {
      const indexSelectPoli=this.props.listpoli.findIndex(data=>data.value===this.props.values.kode_poli);
      const indexSelectDokter=this.props.listdokter.findIndex(datadokter=>datadokter.value===this.props.values.kode_dokter);
    //   console.log(this.props.values.kode_dokter)
    //   if(indexSelectDokter===-1){
        
    //   }
        const optionpenjamin = this.props.listpenjamin.map((penjamin, index) => {
            return (
                <option value={penjamin.id} key={penjamin.nama_penjab + "-" + penjamin.id}>{penjamin.nama_penjab}</option>
            )
        })
        const optioniks = this.props.listiks.map((iks, index) => {
            return (
                <option value={iks.id} key={iks.nama_perusahaan + "-" + iks.id}>{iks.nama_perusahaan}</option>
            )
        })
        const closeBtn = <button type="button" className="btn-close" aria-label="Close" onClick={this.props.toggle}></button>
        return (
            <div style={{ margin: "15px" }}>
                <h3 className="text-center">Pendaftaran {this.props.jnsRawt}</h3>
                <Form onSubmit={this.submitFormData}>
                    <FormGroup>
                        <Row>
                            <Col xl={2}>
                                <Label for="no_reg">No Reg</Label>
                                <Input type="text" name="no_reg" value={this.props.values.no_reg} onChange={this.props.handleFormData("no_reg")} disabled required></Input>
                            </Col>
                            <Col xl={2}>
                                <Label for="tgl_reg">Tanggal</Label>
                                {/* <Input type="date" name="tgl_reg" max={this.props.values.tgl_reg} value={this.props.values.tgl_reg} onChange={this.props.handleFormData("tgl_reg")} disabled required></Input> */}
                                <DatePicker name="tgl_reg" id="tgl_reg"
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.props.values.tgl_reg}
                                        onChange={this.props.handleFormData("tgl_reg")}
                                        minDate={new Date()}
                                        className="form-control" required disabled
                                        
                                    />
                            </Col>
                            <Col xl={2}>
                                <Label for="no_rm">No RM</Label>
                                <Input type="text" name="no_rm" value={this.props.values.no_rm} onChange={this.props.handleFormData("no_rm")} disabled required></Input>
                            </Col>
                            <Col xl={2}>
                                <Label for="nik">NIK</Label>
                                <Input type="text" name="nik" value={this.props.values.nik} onChange={this.props.handleFormData("nik")} disabled required></Input>
                            </Col>
                            <Col xl={3}>
                                <Label for="nama_pasien">Nama</Label>
                                <Input type="text" name="nama_pasien" value={this.props.values.nama_pasien} onChange={this.props.handleFormData("nama_pasien")} onKeyDown={this.props.keyShort} required></Input>
                            </Col>
                            <Col xl={1}>
                                <button type="button" className="btn btn-primary" style={{ marginTop: "40px" }} onClick={this.props.toggle}>
                                    <Icon.PersonPlus />
                                </button>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xl={2}>
                                <Label for="umurdaftar">Umur</Label>
                                <Input type="text" name="umurdaftar" value={this.props.values.umurdaftar} onChange={this.props.handleFormData("umurdaftar")} disabled></Input>
                            </Col>
                            <Col xl={4}>
                                <Label for="alamat">Alamat</Label>
                                <Input type="text" name="alamat" value={this.props.values.alamat} onChange={this.props.handleFormData("alamat")} onKeyDown={this.props.keyShort} disabled required></Input>
                            </Col>
                            <Col xl={2}>
                                <Label for="tgl_reg">Tanggal Lahir</Label>
                                <Input type="date" name="ttgl_lahir" data-date-format="dd/mm/yyyy" value={this.props.values.ttgl_lahir} onChange={this.props.handleFormData("ttgl_lahir")} disabled required></Input>
                            </Col>
                            <Col xl={2}>
                                <Label for="jk">Jenis Kelamin</Label>
                                <select name="jk" value={this.props.values.jk} onChange={this.props.handleFormData("jk")} multiple={false} className="form-control" disabled required>
                                    <option value={"0"}>Laki-laki</option>
                                    <option value={"1"}>Perempuan</option>
                                </select>
                            </Col>
                            <Col xl={2}>
                                <Label for="no_tlp">Telpone</Label>
                                <Input type="text" name="no_tlp" value={this.props.values.no_tlp} onChange={this.props.handleFormData("no_tlp")} disabled required></Input>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xl={3}>
                                <Label for="nm_penanggung">Nama PJ</Label>
                                <Input type="text" name="nm_penanggung" value={this.props.values.nm_penanggung} onChange={this.props.handleFormData("nm_penanggung")}  disabled = {(this.props.ispj)? "disabled" : ""} required></Input>
                            </Col>
                            <Col xl={3}>
                                <Label for="alamatPj">Alamat PJ</Label>
                                <Input type="text" name="alamatPj" value={this.props.values.alamatPj} onChange={this.props.handleFormData("alamatPj")} disabled={this.props.ispj} required></Input>
                            </Col>
                            <Col xl={2}>
                                <Label for="no_tlpPj">Tepone PJ</Label>
                                <Input type="text" name="no_tlpPj" value={this.props.values.no_tlpPj} onChange={this.props.handleFormData("no_tlpPj")} disabled={this.props.ispj} required></Input>
                            </Col>
                            <Col xl={2}>
                                <Label for="hub_pasien">Hubungan </Label>
                                <Input type="text" name="hub_pasien" value={this.props.values.hub_pasien} onChange={this.props.handleFormData("hub_pasien")} disabled={this.props.ispj} required></Input>
                            </Col>
                            <div className="col-auto form-check">
                                    <Input type="checkbox" name="ispj" className="form-check-input" style={{marginTop:"50px"}} onChange={this.props.checkPj} checked= {(this.props.ispj)? "checked" : ""}></Input>
                                    <Label className="form-check-label" style={{marginTop:"45px"}}>Edit PJ</Label>
                            </div>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xl={2}>
                                <Label for="idpenjamin">Jenis Bayar</Label>
                                <select name="idpenjamin" value={this.props.values.idpenjamin} onChange={this.props.handleFormData("idpenjamin")} multiple={false} className="form-control" required>
                                    {optionpenjamin}
                                </select>
                            </Col>
                            <Col xl={2}>
                                <Label for="kode_poli">Poli</Label>                              
                                <Select options={this.props.listpoli} defaultValue={this.props.listpoli[indexSelectPoli]} onChange={this.props.handleChangeSelect("kode_poli")} name="kode_poli" id='kode_poli' />
                            </Col>
                            <Col xl={3}>
                                <Label for="kode_dokter">Dokter</Label>                              
                                <Select  options={this.props.listdokter}  
                                defaultValue={this.props.listdokter[indexSelectDokter]} 
                                // value={this.props.values.kode_dokter}
                                isClearable
                                onChange={this.props.handleChangeSelect("kode_dokter")} name="kode_dokter" id='kode_dokter' required/>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                        {
                                this.props.ispenjamin === true ? (
                                    <>
                                        <Col xl={4}>
                                            <Label for="idiks">Penjamin</Label>
                                            <select name="idiks" value={this.props.values.idiks} onChange={this.props.handleFormData("idiks")} multiple={false} className="form-control" required>
                                                <option value={1}>-</option>
                                                {optioniks}
                                            </select>
                                        </Col>
                                       
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                            {
                                this.props.isnokartu===true?(
                                    <>
                                    <Col xl={2}>
                                            <Label for="no_kartu">No Kartu </Label>
                                            <Input type="text" name="no_kartu" value={this.props.values.no_kartu} onChange={this.props.handleFormData("no_kartu")}  required></Input>
                                        </Col>
                                    </>
                                ):(<></>)
                            }
                        </Row>
                        </FormGroup>
                    <FormGroup>
                        <button className="btn btn-primary">{this.props.isedit===true?(<>Ubah</>):(<>Simpan</>)}</button>
                        <button type="button" className="btn btn-primary" onClick={this.props.cleartStateInput} style={{marginLeft:"20px"}}>Bersihkan</button>
                        
                    </FormGroup>
                </Form>
                <Modal isOpen={this.props.isopen} toggle={this.props.toggle} className="modal-fullscreen">
                    <ModalHeader toggle={this.toggle} close={closeBtn}>Pasien</ModalHeader>
                    <ModalBody>
                        <Pasien addRegpasien={this.props.adddpasien} labelpasien={"Pilih pasien"} />
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}