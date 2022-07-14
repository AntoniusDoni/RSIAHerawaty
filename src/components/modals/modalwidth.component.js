import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import AddEdithRowForm from '../form/AddEdithRowForm';
class ModalwidthComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
          modal: false
        }
      }
    
      toggle = () => {
        this.setState(prevState => ({
          modal: !prevState.modal
        }))
      }

      render(){
        const closeBtn = <button type="button" className="btn-close"  aria-label="Close" onClick={this.toggle}></button>
        const label = this.props.buttonLabel
        const labelcomponent=this.props.labelcomponent
        let button = ''
        let title = ''
        if(label === 'Ubah'){
            button = <Button
                      color="success"
                      onClick={this.toggle}
                      style={{float: "left", marginRight:"10px",marginBottom:"10px"}}>{label}
                    </Button>
            title = 'Ubah '+labelcomponent
            // this.props.UpdateListToState();
          } else {
            button = <Button
                      color="primary"
                      onClick={this.toggle}
                      style={{float: "left", marginRight:"10px",marginBottom:"10px",marginTop:"40px"}}>{label}
                    </Button>
            title = 'Tambah '+labelcomponent
            
          }
         
        return(
            <div>
            {button}
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} id="modal-width">
              <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
              <ModalBody>
                <AddEdithRowForm formInput={this.props.formInput} actionform={this.props.actionform} dataprops={this.props.dataprops} toggle={this.toggle} 
                UpdateListToState={this.props.UpdateListToState}/>
              </ModalBody>
            </Modal>
          </div>
        )
      }
}
export default ModalwidthComponent