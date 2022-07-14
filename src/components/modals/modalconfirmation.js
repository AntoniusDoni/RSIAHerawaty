import React, { Component } from 'react';
import { Modal, ModalHeader } from 'reactstrap'

class Modalconfirmation extends Component {
    constructor(props) {
        super(props)
        this.state = {
          modal: false
        }
      }
    
      
      render(){
    
        const closeBtn = <button type="button" className="btn-close"  aria-label="Close" onClick={this.props.toggle}></button>
        const labelcomponent=this.props.labelcomponent
        return(
            <Modal isOpen={this.props.isopen} toggle={this.props.toggle} >
              <ModalHeader toggle={this.toggle} close={closeBtn}>{labelcomponent}</ModalHeader>
              {/* <ModalBody>
                <h3>{labelcomponent}</h3>
              </ModalBody> */}
            </Modal>
        )
      }
}
export default Modalconfirmation