import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import AddEditForm from '../form/AddEditForm';
class ModalComponent extends Component {
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
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >
              <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
              <ModalBody>
                <AddEditForm formInput={this.props.formInput} actionform={this.props.actionform} dataprops={this.props.dataprops} toggle={this.toggle} 
                UpdateListToState={this.props.UpdateListToState}/>
              </ModalBody>
            </Modal>
          </div>
        )
      }
}
export default ModalComponent