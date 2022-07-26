import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import LoginComponents from "./components/LoginComponents"
import HomeComponents from "./components/HomeComponents"
import Provinsi from "./components/master/Provinsi"
import Kabupaten from "./components/master/Kabupaten"
import Kecamatan from './components/master/Kecamatan';
import Kelurahan from './components/master/Kelurahan';
import Dokter from './components/master/Dokter';
import Poli from './components/master/Poli';
import Bangsal from './components/master/Bangsal';
import Kamar from './components/master/Kamar';
import Jadwal from './components/master/Jadwal';
import Perusahaan from './components/master/Perusahaan';
import Pasien from './components/master/Pasien';
import TindakanRalan from './components/master/TindakanRalan';
import TindakanRanap from './components/master/TindakanRanap';
import TindakanRo from './components/master/TIndakanRo';
import TindakanLab from './components/master/TindakanLab';
import TindakanOk from './components/master/TindakanOk';
import { history } from './helpers/history';
import Penjamin from './components/master/Penjamin';
import Registrasipoli from './components/registrasi/Registrasipoli';
import Ralan from './components/ralan/Ralan';
import Tindakan from './components/ralan/Tindakan';
import SettingMaster from './components/settingMaster';

function AppRouter() {
    
    return(
        <BrowserRouter history={history}>
            <Routes>
                <Route path="/"  element={<LoginComponents/>}/>
                <Route path="/home"   element={<HomeComponents/>}/>
                <Route path="/provinsi"  element={<Provinsi/>}/>
                <Route path="/kabupaten"  element={<Kabupaten/>}/>
                <Route path="/kecamatan"  element={<Kecamatan/>}/>
                <Route path="/kelurahan"  element={<Kelurahan/>}/>
                <Route path="/dokter"  element={<Dokter/>}/>
                <Route path="/poli"  element={<Poli/>}/>
                <Route path="/bangsal"  element={<Bangsal/>}/>
                <Route path="/kamar"  element={<Kamar/>}/>
                <Route path="/jadwal"  element={<Jadwal/>}/>
                <Route path="/penjamin"  element={<Penjamin/>}/>
                <Route path="/iks"  element={<Perusahaan/>}/>
                <Route path="/pasien"  element={<Pasien/>}/>
                <Route path="/tindakan-rajal"  element={<TindakanRalan/>}/>
                <Route path="/tindakan-ranap"  element={<TindakanRanap/>}/>
                <Route path="/tindakan-ro"  element={<TindakanRo/>}/>
                <Route path="/tindakan-lab"  element={<TindakanLab/>}/>
                <Route path="/tindakan-ok"  element={<TindakanOk/>}/>
                <Route path="/registrasi/poli"  element={<Registrasipoli/>}/>
                <Route path="/registrasi/igd"  element={<Registrasipoli/>}/>
                <Route path="/ralan"  element={<Ralan/>}/>
                <Route path="/tindakan"  element={<Tindakan/>}/>
                <Route path="/setting"  element={<SettingMaster/>}/>
            </Routes>
        </BrowserRouter>
    )
}
export default AppRouter;
