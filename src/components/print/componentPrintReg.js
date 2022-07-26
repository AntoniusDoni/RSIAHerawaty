import React, { Component } from "react";
import style from '../../printRegister.module.css'
import padLeadingZeros from '../PadLeadingZeros'
const { REACT_APP_API_HOST } = process.env;
export class ComponentPrintReg extends Component {

    render(){
        // console.log(this.props.dataprint)
        var no_rm=0;
        let nm_pasien="";
        let jk="";
        let alamat="";
        let umur="";
        let nama_poli="";
        let nm_dokter="";
         if(this.props.dataprint.pasien){
        no_rm=this.props.dataprint.pasien.no_rm;
        nm_pasien=this.props.dataprint.pasien.nm_pasien;
        umur=this.props.dataprint.umurdaftar;
        nama_poli=this.props.dataprint.poli.nama_poli;
        nm_dokter=this.props.dataprint.dokter.nm_dokter;
        if(this.props.dataprint.pasien.jk===1){
            jk="Perempuan";
        }else{
            jk="Laki-Laki"
        }
        alamat=this.props.dataprint.pasien.alamat + "," + this.props.dataprint.pasien.kelurahan.nm_kel + ", " + this.props.dataprint.pasien.kelurahan.kecamatan.nm_kec + ", " + this.props.dataprint.pasien.kelurahan.kecamatan.kabupaten_kotum.nm_kab + "," + this.props.dataprint.pasien.kelurahan.kecamatan.kabupaten_kotum.provinsi.nm_pro;
        var incriment=1;
        if(no_rm.toString().length<3){
            incriment=3;
        }
    }

        var digitLength=no_rm.toString().length+incriment;  
        return(
            <div className={style.printContent}>
            <header>
            <img
            src={REACT_APP_API_HOST+"/"+this.props.setting[2].attr}
            alt="profile-img"
            className="profile-img-card"
          />
            <h3>{this.props.setting[0].attr}</h3>
            <h5>{this.props.setting[1].attr}</h5>
                </header>
                <div className={style.printBody}>
                <h4>BUKTI REGISTER PENDAFTARAN</h4>
                <table>
                <tbody>
                    <tr>
                        <td style={{width:"30%"}}>No Registrasi</td>
                        <td style={{width:"2%"}}>:</td>
                        <td style={{width:"68%"}}>{this.props.dataprint.no_reg}</td>
                    </tr>
                    <tr>
                        <td>Tanggal</td>
                        <td>:</td>
                        <td>{this.props.dataprint.tgl_reg}</td>
                    </tr>
                    <tr>
                        <td>No RM</td>
                        <td>:</td>
                        <td>{padLeadingZeros(no_rm,digitLength)}</td>
                    </tr>
                    <tr>
                        <td>Nama</td>
                        <td>:</td>
                        <td>{nm_pasien}</td>
                    </tr>
                    <tr>
                        <td>Jenis Kelamin</td>
                        <td>:</td>
                        <td>{jk}</td>
                    </tr>
                    <tr>
                        <td>Alamat</td>
                        <td>:</td>
                        <td>{alamat}</td>
                    </tr>
                    <tr>
                        <td>Umur</td>
                        <td>:</td>
                        <td>{umur}</td>
                    </tr>
                    <tr>
                        <td>Poli</td>
                        <td>:</td>
                        <td>{nama_poli}</td>
                    </tr>
                    <tr>
                        <td>Dokter</td>
                        <td>:</td>
                        <td>{nm_dokter}</td>
                    </tr>
                    <tr>
                        <td>Cara Bayar</td>
                        <td>:</td>
                        <td>{this.props.dataprint.stts_daftar === 1 ? (<>Umum</>) : this.props.dataprint.stts_daftar === 2 ? (<>BPJS</>) : (<>IKS</>)}</td>
                    </tr>
                    </tbody>
                </table>
                <br></br>
               <p className={style.center}>Terima Kasih Atas Kepercayaan Anda</p>
               <p className={style.center}>Bawalah Kartu Berobat setiap Berkunjung ke Rumah Sakit</p>
                </div>
            </div>
        )
    }
}