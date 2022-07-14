import React, { Component } from "react";
import style from '../../printRegister.module.css'
import padLeadingZeros from '../PadLeadingZeros'
export class ComponentPrintReg extends Component {

    render(){
        // console.log(this.props.dataprint)
        var no_rm=0;
        let nm_pasien="";
        let jk="";
        let alamat="";
         if(this.props.dataprint.pasien){
        no_rm=this.props.dataprint.pasien.no_rm;
        nm_pasien=this.props.dataprint.pasien.nm_pasien;
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
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
            <h3>{this.props.setting[0].attr}</h3>
            <h5>{this.props.setting[2].attr}</h5>
                </header>
                <div className={style.printBody}>
                <h4>BUKTI REGISTER PENDAFTARAN</h4>
                <p className={style.leftTitle}>No Registrasi</p> <p className={style.left}> :</p><p className={style.left}> {this.props.dataprint.no_reg}</p>
                <div className="clearfix"></div>
                <p className={style.leftTitle}>Tanggal</p> <p className={style.left}> :</p><p className={style.left}> {this.props.dataprint.tgl_reg}</p>
                <div className="clearfix"></div>               
                <p className={style.leftTitle}>No RM</p> <p className={style.left}> :</p><p className={style.left}> {padLeadingZeros(no_rm,digitLength)}</p>
                <div className="clearfix"></div>  
                <p className={style.leftTitle}>Nama</p> <p className={style.left}> :</p><p className={style.left}> {nm_pasien}</p>
                <div className="clearfix"></div>  
                <p className={style.leftTitle}>Jenis Kelamin</p> <p className={style.left}> :</p><p className={style.left}> {jk}</p>
                <div className="clearfix"></div>  
                <p className={style.leftTitle}>Alamat</p> <p className={style.left}> :</p><p className={style.address}> {alamat}</p>
                <div className="clearfix"></div> 

                <p>No. Telp</p>
                <p>Umur</p>
                <p>Poli</p>
                <p>Dokter</p>
                <p>Jns Bayar</p>
                </div>
            </div>
        )
    }
}