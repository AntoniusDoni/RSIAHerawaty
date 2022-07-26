import React, { Component } from "react";
import { FormGroup, Input, Row, Col } from 'reactstrap';
import * as Icon from 'react-bootstrap-icons';
export default class Tindakan extends Component{

    render(){
        const params = new URLSearchParams(window.location.search);
        const no_reg=params.get("noreg");
      
        return(
            <>
            <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Tindakan & Pemeriksaan</li>
                    </ol>
                </nav>
                <FormGroup>
                    <Row className="justify-content-md-left mb-2 m-lg-2">
                        <Col  xl={1}><label>No. Registrasi</label></Col>
                        <Col  xl={2}>
                            <Input type="text" name="searchRm" placeholder="No RM" value={no_reg} ></Input>
                        </Col>
                        <Col  xl={1}><label>Nama Dokter</label></Col>
                        <Col  xl={3}>
                            <Input type="text" name="searchRm" placeholder="No RM" value={no_reg} onChange={this.onChangeInputSearch}></Input>
                        </Col>
                        <Col  xl={1}>
                            <button className="btn btn-primary"><Icon.PlusCircle/></button>
                        </Col>
                    </Row>

                </FormGroup>
                <FormGroup>
                    <Row className="justify-content-md-left mb-2 m-lg-2">
                        <Col  xl={1}><label>No. RM</label></Col>
                        <Col xl={2}>
                            <Input type="text" name="searchRm" placeholder="No RM" value={no_reg} ></Input>
                        </Col>
                        <Col xl={1}><label>Nama Pasien</label></Col>
                        <Col xl={3}>
                            <Input type="text" name="searchRm" placeholder="No RM" value={no_reg}></Input>
                        </Col>
                        <Col  xl={1}>
                            <button className="btn btn-primary"><Icon.PlusCircle/></button>
                        </Col>
                    </Row>

                </FormGroup>
            </>
        )
    }
}