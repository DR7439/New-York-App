import React, { useState } from "react";
import {Modal, InputNumber, Slider, Button} from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import PaymentModal  from "./PaymentModal";

export default function CreditAmountModal(){
    const [CreditAmount, setCreditAmount] = useState(0);
    const [cost, setCost] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const price = cost*0.1


    const handleCreditNumber = (value)=>{
        setCreditAmount(value)
        setCost(value)
    }

    const showModal = () => {
        setIsModalOpen(true);
      };
    
    const closeModal = () => {
    setIsModalOpen(false);
    setCreditAmount(0);
    setCost(0);

    };

    const handleOK = ()=>{
        setIsPaymentModalOpen(true)
        setIsModalOpen(false);
    }

   

    return(
        <>
        <Button onClick={showModal} type="primary" icon={<ShoppingOutlined />} >
            Top Up Credit
          </Button>
        <Modal title="Enter the number of credits you would like to purchase." centered={true}  open={isModalOpen} onCancel={closeModal} okText="Proceed to Payment"  onOk={handleOK} >
            <InputNumber value={CreditAmount} onChange={handleCreditNumber} min={0} max={1000}/>
            <Slider step={5} value={CreditAmount} onChange={handleCreditNumber} min={0} max={1000}/>
            <div value={CreditAmount}>Number of Credits: {CreditAmount}</div>
            <div value={price}>Total Cost: ${(price).toFixed(2)}</div>
        </Modal>

        {isPaymentModalOpen && (
        <PaymentModal 
          centered={true}
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          creditAmount={CreditAmount}
          price={price}
          
        />
      )}
        </>
        
        
    )
}