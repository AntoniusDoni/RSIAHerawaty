import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
  
export default class InputPasien extends Component{
  
    submitFormData=e=>{
        e.preventDefault()
        if(this.props.isedit){
        this.props.UpdatePasien()
        }else{
        this.props.nextStep();
        }
       
    }
    render() {
        // console.log(this.props.listprovinsi)
        const optionpropinsi = this.props.listprovince.map((provinsi, index) => {
            return (
                <option value={provinsi.id} key={provinsi.nm_pro+"-"+provinsi.id}>{provinsi.nm_pro}</option>
            )
        })
        const optionkabupaten= this.props.listkabupaten.map((kab, index) => {
            return (
                <option value={kab.id} key={kab.nm_kab+"-"+kab.id}>{kab.nm_kab}</option>
            )
        })
        const optionkecamatan= this.props.listkecamatan.map((kec, index) => {
            return (
                <option value={kec.id} key={kec.nm_kec+"-"+kec.id}>{kec.nm_kec}</option>
            )
        })
        const optionkelurahan=this.props.listkelurahan.map((kel, index) => {
            return (
                <option value={kel.id} key={kel.nm_kel+"-"+kel.id}>{kel.nm_kel}</option>
            )
        })
        let ButtonAct
        let ButtonClear
        if(this.props.isedit){
            ButtonAct=<Button type="submit" className="btn btn-success">Ubah</Button>
            ButtonClear=<Button className="btn btn-danger" onClick={this.props.clearAction} style={{marginLeft:"10px"}}>Batal</Button>
        }else{
            ButtonAct=<Button className="btn btn-primary">Selanjutnya</Button>
        }
        return (
            <div style={{margin:"15px"}}>
            <h3 className="text-center">Data Diri Pasien</h3>
                    <Form onSubmit={this.submitFormData}>
                            <FormGroup>
                                <Row>
                                    <Col xl={3}>
                                        <Label for="no_rm">No RM</Label>
                                        <Input type="text" name="no_rm" value={this.props.values.no_rm} onChange={this.props.handleFormData("no_rm")}  disabled required></Input>                                      
                                    </Col>
                                    <Col xl={3}>
                                        <Label for="nik">No KTP</Label>
                                        <Input type="text" name="nik" value={this.props.values.nik} onChange={this.props.handleFormData("nik")}  required></Input>
                                    </Col>
                                    <Col xl={6}>
                                        <Label for="nm_pasien">Nama</Label>
                                        <Input type="text" name="nm_pasien" value={this.props.values.nm_pasien} onChange={this.props.handleFormData("nm_pasien")} required></Input>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xl={3}>
                                        <Label for="ttgl_lahir">Tgl Lahir</Label>
                                        <Input type="date" name="ttgl_lahir" value={this.props.values.ttgl_lahir} onChange={this.props.handleFormData("ttgl_lahir")} onBlur={this.props.getage("ttgl_lahir")} required></Input>
                                    </Col>
                                    <Col xl={3}>
                                        <Label for="tempat_lahir">Tempat Lahir</Label>
                                        <Input type="text" name="tempat_lahir" value={this.props.values.tempat_lahir} onChange={this.props.handleFormData("tempat_lahir")}  required></Input>
                                    </Col>
                                    <Col xl={3}>
                                        <Label for="jk">Jenis Kelamin</Label>
                                        <select name="jk" value={this.props.values.jk} onChange={this.props.handleFormData("jk")} multiple={false} className="form-control"  required>
                                            <option value={"0"}>Laki-laki</option>
                                            <option value={"1"}>Perempuan</option>
                                        </select>
                                    </Col>
                                    <Col xl={3}>
                                        <Label for="gol_darah">Golongan darah</Label>
                                        <select name="gol_darah" value={this.props.values.gol_darah} onChange={this.props.handleFormData("gol_darah")} className="form-control">
                                        <option value={"-"}>-</option>
                                            <option value={"A"}>A</option>
                                            <option value={"B"}>B</option>
                                            <option value={"AB"}>AB</option>
                                            <option value={"O"}>O</option>
                                        </select>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xl={3}>
                                        <Label for="idprop">Provinsi</Label>
                                        <select name="idprop" value={this.props.values.idprop} onChange={this.props.onChangeselectedProp} multiple={false} className="form-control" required>
                                        <option>-</option>
                                            {optionpropinsi}
                                        </select>
                                    </Col>
                                    <Col xl={3}>
                                        <Label for="idkabupaten">Kabupaten</Label>
                                        <select name="idkabupaten" value={this.props.values.idkabupaten} onChange={this.props.onChangeselectekab} multiple={false} className="form-control" required>
                                            <option>-</option>
                                            {optionkabupaten}
                                        </select>
                                    </Col>
                                    <Col xl={3}>
                                        <Label for="idkecamatan">Kecamatan</Label>
                                        <select name="idkecamatan" value={this.props.values.idkecamatan} onChange={this.props.onChangeselectekec} multiple={false} className="form-control" required>
                                            <option>-</option>
                                            {optionkecamatan}
                                        </select>
                                    </Col>
                                    <Col xl={3}>
                                        <Label for="idkelurahan">Kelurahan</Label>
                                        <select name="idkelurahan" value={this.props.values.idkelurahan} onChange={this.props.handleFormData("idkelurahan")} multiple={false} className="form-control" required>
                                            <option>-</option>
                                           {optionkelurahan}
                                        </select>
                                    </Col>
                                    <Col xl={3}>
                                        <Label for="no_tlp">Telphone</Label>
                                        <Input type="text" name="no_tlp" value={this.props.values.no_tlp} onChange={this.props.handleFormData("no_tlp")} required ></Input>
                                    </Col>
                                    <Col xl={9}>
                                        <Label for="alamat">Alamat</Label>
                                        <Input type="text" name="alamat" value={this.props.values.alamat} onChange={this.props.handleFormData("alamat")} required  ></Input>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                <Col xl={3}>
                                        <Label for="umur">Umur</Label>
                                        <Input type="text" name="umur" value={this.props.values.umur} onChange={this.props.handleFormData("umur")}  disabled></Input>
                                </Col>
                                <Col xl={2}>
                                        <Label for="sst_perkawinan">Status</Label>
                                        <select name="sst_perkawinan" value={this.props.values.sst_perkawinan} onChange={this.props.handleFormData("sst_perkawinan")} multiple={false} className="form-control" required>
                                            <option value={"1"}>Lajang</option>
                                            <option value={"2"}>Kawin</option>
                                            <option value={"3"}>Duda</option>
                                            <option value={"4"}>Janda</option>
                                        </select>
                                </Col>
                                <Col xl={3}>
                                        <Label for="pekerjaan">Pekerjaan</Label>
                                        <select name="pekerjaan" value={this.props.values.pekerjaan} onChange={this.props.handleFormData("pekerjaan")} multiple={false} className="form-control" required>
                                            <option value={"-"}>-</option>
                                            <option value={"PNS"}>Pegawai Negeri</option>
                                            <option value={"Karyawan"}>Karyawan</option>
                                            <option value={"Wiraswasta"}>Wiraswasta</option>
                                            <option value={"Petani"}>Petani</option>
                                            <option value={"Rohaniawan"}>Rohaniawan</option>
                                            <option value={"Budayawan"}>Budayawan</option>
                                        </select>
                                </Col>
                                <Col xl={4}>
                                        <Label for="nm_ibu">Nama Ibu</Label>
                                        <Input type="text" name="nm_ibu" value={this.props.values.nm_ibu} onChange={this.props.handleFormData("nm_ibu")} ></Input>
                                </Col>                               
                                </Row>
                            </FormGroup>
                           {ButtonAct}
                           {ButtonClear}
                        </Form>
                    
            </div>
        )
    }
}