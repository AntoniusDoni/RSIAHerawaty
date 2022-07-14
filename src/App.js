import React,{Component} from "react";
import "bootstrap/dist/css/bootstrap.css";
import './App.css';
import AppRouter from './AppRouter';
import { connect } from "react-redux";
import { setting } from "./actions/auth";
import { history } from './helpers/history';
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import { Navbar, Nav, Container } from 'react-bootstrap';
import Navigation from './components/NavBar/Navbar';

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      // showSuperAdminBoard: false,
      // showAdminBoard: false,
      currentUser: undefined,
      title: "",
      address: '',
      menus:[]
    };
    history.listen((location) => {
      props.dispatch(clearMessage()); // clear message when changing location
    });
  }
  getSetting() {
    const { dispatch } = this.props;
    dispatch(setting()).then(
      () => {

      }
    )
  }
  componentDidMount() {
    this.getSetting();
    const user = this.props.user;
    // const setting = this.props.setting.settings;
    if (this.props.setting.settings) {
      this.setState({title:  this.props.setting.settings[0].attr })   
    }
    if (user) {
      this.setState({
        currentUser: user,
        menus:user.menus
      });
     
   
    }

  }
  logOut() {
    this.props.dispatch(logout());
  }
  render(){
    document.title = this.state.title
    const { currentUser } = this.state;
    return(
      <div className="App">
     
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
       
          <Navbar expand="lg" className="navbar-dark navbar-nav bg-moster-admin">
            <Container fluid>
              <Navbar.Brand href="/">{this.state.title}</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
              {currentUser?(<>
                <Nav className="me-auto">
                  <Navigation menus={this.state.menus} />
                </Nav>
                <Nav className="justify-content-end">
                  <Nav.Link href="/" onClick={this.logOut}>
                    Sign Out
                  </Nav.Link>
                </Nav>
              </>):(<></>)}
              </Navbar.Collapse>
            </Container>
          </Navbar>
        
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <AppRouter />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { user } = state.auth;
  const { setting } = state.setting;
  return {
    user, setting
  };
}
export default connect(mapStateToProps)(App);
